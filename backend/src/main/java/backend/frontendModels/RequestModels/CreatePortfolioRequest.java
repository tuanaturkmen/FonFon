package backend.frontendModels.RequestModels;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CreatePortfolioRequest {

	private Long userId;
	private String name;
	private BigDecimal totalAmount; // total money to invest

	private List<FundAllocationRequest> allocations;

	@Data
	public static class FundAllocationRequest {
		private String fundCode;
		private BigDecimal allocationPercent;
	}
}
