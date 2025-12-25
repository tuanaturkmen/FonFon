package backend.service.authenticationService;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import backend.service.dataService.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey key;
	private final long accessTokenMinutes;

	public JwtService(@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.access-token-minutes}") long accessTokenMinutes) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.accessTokenMinutes = accessTokenMinutes;
	}

	public String generateAccessToken(User user) {
		Instant now = Instant.now();
		Instant exp = now.plusSeconds(accessTokenMinutes * 60);

		// TODO tturkmen why didnt we add password
		return Jwts.builder().subject(String.valueOf(user.getId())).claim("email", user.getEmail())
				.issuedAt(Date.from(now)).expiration(Date.from(exp)).signWith(key).compact();
	}

	public Claims parseClaims(String token) {
		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
	}

	public Long getUserId(String token) {
		return Long.valueOf(parseClaims(token).getSubject());
	}

	public String getEmail(String token) {
		return parseClaims(token).get("email", String.class);
	}

}
