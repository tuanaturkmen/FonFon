package backend.exceptions;

import java.time.LocalDate;

public class FxRateNotFoundException extends RuntimeException {

	private final LocalDate date;

	public FxRateNotFoundException(String exchange, LocalDate date) {
		super("No " + exchange + " rate found for date: " + date);
		this.date = date;
	}

	public LocalDate getDate() {
		return date;
	}
}
