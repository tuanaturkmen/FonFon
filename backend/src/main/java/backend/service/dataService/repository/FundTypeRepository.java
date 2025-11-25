package backend.service.dataService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.FundType;

public interface FundTypeRepository extends JpaRepository<FundType, Long> {

	
}
