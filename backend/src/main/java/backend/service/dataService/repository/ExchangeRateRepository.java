package backend.service.dataService.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.ExchangeRate;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {

	List<ExchangeRate> findByDateBetweenOrderByDate(LocalDate startDate, LocalDate endDate);

	Optional<ExchangeRate> findByDate(LocalDate date);
}
