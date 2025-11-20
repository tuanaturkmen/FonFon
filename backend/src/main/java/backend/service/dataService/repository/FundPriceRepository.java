package backend.service.dataService.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;

public interface FundPriceRepository extends JpaRepository<FundPrice, Integer> {
	// Used to prevent duplicate entries for the same day
	boolean existsByFundAndDate(Fund fund, LocalDate date);
}
