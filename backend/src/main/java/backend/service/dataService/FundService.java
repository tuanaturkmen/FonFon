package backend.service.dataService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.frontendModels.FundForUI;
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

	public List<FundForUI> getFundForUIByCodeAndDateRange(String code, LocalDate startDate, LocalDate endDate) {
		// 1. Find the fund by code
		Fund fund = fundRepository.findByCode(code)
				.orElseThrow(() -> new IllegalArgumentException("Fund not found with code: " + code));

		// 2. Get price history for that fund in the range
		List<FundPrice> prices = fundPriceRepository.findByFundAndDateBetweenOrderByDate(fund, startDate, endDate);

		// 3. Map to FundForUI list
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
}
