package backend.frontendModels;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data; 

@Data
public class FundForUI {

	private String code;
	private String name;
	private String type;
	private LocalDate date;
	private BigDecimal price;
	private BigDecimal circulatingUnits;
	private Integer investorCount;
	private BigDecimal totalValue;
}
