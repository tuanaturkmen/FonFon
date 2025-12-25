package backend.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.frontendModels.RequestModels.LoginRequest;
import backend.frontendModels.RequestModels.RegisterRequest;
import backend.frontendModels.ResponseModels.AuthResponse;
import backend.service.authenticationService.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public AuthResponse register(@Validated @RequestBody RegisterRequest req) {
		return new AuthResponse(authService.register(req));
	}

	@PostMapping("/login")
	public AuthResponse login(@Validated @RequestBody LoginRequest req) {
		return new AuthResponse(authService.login(req));
	}

}
