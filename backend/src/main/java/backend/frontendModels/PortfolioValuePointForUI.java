package backend.frontendModels;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class PortfolioValuePointForUI {
	private LocalDate date;
	private BigDecimal totalValue;
}
