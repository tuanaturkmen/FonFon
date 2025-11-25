package backend.service.dataService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.Fund;

public interface FundRepository extends JpaRepository<Fund, Long> {

	Optional<Fund> findByCode(String code);
}
