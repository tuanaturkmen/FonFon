package backend.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import backend.common.ExceptionCodeEnum;
import backend.exceptions.BadRequestException;
import backend.exceptions.ConflictExceptionMail;
import backend.exceptions.ConflictExceptionUsername;
import backend.exceptions.NotFoundException;
import backend.exceptions.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {

	private ResponseEntity<Map<String, Object>> build(HttpStatus status, String code, String message,
			HttpServletRequest req, Map<String, Object> extra) {
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", Instant.now().toString());
		body.put("status", status.value());
		body.put("error", status.getReasonPhrase());
		body.put("code", code);
		body.put("message", message);
		body.put("path", req.getRequestURI());
		if (extra != null)
			body.putAll(extra);
		return ResponseEntity.status(status).body(body);
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex, HttpServletRequest req) {
		return build(HttpStatus.UNAUTHORIZED, ExceptionCodeEnum.AUTH_UNAUTHORIZED.toString(), ex.getMessage(), req,
				null);
	}

	@ExceptionHandler(ConflictExceptionMail.class)
	public ResponseEntity<Map<String, Object>> handleConflict(ConflictExceptionMail ex, HttpServletRequest req) {
		return build(HttpStatus.CONFLICT, ExceptionCodeEnum.AUTH_CONFLICT_MAIL.toString(), ex.getMessage(), req, null);
	}

	@ExceptionHandler(ConflictExceptionUsername.class)
	public ResponseEntity<Map<String, Object>> handleConflict(ConflictExceptionUsername ex, HttpServletRequest req) {
		return build(HttpStatus.CONFLICT, ExceptionCodeEnum.AUTH_CONFLICT_USERNAME.toString(), ex.getMessage(), req,
				null);
	}

	// Useful for "not yours" cases if you throw AccessDeniedException in service
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
		return build(HttpStatus.FORBIDDEN, ExceptionCodeEnum.AUTH_FORBIDDEN.toString(),
				"You don't have permission for this action", req, null);
	}

	// Validation errors (if you use @Valid / @Validated)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest req) {
		Map<String, Object> extra = Map.of("fields", ex.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(fe -> fe.getField(), fe -> fe.getDefaultMessage(), (a, b) -> a)));

		return build(HttpStatus.BAD_REQUEST, ExceptionCodeEnum.VALIDATION_ERROR.toString(), "Please check your input",
				req, extra);
	}

	// Fallback: keep it so FE gets JSON instead of HTML
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleAny(Exception ex, HttpServletRequest req) {
		return build(HttpStatus.INTERNAL_SERVER_ERROR, ExceptionCodeEnum.INTERNAL_ERROR.toString(), "Unexpected error",
				req, null);
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex, HttpServletRequest req) {
		return build(HttpStatus.NOT_FOUND, ExceptionCodeEnum.NOT_FOUND.toString(), ex.getMessage(), req, null);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
		return build(HttpStatus.BAD_REQUEST, ExceptionCodeEnum.BAD_REQUEST.toString(), ex.getMessage(), req, null);
	}
}
