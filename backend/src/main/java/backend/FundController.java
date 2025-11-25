package backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.service.dataService.FundService;
import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;

@RestController
@RequestMapping("/api")
public class FundController {

	@Autowired
	private final FundService fundService;

	@GetMapping("/funds")
	public ResponseEntity<List<FundForUI>> getAllFunds() {
		List<FundForUI> funds = fundService.getAllFundsForUI();
		return ResponseEntity.ok(funds);
	}

	@GetMapping("/funds/history")
	public ResponseEntity<List<FundForUI>> getFundsByDateRange(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FundForUI> funds = fundService.getFundsForUIByDateRange(startDate, endDate);
		return ResponseEntity.ok(funds);
	}
}
