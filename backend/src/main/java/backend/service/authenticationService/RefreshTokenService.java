package backend.service.authenticationService;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import backend.service.dataService.entity.RefreshToken;
import backend.service.dataService.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

	private final RefreshTokenRepository repo;
	private final int refreshTokenDays;
	private final SecureRandom random = new SecureRandom();

	public RefreshTokenService(RefreshTokenRepository repo,
			@Value("${app.jwt.refresh-token-days}") int refreshTokenDays) {
		this.repo = repo;
		this.refreshTokenDays = refreshTokenDays;
	}

	public String issueRefreshToken(Long userId) {
		String raw = generateRandomToken();
		String hash = sha256(raw);

		RefreshToken rt = new RefreshToken();
		rt.setUserId(userId);
		rt.setTokenHash(hash);
		rt.setExpiresAt(LocalDateTime.now().plusDays(refreshTokenDays));
		rt.setRevoked(false);

		repo.save(rt);
		return raw; // raw goes to cookie
	}

	public Long validateAndGetUserId(String rawToken) {
		String hash = sha256(rawToken);
		RefreshToken rt = repo.findByTokenHash(hash).orElseThrow(() -> new RuntimeException("Invalid refresh token"));

		if (rt.isRevoked())
			throw new RuntimeException("Refresh token revoked");
		if (rt.getExpiresAt().isBefore(LocalDateTime.now()))
			throw new RuntimeException("Refresh token expired");

		return rt.getUserId();
	}

//	// rotation (recommended): revoke old and issue a new one
//	public String rotate(String rawToken) {
//		String hash = sha256(rawToken);
//		RefreshToken rt = repo.findByTokenHash(hash).orElseThrow(() -> new RuntimeException("Invalid refresh token"));
//
//		if (rt.isRevoked() || rt.getExpiresAt().isBefore(LocalDateTime.now())) {
//			throw new RuntimeException("Refresh token invalid");
//		}
//
//		rt.setRevoked(true);
//		repo.save(rt);
//
//		return issueRefreshToken(rt.getUserId());
//	}

	// rotation (recommended): revoke old and issue a new one
	public RefreshRotation rotate(String rawToken) {
		String hash = sha256(rawToken);
		RefreshToken rt = repo.findByTokenHash(hash).orElseThrow(() -> new RuntimeException("Invalid refresh token"));

		if (rt.isRevoked() || rt.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Refresh token invalid");
		}

		rt.setRevoked(true);
		repo.save(rt);

		String newRaw = issueRefreshToken(rt.getUserId());
		return new RefreshRotation(rt.getUserId(), newRaw);
	}

	public void revoke(String rawToken) {
		String hash = sha256(rawToken);
		repo.findByTokenHash(hash).ifPresent(rt -> {
			rt.setRevoked(true);
			repo.save(rt);
		});
	}

	private String generateRandomToken() {
		byte[] bytes = new byte[64];
		random.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

	private String sha256(String s) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] digest = md.digest(s.getBytes(StandardCharsets.UTF_8));
			return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public record RefreshRotation(Long userId, String newRefreshToken) {
	}

}
