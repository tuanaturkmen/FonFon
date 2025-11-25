package backend;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

	@GetMapping("/funds/history")
	public ResponseEntity<List<FundForUI>> getFundsByDateRange(
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FundForUI> funds = fundService.getFundsForUIByDateRange(startDate, endDate);
		return ResponseEntity.ok(funds);
	}
}
