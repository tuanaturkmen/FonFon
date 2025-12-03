package backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.frontendModels.PortfolioForUI;
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
// 	 	]
//}

	@PostMapping
	public ResponseEntity<PortfolioForUI> createPortfolio(@RequestBody CreatePortfolioRequest request) {
		PortfolioForUI created = portfolioService.createPortfolio(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

}
