package backend.service.dataService.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;

public interface FundPriceRepository extends JpaRepository<FundPrice, Integer> {

	Optional<FundPrice> findFirstByFundOrderByDateDesc(Fund fund);

	@Query("SELECT fp " + "FROM FundPrice fp " + "JOIN FETCH fp.fund f " + "LEFT JOIN FETCH f.type t "
			+ "WHERE fp.date BETWEEN :startDate AND :endDate " + "ORDER BY f.code, fp.date")
	List<FundPrice> findByDateRangeWithFund(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

	boolean existsByFundAndDate(Fund fund, LocalDate date);

	List<FundPrice> findByFundAndDateBetweenOrderByDate(Fund fund, LocalDate startDate, LocalDate endDate);

	List<FundPrice> findByFundOrderByDate(Fund fund);

	Optional<FundPrice> findFirstByFundAndDateBetweenOrderByDateAsc(Fund fund, LocalDate startDate, LocalDate endDate);

	/**
	 * Funds that have a price on BOTH startDate and endDate. We only want funds
	 * that are present on both boundary days.
	 */
	@Query("SELECT f FROM Fund f " + "WHERE EXISTS (" + "   SELECT 1 FROM FundPrice fp1 "
			+ "   WHERE fp1.fund = f AND fp1.date = :startDate" + ") " + "AND EXISTS ("
			+ "   SELECT 1 FROM FundPrice fp2 " + "   WHERE fp2.fund = f AND fp2.date = :endDate" + ")")
	List<Fund> findFundsWithPricesOnBothDates(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

	Optional<FundPrice> findByFundAndDate(Fund fund, LocalDate date);

	@Query("""
			SELECT fp
			FROM FundPrice fp
			WHERE fp.date = (
			    SELECT MAX(fp2.date)
			    FROM FundPrice fp2
			    WHERE fp2.fund = fp.fund
			)
			""")
	List<FundPrice> findLatestPriceForAllFunds();

	@Query("""
			SELECT fp
			FROM FundPrice fp
			WHERE fp.date = (
			    SELECT MAX(fp2.date)
			    FROM FundPrice fp2
			    WHERE fp2.fund = fp.fund
			)
			AND fp.price BETWEEN :minPrice AND :maxPrice
			""")
	List<FundPrice> findLatestPriceInRange(@Param("minPrice") BigDecimal minPrice,
			@Param("maxPrice") BigDecimal maxPrice);

	@Modifying
	@Transactional
	@Query(value = """
			INSERT INTO fund_price_history
			  (fund_id, date, price, circulating_units, investor_count, total_value, created_at)
			VALUES
			  (:fundId, :date, :price, :units, :investors, :totalVal, now())
			ON CONFLICT (fund_id, date) DO NOTHING
			""", nativeQuery = true)
	int insertIgnoreDuplicate(@Param("fundId") Long fundId, @Param("date") LocalDate date,
			@Param("price") BigDecimal price, @Param("units") BigDecimal units, @Param("investors") Integer investors,
			@Param("totalVal") BigDecimal totalVal);
}
