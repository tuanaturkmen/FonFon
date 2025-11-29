package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.frontendModels.FundForUI;
import backend.frontendModels.RequestModels.FundSearchRequest;
import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;
import backend.service.dataService.repository.FundPriceRepository;
import backend.service.dataService.repository.FundRepository;

@Service
public class FundService {

	@Autowired
	private FundRepository fundRepository;
	@Autowired
	private FundPriceRepository fundPriceRepository;

	public List<FundForUI> getAllFundsForUI() {
		List<Fund> funds = fundRepository.findAll();
		List<FundForUI> response = new ArrayList<>();

		for (Fund fund : funds) {
			Optional<FundPrice> latestPriceOpt = fundPriceRepository.findFirstByFundOrderByDateDesc(fund);

			FundForUI dto = new FundForUI();
			dto.setCode(fund.getCode());
			dto.setName(fund.getName());

			// assuming Fund has getType() -> FundType and FundType has getName()
			if (fund.getType() != null) {
				dto.setType(fund.getType().getName());
			}

			latestPriceOpt.ifPresent(fp -> {
				dto.setDate(fp.getDate());
				dto.setPrice(fp.getPrice());
				dto.setCirculatingUnits(fp.getCirculatingUnits());
				dto.setInvestorCount(fp.getInvestorCount());
				dto.setTotalValue(fp.getTotalValue());
			});

			response.add(dto);
		}

		return response;
	}

	public List<FundForUI> getFundForUIByCodeAndOptionalDateRange(String code, LocalDate startDate, LocalDate endDate) {
		// 1. Find fund by code
		Fund fund = fundRepository.findByCode(code)
				.orElseThrow(() -> new IllegalArgumentException("Fund not found with code: " + code));

		// 2. Decide which repo method to call
		List<FundPrice> prices;
		if (startDate != null && endDate != null) {
			prices = fundPriceRepository.findByFundAndDateBetweenOrderByDate(fund, startDate, endDate);
		} else {
			prices = fundPriceRepository.findByFundOrderByDate(fund);
		}

		// 3. Map to DTOs
		List<FundForUI> result = new ArrayList<>();
		for (FundPrice fp : prices) {
			FundForUI dto = new FundForUI();

			dto.setCode(fund.getCode());
			dto.setName(fund.getName());
			if (fund.getType() != null) {
				dto.setType(fund.getType().getName());
			}

			dto.setDate(fp.getDate());
			dto.setPrice(fp.getPrice());
			dto.setCirculatingUnits(fp.getCirculatingUnits());
			dto.setInvestorCount(fp.getInvestorCount());
			dto.setTotalValue(fp.getTotalValue());

			result.add(dto);
		}

		return result;
	}

	public List<FundForUI> getFundsForUIByDateRange(LocalDate startDate, LocalDate endDate) {
		List<FundPrice> prices = fundPriceRepository.findByDateRangeWithFund(startDate, endDate);
		List<FundForUI> result = new ArrayList<>();

		for (FundPrice fp : prices) {
			Fund fund = fp.getFund();

			FundForUI dto = new FundForUI();
			dto.setCode(fund.getCode());
			dto.setName(fund.getName());

			if (fund.getType() != null) {
				dto.setType(fund.getType().getName());
			}

			dto.setDate(fp.getDate());
			dto.setPrice(fp.getPrice());
			dto.setCirculatingUnits(fp.getCirculatingUnits());
			dto.setInvestorCount(fp.getInvestorCount());
			dto.setTotalValue(fp.getTotalValue());

			result.add(dto);
		}

		return result;
	}

	public List<FundForUI> getFundsByLatestPriceInRange(BigDecimal minPrice, BigDecimal maxPrice) {

		List<Fund> allFunds = fundRepository.findAll();
		List<FundForUI> result = new ArrayList<>();

		for (Fund fund : allFunds) {

			Optional<FundPrice> latestPriceOpt = fundPriceRepository.findFirstByFundOrderByDateDesc(fund);

			if (!latestPriceOpt.isPresent()) {
				continue; // fund has no price history
			}

			FundPrice latest = latestPriceOpt.get();

			// ✅ NOW apply price filter to the LATEST value
			if (latest.getPrice().compareTo(minPrice) >= 0 && latest.getPrice().compareTo(maxPrice) <= 0) {

				FundForUI dto = new FundForUI();
				dto.setCode(fund.getCode());
				dto.setName(fund.getName());

				if (fund.getType() != null) {
					dto.setType(fund.getType().getName());
				}

				dto.setDate(latest.getDate());
				dto.setPrice(latest.getPrice());
				dto.setCirculatingUnits(latest.getCirculatingUnits());
				dto.setInvestorCount(latest.getInvestorCount());
				dto.setTotalValue(latest.getTotalValue());

				result.add(dto);
			}
		}

		return result;
	}

	/**
	 * Among the funds that have prices on BOTH startDate and endDate, compute
	 * percentage change and return top 5 with the largest positive change.
	 */
	public List<FundForUI> getTop5FundsByChange(LocalDate startDate, LocalDate endDate) {

		// 1. Only funds that have records on BOTH dates
		List<Fund> activeFunds = fundPriceRepository.findFundsWithPricesOnBothDates(startDate, endDate);

		List<FundForUI> candidates = new ArrayList<>();

		for (Fund fund : activeFunds) {

			// 2. Get price exactly on startDate and endDate
			Optional<FundPrice> startOpt = fundPriceRepository.findByFundAndDate(fund, startDate);

			Optional<FundPrice> endOpt = fundPriceRepository.findByFundAndDate(fund, endDate);

			if (!startOpt.isPresent() || !endOpt.isPresent()) {
				// Should not happen because of the query above,
				// but we keep this as a safety net.
				continue;
			}

			FundPrice startPriceRow = startOpt.get();
			FundPrice endPriceRow = endOpt.get();

			BigDecimal startPrice = startPriceRow.getPrice();
			BigDecimal endPrice = endPriceRow.getPrice();

			// Safety checks
			if (startPrice == null || endPrice == null || startPrice.compareTo(BigDecimal.ZERO) == 0) {
				continue;
			}

			// 3. Percentage change: (end - start) / start * 100
			BigDecimal change = endPrice.subtract(startPrice).divide(startPrice, 6, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(100)); // 25.0 = +25%

			// We only want positive change
			if (change.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			// 4. Build DTO using END snapshot (endDate)
			FundForUI dto = new FundForUI();
			dto.setCode(fund.getCode());
			dto.setName(fund.getName());
			if (fund.getType() != null) {
				dto.setType(fund.getType().getName());
			}

			dto.setDate(endPriceRow.getDate());
			dto.setPrice(endPriceRow.getPrice());
			dto.setCirculatingUnits(endPriceRow.getCirculatingUnits());
			dto.setInvestorCount(endPriceRow.getInvestorCount());
			dto.setTotalValue(endPriceRow.getTotalValue());

			dto.setChange(change);

			candidates.add(dto);
		}

		// 5. Sort by change descending and return top 5
		candidates.sort(Comparator.comparing(FundForUI::getChange).reversed());

		if (candidates.size() > 5) {
			return candidates.subList(0, 5);
		} else {
			return candidates;
		}
	}

	public List<FundForUI> search(FundSearchRequest request) {
		return null;
	}

}
