package backend.service.authenticationService;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	public JwtAuthFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	// TODO tturkmen ask this method
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (auth == null || !auth.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = auth.substring(7);

		try {
			Claims claims = jwtService.parseClaims(token);
			String userId = claims.getSubject();

			var authentication = new UsernamePasswordAuthenticationToken(userId, null);
			SecurityContextHolder.getContext().setAuthentication(authentication);

		} catch (Exception e) {
			// invalid token -> treat as unauthenticated
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}

}
