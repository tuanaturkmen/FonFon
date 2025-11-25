package backend.service.dataService.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.service.dataService.entity.Fund;

public interface FundRepository extends JpaRepository<Fund, Long> {
	
}
