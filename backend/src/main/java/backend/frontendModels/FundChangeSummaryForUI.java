package backend.frontendModels;

import java.math.BigDecimal;

public class FundChangeSummaryForUI {

	private String fundCode;
	private BigDecimal allocationPercent;
	private BigDecimal percentChange; // e.g. 4.12 means +4.12%

	public String getFundCode() {
		return fundCode;
	}

	public void setFundCode(String fundCode) {
		this.fundCode = fundCode;
	}

	public BigDecimal getAllocationPercent() {
		return allocationPercent;
	}

	public void setAllocationPercent(BigDecimal allocationPercent) {
		this.allocationPercent = allocationPercent;
	}

	public BigDecimal getPercentChange() {
		return percentChange;
	}

	public void setPercentChange(BigDecimal percentChange) {
		this.percentChange = percentChange;
	}
}
