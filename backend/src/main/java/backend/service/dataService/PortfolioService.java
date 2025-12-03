package backend.service.dataService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.frontendModels.PortfolioForUI;
import backend.frontendModels.PortfolioForUI.PortfolioFundForUI;
import backend.frontendModels.RequestModels.CreatePortfolioRequest;
import backend.frontendModels.RequestModels.CreatePortfolioRequest.FundAllocationRequest;
import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;
import backend.service.dataService.entity.Portfolio;
import backend.service.dataService.entity.PortfolioFund;
import backend.service.dataService.repository.FundPriceRepository;
import backend.service.dataService.repository.FundRepository;
import backend.service.dataService.repository.PortfolioRepository;

@Service

public class PortfolioService {

	@Autowired
	private PortfolioRepository portfolioRepository;
	@Autowired
	private FundRepository fundRepository;
	@Autowired
	private FundPriceRepository fundPriceRepository;

	@Transactional
	public PortfolioForUI createPortfolio(CreatePortfolioRequest request) {

		// 1) Basic validation
		if (request.getAllocations() == null || request.getAllocations().isEmpty()) {
			throw new IllegalArgumentException("Portfolio must have at least one fund allocation.");
		}

		if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Total amount must be positive.");
		}

		BigDecimal sum = request.getAllocations().stream().map(FundAllocationRequest::getAllocationPercent)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		// Optional strict check: sum must be 100
		if (sum.compareTo(BigDecimal.valueOf(100)) != 0) {
			throw new IllegalArgumentException("Sum of allocation percentages must be 100. Current sum: " + sum);
		}

		// 2) Create Portfolio entity
		Portfolio portfolio = new Portfolio();
		portfolio.setUserId(request.getUserId());
		portfolio.setName(request.getName());

		List<PortfolioFund> pfEntities = new ArrayList<>();

		// 3) For each allocation, compute owned_units using latest price
		for (FundAllocationRequest alloc : request.getAllocations()) {

			Fund fund = fundRepository.findByCode(alloc.getFundCode()).orElseThrow(
					() -> new IllegalArgumentException("Fund not found with code: " + alloc.getFundCode()));

			FundPrice latestPrice = fundPriceRepository.findFirstByFundOrderByDateDesc(fund)
					.orElseThrow(() -> new IllegalArgumentException("No price data for fund: " + fund.getCode()));

			BigDecimal price = latestPrice.getPrice();
			if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
				throw new IllegalStateException("Invalid latest price for fund: " + fund.getCode());
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

		portfolio.setFunds(pfEntities);

		// 4) Save whole graph (Portfolio + its PortfolioFunds)
		Portfolio saved = portfolioRepository.save(portfolio);

		// 5) Map to UI DTO
		return toDto(saved, request.getTotalAmount());
	}

	private PortfolioForUI toDto(Portfolio portfolio, BigDecimal totalAmount) {
		PortfolioForUI dto = new PortfolioForUI();
		dto.setId(portfolio.getId());
		dto.setUserId(portfolio.getUserId());
		dto.setName(portfolio.getName());
		dto.setTotalAmount(totalAmount);

		List<PortfolioFundForUI> funds = new ArrayList<>();

		portfolio.getFunds().forEach(pf -> {
			Fund fund = pf.getFund();

			PortfolioFundForUI fDto = new PortfolioFundForUI();
			fDto.setFundCode(fund.getCode());
			fDto.setFundName(fund.getName());
			fDto.setAllocationPercent(pf.getAllocationPercent());
			fDto.setOwnedUnits(pf.getOwnedUnits());

			// Optional: compute latest price + marketValue
			// (you can skip this if you don't need it now)
			// Assuming fund.getPrices() is not fetched, better to refetch latest price:
			FundPrice latestPrice = fundPriceRepository.findFirstByFundOrderByDateDesc(fund).orElse(null);
			if (latestPrice != null && latestPrice.getPrice() != null) {
				fDto.setLatestPrice(latestPrice.getPrice());
				fDto.setMarketValue(
						pf.getOwnedUnits().multiply(latestPrice.getPrice()).setScale(2, RoundingMode.HALF_UP));
			}

			funds.add(fDto);
		});

		dto.setFunds(funds);
		return dto;
	}
}
