package backend.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
	private CurrentUser() {
	}

	public static Long id() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || auth.getPrincipal() == null)
			return null;
		return Long.valueOf(auth.getPrincipal().toString());
	}
}
