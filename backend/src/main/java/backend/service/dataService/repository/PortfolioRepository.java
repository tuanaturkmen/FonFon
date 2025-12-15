package backend.service.dataService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
	List<Portfolio> findByUserId(Long userId);
}
