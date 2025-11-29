package backend.frontendModels.RequestModels;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class FundSearchRequest {
	private String name;

	private BigDecimal minPrice;
	private BigDecimal maxPrice;

	private BigDecimal minValue;
	private BigDecimal maxValue;

	private Long minUnits;
	private Long maxUnits;

	private Long minInvestors;
	private Long maxInvestors;
}