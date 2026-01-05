package backend.frontendModels;

import java.util.List;

public class PortfolioValuesResponseForUI {

	private List<PortfolioValuePointForUI> points;
	private List<FundChangeSummaryForUI> fundChanges;

	public List<PortfolioValuePointForUI> getPoints() {
		return points;
	}

	public void setPoints(List<PortfolioValuePointForUI> points) {
		this.points = points;
	}

	public List<FundChangeSummaryForUI> getFundChanges() {
		return fundChanges;
	}

	public void setFundChanges(List<FundChangeSummaryForUI> fundChanges) {
		this.fundChanges = fundChanges;
	}
}
