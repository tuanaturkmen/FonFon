package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.exceptions.BadRequestException;
import backend.exceptions.FxRateNotFoundException;
import backend.frontendModels.FxBenchmarkPointForUI;
import backend.service.dataService.entity.ExchangeRate;
import backend.service.dataService.repository.ExchangeRateRepository;

@Service
public class ExchangeRateService {

	@Autowired
	private ExchangeRateRepository exchangeRateRepository;

	/**
	 * Simulate: if I invested `amount` into USD on startDate (using usd_sell_rate),
	 * what would that position be worth on each day in [startDate, endDate]?
	 */
	public List<FxBenchmarkPointForUI> getUsdBenchmarkSeries(BigDecimal amount, LocalDate startDate,
			LocalDate endDate) {

		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new BadRequestException("amount must be positive");
		}
		if (endDate.isBefore(startDate)) {
			throw new BadRequestException("endDate must not be before startDate");
		}

		// 1️⃣ Find rate on startDate to compute owned units
		ExchangeRate startRate = exchangeRateRepository.findByDate(startDate)
				.orElseThrow(() -> new FxRateNotFoundException("USD", startDate));

		BigDecimal sellRate = startRate.getUsdSellRate();
		if (sellRate == null || sellRate.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalStateException("Invalid usd_sell_rate for " + startDate + ": " + sellRate);
		}

		// ownedUsd = amount / usd_sell_rate(startDate)
		BigDecimal ownedUsd = amount.divide(sellRate, 8, RoundingMode.HALF_UP); // high precision for units

		// 2️⃣ For each date, value(date) = ownedUsd * usd_buy_rate(date)
		List<ExchangeRate> allRates = exchangeRateRepository.findByDateBetweenOrderByDate(startDate, endDate);

		if (allRates == null || allRates.isEmpty()) {
			return Collections.emptyList();
		}

		List<FxBenchmarkPointForUI> result = new ArrayList<>();

		for (ExchangeRate er : allRates) {
			if (er.getUsdBuyRate() == null) {
				continue;
			}

			BigDecimal dailyValue = ownedUsd.multiply(er.getUsdBuyRate()).setScale(2, RoundingMode.HALF_UP); // “money-like”

			FxBenchmarkPointForUI dto = new FxBenchmarkPointForUI();
			dto.setDate(er.getDate());
			dto.setValue(dailyValue);
			result.add(dto);
		}

		return result;
	}

	// You can do the exact same logic for EUR if you want:
	public List<FxBenchmarkPointForUI> getEurBenchmarkSeries(BigDecimal amount, LocalDate startDate,
			LocalDate endDate) {

		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("amount must be positive");
		}
		if (endDate.isBefore(startDate)) {
			throw new IllegalArgumentException("endDate must not be before startDate");
		}

		ExchangeRate startRate = exchangeRateRepository.findByDate(startDate)
				.orElseThrow(() -> new FxRateNotFoundException("EURO", startDate));

		BigDecimal eurSell = startRate.getEurSellRate();
		if (eurSell == null || eurSell.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalStateException("Invalid eur_sell_rate for " + startDate + ": " + eurSell);
		}

		BigDecimal ownedEur = amount.divide(eurSell, 8, RoundingMode.HALF_UP);

		List<ExchangeRate> allRates = exchangeRateRepository.findByDateBetweenOrderByDate(startDate, endDate);

		if (allRates == null || allRates.isEmpty()) {
			return Collections.emptyList();
		}

		List<FxBenchmarkPointForUI> result = new ArrayList<>();

		for (ExchangeRate er : allRates) {
			if (er.getEurBuyRate() == null) {
				continue;
			}

			BigDecimal dailyValue = ownedEur.multiply(er.getEurBuyRate()).setScale(2, RoundingMode.HALF_UP);

			FxBenchmarkPointForUI dto = new FxBenchmarkPointForUI();
			dto.setDate(er.getDate());
			dto.setValue(dailyValue);
			result.add(dto);
		}

		return result;
	}
}
