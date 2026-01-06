package backend.exceptions;

public class ConflictExceptionUsername extends RuntimeException {
	public ConflictExceptionUsername(String msg) {
		super(msg);
	}
}
