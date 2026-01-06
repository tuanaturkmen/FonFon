package backend.service.authenticationService;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.exceptions.ConflictExceptionMail;
import backend.exceptions.ConflictExceptionUsername;
import backend.exceptions.NotFoundException;
import backend.exceptions.UnauthorizedException;
import backend.frontendModels.RequestModels.LoginRequest;
import backend.frontendModels.RequestModels.RegisterRequest;
import backend.service.dataService.entity.User;
import backend.service.dataService.repository.UserRepository;

@Service
public class AuthService {

	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
		this.userRepo = userRepo;
		this.encoder = encoder;
		this.jwtService = jwtService;
	}

	public String register(RegisterRequest req) {
		if (userRepo.existsByEmail(req.getEmail())) {
			throw new ConflictExceptionMail("Email already in use");
		}
		if (userRepo.existsByUsername(req.getUsername())) {
			throw new ConflictExceptionUsername("Username already in use");
		}

		User u = new User();
		u.setUsername(req.getUsername());
		u.setEmail(req.getEmail());
		u.setPasswordHash(encoder.encode(req.getPassword())); // bcrypt hash
		userRepo.save(u);

		return jwtService.generateAccessToken(u);
	}

	public String login(LoginRequest req) {
		Optional<User> userOpt = userRepo.findByEmail(req.getLogin());
		if (userOpt.isEmpty()) {
			userOpt = userRepo.findByUsername(req.getLogin());
		}

		User user = userOpt.orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

		if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
			throw new UnauthorizedException("Invalid credentials");
		}

		return jwtService.generateAccessToken(user);
	}

	// in AuthService
	public User authenticate(LoginRequest req) {
		Optional<User> userOpt = userRepo.findByEmail(req.getLogin());
		if (userOpt.isEmpty())
			userOpt = userRepo.findByUsername(req.getLogin());

		User user = userOpt.orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

		if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
			throw new UnauthorizedException("Invalid credentials");
		}

		return user;
	}

	public String createAccessToken(User user) {
		return jwtService.generateAccessToken(user);
	}

	public String createAccessTokenByUserId(Long userId) {
		User user = userRepo.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
		return jwtService.generateAccessToken(user);
	}

	public User registerAndReturnUser(RegisterRequest req) {
		if (userRepo.existsByEmail(req.getEmail())) {
			throw new ConflictExceptionMail("Email already in use");
		}
		if (userRepo.existsByUsername(req.getUsername())) {
			throw new ConflictExceptionUsername("Username already in use");
		}

		User u = new User();
		u.setUsername(req.getUsername());
		u.setEmail(req.getEmail());
		u.setPasswordHash(encoder.encode(req.getPassword()));

		return userRepo.save(u);
	}

}
