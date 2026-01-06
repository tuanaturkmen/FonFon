package backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.frontendModels.FxBenchmarkPointForUI;
import backend.service.dataService.ExchangeRateService;

@RestController
@RequestMapping("/api/rates")
public class ExchangeRateController {

	@Autowired
	private ExchangeRateService exchangeRateService;

	// GET
	// /api/rates/usd/benchmark?amount=1000&startDate=2025-07-01&endDate=2025-07-31
	@GetMapping("/usd/benchmark")
	public ResponseEntity<List<FxBenchmarkPointForUI>> getUsdBenchmark(@RequestParam("amount") BigDecimal amount,
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FxBenchmarkPointForUI> values = exchangeRateService.getUsdBenchmarkSeries(amount, startDate, endDate);

		return ResponseEntity.ok(values);
	}

	// OPTIONAL: same pattern for EUR
	@GetMapping("/eur/benchmark")
	public ResponseEntity<List<FxBenchmarkPointForUI>> getEurBenchmark(@RequestParam("amount") BigDecimal amount,
			@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		List<FxBenchmarkPointForUI> values = exchangeRateService.getEurBenchmarkSeries(amount, startDate, endDate);

		return ResponseEntity.ok(values);
	}
}
