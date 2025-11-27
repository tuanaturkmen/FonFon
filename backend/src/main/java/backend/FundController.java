package backend;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.frontendModels.FundForUI;
import backend.service.dataService.FundService;

@RestController
@RequestMapping("/api")
public class FundController {

	@Autowired
	private FundService fundService;

	@GetMapping("/funds")
	public ResponseEntity<List<FundForUI>> getAllFunds() {
		List<FundForUI> funds = fundService.getAllFundsForUI();
		return ResponseEntity.ok(funds);
	}

	// GET /api/funds/history?startDate=2025-10-17&endDate=2025-10-19
	@GetMapping("/funds/history")
	public ResponseEntity<List<FundForUI>> getFundsByDateRange(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FundForUI> funds = fundService.getFundsForUIByDateRange(startDate, endDate);
		return ResponseEntity.ok(funds);
	}

	@GetMapping("/funds/{code}/history")
	public ResponseEntity<List<FundForUI>> getFundHistoryByCode(@PathVariable("code") String code,
			@RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FundForUI> funds = fundService.getFundForUIByCodeAndOptionalDateRange(code, startDate, endDate);

		return ResponseEntity.ok(funds);
	}

	// GET /api/funds/latest-by-price?minPrice=1.5&maxPrice=3.2
	@GetMapping("/funds/latest-by-price")
	public ResponseEntity<List<FundForUI>> getFundsByLatestPriceInRange(@RequestParam("minPrice") BigDecimal minPrice,
			@RequestParam("maxPrice") BigDecimal maxPrice) {

		List<FundForUI> funds = fundService.getFundsByLatestPriceInRange(minPrice, maxPrice);
		return ResponseEntity.ok(funds);
	}

	// GET /api/funds/top-changers?startDate=2025-10-17&endDate=2025-10-19
	@GetMapping("/funds/top-changers")
	public ResponseEntity<List<FundForUI>> getTopChangers(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FundForUI> funds = fundService.getTop5FundsByChange(startDate, endDate);
		return ResponseEntity.ok(funds);
	}
}
