package backend.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.frontendModels.RequestModels.LoginRequest;
import backend.frontendModels.RequestModels.RegisterRequest;
import backend.frontendModels.ResponseModels.AuthResponse;
import backend.service.authenticationService.AuthService;
import backend.service.authenticationService.RefreshTokenService;
import backend.service.dataService.entity.User;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final RefreshTokenService refreshTokenService;

	public AuthController(AuthService authService, RefreshTokenService refreshTokenService) {
		this.authService = authService;
		this.refreshTokenService = refreshTokenService;
	}

	// body example:
	// { "username": "tuana", "email": "tuana@mail.com", "password": "123456" }
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Validated @RequestBody RegisterRequest req, HttpServletResponse res) {
		User user = authService.registerAndReturnUser(req);

		String accessToken = authService.createAccessToken(user);

		String refreshRaw = refreshTokenService.issueRefreshToken(user.getId());
		ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshRaw).httpOnly(true).secure(false) // true in
																												// production
																												// HTTPS,
																												// TODO
																												// tturkmen
				.sameSite("Lax").path("/auth").maxAge(60L * 60 * 24 * 14).build();

		res.addHeader("Set-Cookie", cookie.toString());

		return ResponseEntity.ok(new AuthResponse(accessToken));
	}

	// body example
	// {"login": "tuana2@mail.com", "password": "123456"}
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Validated @RequestBody LoginRequest req, HttpServletResponse res) {
		User user = authService.authenticate(req);

		String accessToken = authService.createAccessToken(user);
		String refreshRaw = refreshTokenService.issueRefreshToken(user.getId()); // long token
		ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshRaw).httpOnly(true).secure(false) // true in
																												// production
																												// HTTPS,
																												// TODO
																												// tturkmen
				.sameSite("Lax").path("/auth") // cookie only sent to /auth/*
				.maxAge(60L * 60 * 24 * 14).build();
		res.addHeader("Set-Cookie", cookie.toString());

		return ResponseEntity.ok(new AuthResponse(accessToken));
	}

	@PostMapping("/refresh")
	public ResponseEntity<AuthResponse> refresh(
			@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse res) {

		if (refreshToken == null || refreshToken.isBlank()) {
			return ResponseEntity.status(401).build();
		}

		var rotation = refreshTokenService.rotate(refreshToken);

		String newAccessToken = authService.createAccessTokenByUserId(rotation.userId());

		ResponseCookie cookie = ResponseCookie.from("refreshToken", rotation.newRefreshToken()).httpOnly(true)
				.secure(false).sameSite("Lax").path("/auth").maxAge(60L * 60 * 24 * 14).build();
		res.addHeader("Set-Cookie", cookie.toString());

		return ResponseEntity.ok(new AuthResponse(newAccessToken));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
			HttpServletResponse res) {

		if (refreshToken != null && !refreshToken.isBlank()) {
			refreshTokenService.revoke(refreshToken);
		}

		ResponseCookie clear = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(false).path("/auth")
				.sameSite("Lax").maxAge(0).build();
		res.addHeader("Set-Cookie", clear.toString());
		return ResponseEntity.ok().build();
	}

}
