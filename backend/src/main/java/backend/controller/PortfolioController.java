package backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.common.CurrentUser;
import backend.frontendModels.PortfolioForUI;
import backend.frontendModels.PortfolioValuePointForUI;
import backend.frontendModels.RequestModels.CreatePortfolioRequest;
import backend.service.dataService.PortfolioService;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

	@Autowired
	private PortfolioService portfolioService;

//	POST/portfolios Content-Type:application/json
//	{
//  	"userId": 1,
//  	"name": "Deneme Portfolio",
//  	"totalAmount": 3000,
//  	"allocations": [
//    		{ "fundCode": "AAK", "allocationPercent": 50.0 },
//    		{ "fundCode": "BBF", "allocationPercent": 30.0 },
//    		{ "fundCode": "CEY", "allocationPercent": 20.0 }
// 	 	],
//      "creationTime": "2025-11-17"	
//}
	@PostMapping
	public ResponseEntity<PortfolioForUI> createPortfolio(@RequestBody CreatePortfolioRequest request) {
		Long userId = CurrentUser.id();
		PortfolioForUI created = portfolioService.createPortfolio(request, userId);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	// Get all portfolios of a user
	@GetMapping("/user/me")
	public ResponseEntity<List<PortfolioForUI>> getPortfoliosByUser() {
		Long userId = CurrentUser.id();
		List<PortfolioForUI> portfolios = portfolioService.getPortfoliosByUser(userId);
		return ResponseEntity.ok(portfolios);
	}

	// Delete specific portfolio of a user
	@DeleteMapping("/user/me/{portfolioId}")
	public ResponseEntity<Void> deletePortfolio(@PathVariable Long portfolioId) {

		Long userId = CurrentUser.id();
		portfolioService.deletePortfolio(userId, portfolioId);
		return ResponseEntity.noContent().build(); // HTTP 204
	}

	// Get values of a portfolio over a date range
	// /user/{userId}/{portfolioId}/values?startDate=2025-11-17&endDate=2025-11-19
	@GetMapping("/user/me/{portfolioId}/values")
	public ResponseEntity<List<PortfolioValuePointForUI>> getPortfolioValuesOverDate(@PathVariable Long portfolioId,
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		Long userId = CurrentUser.id();
		List<PortfolioValuePointForUI> values = portfolioService.getPortfolioValuesOverDateRange(userId, portfolioId,
				startDate, endDate);

		return ResponseEntity.ok(values);
	}

	// PUT /portfolios/7
	// {
	// "userId": 1,
	// "name": "Deneme Portfolio",
	// "totalAmount": 3000,
	// "allocations": [
	// { "fundCode": "AAK", "allocationPercent": 50.0 },
	// { "fundCode": "BBF", "allocationPercent": 30.0 },
	// { "fundCode": "CEY", "allocationPercent": 20.0 }
	// ],
	// "creationTime": "2025-11-17"
	// }
	@PutMapping("/{portfolioId}")
	public ResponseEntity<PortfolioForUI> updatePortfolio(@PathVariable Long portfolioId,
			@RequestBody CreatePortfolioRequest request) {
		Long userId = CurrentUser.id();
		PortfolioForUI updated = portfolioService.updatePortfolio(portfolioId, request, userId);
		return ResponseEntity.ok(updated);
	}

}
