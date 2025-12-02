package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.PriorityQueue;

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

	public List<FundForUI> search(FundSearchRequest request) {
		return null;
	}

	private static class FundChangeSnapshot {
		private final Fund fund;
		private final FundPrice endPriceRow;
		private final BigDecimal change;

		public FundChangeSnapshot(Fund fund, FundPrice endPriceRow, BigDecimal change) {
			this.fund = fund;
			this.endPriceRow = endPriceRow;
			this.change = change;
		}

		public Fund getFund() {
			return fund;
		}

		public FundPrice getEndPriceRow() {
			return endPriceRow;
		}

		public BigDecimal getChange() {
			return change;
		}
	}

	public List<FundForUI> getTop5FundsByChange(LocalDate startDate, LocalDate endDate) {

		// 1. Only funds that have records on BOTH dates
		List<Fund> activeFunds = fundPriceRepository.findFundsWithPricesOnBothDates(startDate, endDate);

		// Min-heap: smallest change at the top
		PriorityQueue<FundChangeSnapshot> best5 = new PriorityQueue<>(5,
				Comparator.comparing(FundChangeSnapshot::getChange));

		for (Fund fund : activeFunds) {

			Optional<FundPrice> startOpt = fundPriceRepository.findByFundAndDate(fund, startDate);
			Optional<FundPrice> endOpt = fundPriceRepository.findByFundAndDate(fund, endDate);

			if (!startOpt.isPresent() || !endOpt.isPresent()) {
				continue;
			}

			FundPrice startPriceRow = startOpt.get();
			FundPrice endPriceRow = endOpt.get();

			BigDecimal startPrice = startPriceRow.getPrice();
			BigDecimal endPrice = endPriceRow.getPrice();

			if (startPrice == null || endPrice == null || startPrice.compareTo(BigDecimal.ZERO) == 0) {
				continue;
			}

			BigDecimal change = endPrice.subtract(startPrice).divide(startPrice, 6, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(100));

			// Only positive changes
			if (change.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			FundChangeSnapshot snapshot = new FundChangeSnapshot(fund, endPriceRow, change);

			if (best5.size() < 5) {
				best5.offer(snapshot);
			} else if (change.compareTo(best5.peek().getChange()) > 0) {
				// Current change is better than the smallest in heap
				best5.poll();
				best5.offer(snapshot);
			}
		}

		// Now best5 contains at most 5 snapshots, but in ascending order
		List<FundChangeSnapshot> topList = new ArrayList<>(best5);
		topList.sort(Comparator.comparing(FundChangeSnapshot::getChange).reversed());

		// Map to DTOs
		List<FundForUI> result = new ArrayList<>();
		for (FundChangeSnapshot snap : topList) {
			Fund fund = snap.getFund();
			FundPrice endPriceRow = snap.getEndPriceRow();

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
			dto.setChange(snap.getChange());

			result.add(dto);
		}

		return result;
	}

}
