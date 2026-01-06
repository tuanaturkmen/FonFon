package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.PriorityQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.exceptions.NotFoundException;
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

	// ---------- Helper mapping ----------

	private FundForUI toDto(Fund fund, FundPrice fp) {
		FundForUI dto = new FundForUI();
		dto.setCode(fund.getCode());
		dto.setName(fund.getName());

		if (fund.getType() != null) {
			dto.setType(fund.getType().getName());
		}

		if (fp != null) {
			dto.setDate(fp.getDate());
			dto.setPrice(fp.getPrice());
			dto.setCirculatingUnits(fp.getCirculatingUnits());
			dto.setInvestorCount(fp.getInvestorCount());
			dto.setTotalValue(fp.getTotalValue());
		}

		return dto;
	}

	// ---------- 1) All funds with their LATEST price (optimized) ----------

	public List<FundForUI> getAllFundsForUI() {
		// One query for all funds
		List<Fund> funds = fundRepository.findAll();

		// One query for all latest prices (no N+1)
		List<FundPrice> latestPrices = fundPriceRepository.findLatestPriceForAllFunds();

		// Map: fundId -> latest price
		Map<Long, FundPrice> latestByFundId = new HashMap<>();
		for (FundPrice fp : latestPrices) {
			Fund fund = fp.getFund();
			if (fund != null && fund.getId() != null) {
				latestByFundId.put(fund.getId(), fp);
			}
		}

		List<FundForUI> response = new ArrayList<>(funds.size());

		for (Fund fund : funds) {
			FundPrice latest = null;
			if (fund.getId() != null) {
				latest = latestByFundId.get(fund.getId());
			}
			response.add(toDto(fund, latest));
		}

		return response;
	}

	// ---------- 2) Single fund with history (code + optional date range)
	// ----------

	public List<FundForUI> getFundForUIByCodeAndOptionalDateRange(String code, LocalDate startDate, LocalDate endDate) {
		Fund fund = fundRepository.findByCode(code)
				.orElseThrow(() -> new NotFoundException("Fund not found with code: " + code));

		List<FundPrice> prices;
		if (startDate != null && endDate != null) {
			prices = fundPriceRepository.findByFundAndDateBetweenOrderByDate(fund, startDate, endDate);
		} else {
			prices = fundPriceRepository.findByFundOrderByDate(fund);
		}

		List<FundForUI> result = new ArrayList<>(prices.size());

		for (FundPrice fp : prices) {
			result.add(toDto(fund, fp));
		}

		return result;
	}

	// ---------- 3) All funds in a date range (you already had a good query)
	// ----------

	public List<FundForUI> getFundsForUIByDateRange(LocalDate date) {
		// Assumes this query already does JOIN FETCH fund and type
		List<FundPrice> prices = fundPriceRepository.findByDateWithFund(date);
		List<FundForUI> result = new ArrayList<>(prices.size());

		for (FundPrice fp : prices) {
			Fund fund = fp.getFund();
			result.add(toDto(fund, fp));
		}

		return result;
	}

	// ---------- 4) Funds whose LATEST price is in [minPrice, maxPrice] (optimized)
	// ----------

	public List<FundForUI> getFundsByLatestPriceInRange(BigDecimal minPrice, BigDecimal maxPrice) {

		// Instead of: findAll funds + query latest for each fund (N+1),
		// we query directly for the latest FundPrice rows in range.
		List<FundPrice> latestInRange = fundPriceRepository.findLatestPriceInRange(minPrice, maxPrice);

		List<FundForUI> result = new ArrayList<>(latestInRange.size());

		for (FundPrice fp : latestInRange) {
			Fund fund = fp.getFund();
			result.add(toDto(fund, fp));
		}

		return result;
	}

	// ---------- 5) Search (still TODO) ----------

	public List<FundForUI> search(FundSearchRequest request) {
		// TODO: implement when you decide criteria
		return List.of();
	}

	// ---------- 6) Top 5 by change (already optimized with heap) ----------

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

		// Now best5 contains at most 5 snapshots in a heap
		List<FundChangeSnapshot> topList = new ArrayList<>(best5);
		topList.sort(Comparator.comparing(FundChangeSnapshot::getChange).reversed());

		List<FundForUI> result = new ArrayList<>(topList.size());
		for (FundChangeSnapshot snap : topList) {
			FundForUI dto = toDto(snap.getFund(), snap.getEndPriceRow());
			dto.setChange(snap.getChange());
			result.add(dto);
		}

		return result;
	}
}
