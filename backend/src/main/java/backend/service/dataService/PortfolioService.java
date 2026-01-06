package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.exceptions.BadRequestException;
import backend.exceptions.NotFoundException;
import backend.frontendModels.FundChangeSummaryForUI;
import backend.frontendModels.PortfolioForUI;
import backend.frontendModels.PortfolioForUI.PortfolioFundForUI;
import backend.frontendModels.PortfolioValuePointForUI;
import backend.frontendModels.PortfolioValuesResponseForUI;
import backend.frontendModels.RequestModels.CreatePortfolioRequest;
import backend.frontendModels.RequestModels.CreatePortfolioRequest.FundAllocationRequest;
import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;
import backend.service.dataService.entity.Portfolio;
import backend.service.dataService.entity.PortfolioFund;
import backend.service.dataService.repository.FundPriceRepository;
import backend.service.dataService.repository.FundRepository;
import backend.service.dataService.repository.PortfolioFundRepository;
import backend.service.dataService.repository.PortfolioRepository;
import jakarta.persistence.EntityManager;

@Service

public class PortfolioService {

	@Autowired
	private PortfolioRepository portfolioRepository;
	@Autowired
	private FundRepository fundRepository;
	@Autowired
	private FundPriceRepository fundPriceRepository;
	@Autowired
	private PortfolioFundRepository portfolioFundRepository;
	@Autowired
	private EntityManager entityManager;

	@Transactional
	public PortfolioForUI createPortfolio(CreatePortfolioRequest request, Long userId) {

		// 1) Basic validation
		if (request.getAllocations() == null || request.getAllocations().isEmpty()) {
			throw new BadRequestException("Portfolio must have at least one fund allocation.");
		}

		if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
			throw new BadRequestException("Total amount must be positive.");
		}

		BigDecimal sum = request.getAllocations().stream().map(FundAllocationRequest::getAllocationPercent)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		// Optional strict check: sum must be 100
		if (sum.compareTo(BigDecimal.valueOf(100)) != 0) {
			throw new BadRequestException("Sum of allocation percentages must be 100. Current sum: " + sum);
		}

		// 2) Create Portfolio entity
		Portfolio portfolio = new Portfolio();
		portfolio.setCreationTime(request.getCreationTime());
		portfolio.setUserId(userId);
		portfolio.setName(request.getName());
		portfolio.setTotalAmount(request.getTotalAmount());

		List<PortfolioFund> pfEntities = new ArrayList<>();
		portfolioCreationHelper(request, portfolio, pfEntities);
		portfolio.setFunds(pfEntities);

		// 4) Save whole graph (Portfolio + its PortfolioFunds)
		Portfolio saved = portfolioRepository.save(portfolio);

		// 5) Map to UI DTO
		return toDto(saved, request.getTotalAmount());
	}

	private void portfolioCreationHelper(CreatePortfolioRequest request, Portfolio portfolio,
			List<PortfolioFund> pfEntities) {

		// 3) For each allocation, compute owned_units using latest price
		for (FundAllocationRequest alloc : request.getAllocations()) {

			Fund fund = fundRepository.findByCode(alloc.getFundCode())
					.orElseThrow(() -> new NotFoundException("Fund not found with code: " + alloc.getFundCode()));

			FundPrice priceBD = fundPriceRepository
					.findOneByCodeAndDateWithFund(fund.getCode(), request.getCreationTime())
					.orElseThrow(() -> new NotFoundException(
							"No price data for fund: " + fund.getCode() + " for date " + request.getCreationTime()));

			BigDecimal price = priceBD.getPrice();
			if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
				throw new BadRequestException(
						"Invalid price for fund: " + fund.getCode() + " for date " + request.getCreationTime());
			}

			// How much money goes into this fund:
			BigDecimal allocationAmount = request.getTotalAmount().multiply(alloc.getAllocationPercent())
					.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

			// owned_units = allocationAmount / price
			BigDecimal ownedUnits = allocationAmount.divide(price, 4, RoundingMode.HALF_UP);

			PortfolioFund pf = new PortfolioFund();
			pf.setPortfolio(portfolio);
			pf.setFund(fund);
			pf.setAllocationPercent(alloc.getAllocationPercent());
			pf.setOwnedUnits(ownedUnits);

			pfEntities.add(pf);
		}
	}

	public List<PortfolioForUI> getPortfoliosByUser(Long userId) {
		List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
		List<PortfolioForUI> result = new ArrayList<>();

		for (Portfolio p : portfolios) {
			result.add(toDto(p, p.getTotalAmount()));
		}

		return result;
	}

	private PortfolioForUI toDto(Portfolio portfolio, BigDecimal totalAmount) {
		PortfolioForUI dto = new PortfolioForUI();
		dto.setId(portfolio.getId());
		dto.setUserId(portfolio.getUserId());
		dto.setName(portfolio.getName());
		dto.setTotalAmount(totalAmount);
		dto.setCreationTime(portfolio.getCreationTime());

		List<PortfolioFundForUI> funds = new ArrayList<>();

		BigDecimal currentValueOfPortfolio = BigDecimal.ZERO;
		for (PortfolioFund pf : portfolio.getFunds()) {
			Fund fund = pf.getFund();

			PortfolioFundForUI fDto = new PortfolioFundForUI();
			fDto.setFundCode(fund.getCode());
			fDto.setFundName(fund.getName());
			fDto.setAllocationPercent(pf.getAllocationPercent());
			fDto.setOwnedUnits(pf.getOwnedUnits());

			BigDecimal currentValue = BigDecimal.ZERO; // Default to ZERO instead of null for safety

			var latestOpt = fundPriceRepository.findFirstByFundOrderByDateDesc(fund);

			// Check if data exists
			if (latestOpt.isPresent() && latestOpt.get().getPrice() != null && pf.getOwnedUnits() != null) {
				BigDecimal latestPrice = latestOpt.get().getPrice();
				currentValue = pf.getOwnedUnits().multiply(latestPrice).setScale(2, RoundingMode.HALF_UP);
			}

			fDto.setCurrentValue(currentValue);
			funds.add(fDto);

			// 3. Add to the running total
			// Because we defaulted currentValue to ZERO above, this is now safe
			currentValueOfPortfolio = currentValueOfPortfolio.add(currentValue);
		}
		dto.setCurrentValue(currentValueOfPortfolio);
		dto.setFunds(funds);
		return dto;
	}

	public void deletePortfolio(Long userId, Long portfolioId) {
		// Load the portfolio or fail with 404 style
		Portfolio portfolio = portfolioRepository.findById(portfolioId)
				.orElseThrow(() -> new NotFoundException("Portfolio not found: " + portfolioId));

		// Safety: ensure it belongs to this user
		if (!portfolio.getUserId().equals(userId)) {
			throw new BadRequestException("Portfolio does not belong to user: " + userId);
		}

		// This will also delete PortfolioFund rows because:
		// - JPA: @OneToMany(cascade = ALL, orphanRemoval = true) (if you have it)
		// - DB: portfolio_funds has FK portfolio_id ON DELETE CASCADE
		portfolioRepository.delete(portfolio);
	}

	public PortfolioValuesResponseForUI getPortfolioValuesOverDateRange(Long userId, Long portfolioId,
			LocalDate startDate, LocalDate endDate) {

		if (endDate.isBefore(startDate)) {
			throw new BadRequestException("endDate must not be before startDate");
		}

		// 1️⃣ Load portfolio & ensure it belongs to this user
		Portfolio portfolio = portfolioRepository.findById(portfolioId)
				.orElseThrow(() -> new NotFoundException("Portfolio not found: " + portfolioId));

		if (!portfolio.getUserId().equals(userId)) {
			throw new BadRequestException("Portfolio does not belong to user: " + userId);
		}

		List<PortfolioFund> pfList = portfolio.getFunds();
		if (pfList == null || pfList.isEmpty()) {
			PortfolioValuesResponseForUI empty = new PortfolioValuesResponseForUI();
			empty.setPoints(Collections.emptyList());
			empty.setFundChanges(Collections.emptyList());
			return empty;
		}

		// 2️⃣ Map<LocalDate, BigDecimal> to accumulate total value per date
		// Use TreeMap to keep keys sorted by date
		Map<LocalDate, BigDecimal> totalsByDate = new TreeMap<>();
		List<FundChangeSummaryForUI> fundChanges = new ArrayList<>();

		for (PortfolioFund pf : pfList) {
			Fund fund = pf.getFund();
			BigDecimal ownedUnits = pf.getOwnedUnits();

			if (fund == null || ownedUnits == null || ownedUnits.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			// Get all prices for this fund in the date range
			List<FundPrice> prices = fundPriceRepository.findByFundAndDateBetweenOrderByDate(fund, startDate, endDate);
			if (prices == null || prices.isEmpty()) {
				// no price data for this fund in that range -> skip for both totals & change
				continue;
			}

			for (FundPrice fp : prices) {
				if (fp.getPrice() == null) {
					continue;
				}

				LocalDate date = fp.getDate();
				BigDecimal contribution = ownedUnits.multiply(fp.getPrice()).setScale(2, RoundingMode.HALF_UP); // money-like

				totalsByDate.merge(date, contribution, BigDecimal::add);
			}

			FundPrice startFp = prices.get(0);
			FundPrice endFp = prices.get(prices.size() - 1);

			BigDecimal startPrice = startFp.getPrice();
			BigDecimal endPrice = endFp.getPrice();

			if (startPrice == null || endPrice == null || startPrice.compareTo(BigDecimal.ZERO) == 0) {
				// can't compute change safely
				continue;
			}

			BigDecimal percentChange = endPrice.subtract(startPrice) // Δ = end - start
					.divide(startPrice, 6, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)); // in %

			FundChangeSummaryForUI changeDto = new FundChangeSummaryForUI();
			changeDto.setFundCode(fund.getCode());
			changeDto.setAllocationPercent(pf.getAllocationPercent());
			changeDto.setPercentChange(percentChange);

			fundChanges.add(changeDto);
		}

		// 3️⃣ Convert the map into a sorted list of DTOs
		List<PortfolioValuePointForUI> points = new ArrayList<>();

		for (Map.Entry<LocalDate, BigDecimal> entry : totalsByDate.entrySet()) {
			PortfolioValuePointForUI dto = new PortfolioValuePointForUI();
			dto.setDate(entry.getKey());
			dto.setTotalValue(entry.getValue());
			points.add(dto);
		}

		PortfolioValuesResponseForUI response = new PortfolioValuesResponseForUI();
		response.setPoints(points);
		response.setFundChanges(fundChanges);

		return response;
	}

	@Transactional
	public PortfolioForUI updatePortfolio(Long portfolioId, CreatePortfolioRequest request, Long userId) {

		// Load portfolio and validate user
		Portfolio portfolio = portfolioRepository.findById(portfolioId)
				.orElseThrow(() -> new NotFoundException("Portfolio not found: " + portfolioId));

		// Optional safety: ensure the incoming userId matches portfolio owner
		if (!portfolio.getUserId().equals(userId)) {
			throw new BadRequestException("Portfolio does not belong to user: " + userId);
		}

		// Update basic fields
		portfolio.setName(request.getName()); // new name
		portfolio.setTotalAmount(request.getTotalAmount()); // new investment amount
		portfolio.setCreationTime(request.getCreationTime());

		portfolioFundRepository.deleteByPortfolioId(portfolio.getId());
		entityManager.flush();
		// Clear old funds (orphanRemoval = true + cascade = ALL will handle DB deletes)
		if (portfolio.getFunds() != null) {
			portfolio.getFunds().clear();
		} else {
			portfolio.setFunds(new ArrayList<>());
		}

		// Rebuild funds from request (same logic as create)
		BigDecimal hundred = BigDecimal.valueOf(100);

		if (request.getAllocations() != null) {
			portfolioCreationHelper(request, portfolio, portfolio.getFunds());
		}

		Portfolio saved = portfolioRepository.save(portfolio);

		// Map to UI DTO (reuse your mapping logic)
		return toDto(saved, request.getTotalAmount());
	}

	public Long getBestPerformingPortfolioId(Long userId) {

		// Reuse existing mapping logic – this gives us totalAmount & currentValue
		List<PortfolioForUI> portfolios = getPortfoliosByUser(userId);

		if (portfolios == null || portfolios.isEmpty()) {
			return null;
		}

		PortfolioForUI best = null;
		BigDecimal bestChange = null; // percent

		for (PortfolioForUI p : portfolios) {
			BigDecimal totalAmount = p.getTotalAmount();
			BigDecimal currentValue = p.getCurrentValue();

			if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0 || currentValue == null) {
				continue;
			}

			// (current - initial) / initial * 100
			BigDecimal changePercent = currentValue.subtract(totalAmount).divide(totalAmount, 6, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(100));

			if (best == null || changePercent.compareTo(bestChange) > 0) {
				best = p;
				bestChange = changePercent;
			}
		}

		return (best != null) ? best.getId() : null;
	}
}
