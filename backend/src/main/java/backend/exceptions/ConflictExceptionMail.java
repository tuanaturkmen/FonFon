package backend.exceptions;

public class ConflictExceptionMail extends RuntimeException {
	public ConflictExceptionMail(String msg) {
		super(msg);
	}
}
