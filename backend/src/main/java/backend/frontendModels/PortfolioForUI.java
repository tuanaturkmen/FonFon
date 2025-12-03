package backend.frontendModels;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class PortfolioForUI {

	private Long id;
	private Long userId;
	private String name;
	private BigDecimal totalAmount;

	private List<PortfolioFundForUI> funds;

	@Data
	public static class PortfolioFundForUI {
		private String fundCode;
		private String fundName;
		private BigDecimal allocationPercent;
		private BigDecimal ownedUnits;
		private BigDecimal latestPrice;
		private BigDecimal marketValue; // ownedUnits * latestPrice
	}
}