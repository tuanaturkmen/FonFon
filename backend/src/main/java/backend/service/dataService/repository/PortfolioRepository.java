package backend.service.dataService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
	// later you can add: List<Portfolio> findByUserId(Long userId);
}
