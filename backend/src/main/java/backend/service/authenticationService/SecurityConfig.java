package backend.service.authenticationService;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import backend.common.ExceptionCodeEnum;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	private final JwtAuthFilter jwtAuthFilter;

	public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
		this.jwtAuthFilter = jwtAuthFilter;
	}

	// tturkmen ask
	// Every endpoint other than /api/auth is protected
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		ObjectMapper om = new ObjectMapper();
		http.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).cors(cors -> {
				}) // we’ll add CORS bean in step 3
				.exceptionHandling(eh -> eh
						// 401: no/invalid token
						.authenticationEntryPoint((req, res, ex) -> {
							res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
							res.setContentType(MediaType.APPLICATION_JSON_VALUE);

							Map<String, Object> body = new LinkedHashMap<>();
							body.put("timestamp", Instant.now().toString());
							body.put("status", 401);
							body.put("error", "Unauthorized");
							body.put("code", ExceptionCodeEnum.INVALID_TOKEN.toString());
							body.put("message", "Authentication is required");
							body.put("path", req.getRequestURI());

							om.writeValue(res.getOutputStream(), body);
						})

						// 403: authenticated but forbidden
						.accessDeniedHandler((req, res, ex) -> {
							res.setStatus(HttpServletResponse.SC_FORBIDDEN);
							res.setContentType(MediaType.APPLICATION_JSON_VALUE);

							Map<String, Object> body = new LinkedHashMap<>();
							body.put("timestamp", Instant.now().toString());
							body.put("status", 403);
							body.put("error", "Forbidden");
							body.put("code", ExceptionCodeEnum.AUTH_FORBIDDEN.toString());
							body.put("message", "You don't have permission for this action");
							body.put("path", req.getRequestURI());

							om.writeValue(res.getOutputStream(), body);
						}))
				.authorizeHttpRequests(
						auth -> auth.requestMatchers("/api/auth/**", "/api/funds", "/api/funds/**", "/error")
								.permitAll().anyRequest().authenticated())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
