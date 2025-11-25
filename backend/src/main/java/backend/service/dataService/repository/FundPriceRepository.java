package backend.service.dataService.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;

public interface FundPriceRepository extends JpaRepository<FundPrice, Integer> {

	Optional<FundPrice> findFirstByFundOrderByDateDesc(Fund fund);

	@Query("SELECT fp " + "FROM FundPrice fp " + "JOIN FETCH fp.fund f " + "LEFT JOIN FETCH f.type t "
			+ "WHERE fp.date BETWEEN :startDate AND :endDate " + "ORDER BY f.code, fp.date")
	List<FundPrice> findByDateRangeWithFund(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

	boolean existsByFundAndDate(Fund fund, LocalDate date);
}
