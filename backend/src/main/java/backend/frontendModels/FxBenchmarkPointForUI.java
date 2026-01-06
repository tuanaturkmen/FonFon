package backend.frontendModels;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FxBenchmarkPointForUI {

	private LocalDate date;
	private BigDecimal value; // money value in your base currency (e.g. TL)

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}
}
