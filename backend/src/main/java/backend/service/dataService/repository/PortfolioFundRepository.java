package backend.service.dataService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.PortfolioFund;

public interface PortfolioFundRepository extends JpaRepository<PortfolioFund, Long> {

	void deleteByPortfolioId(Long portfolioId);
}
