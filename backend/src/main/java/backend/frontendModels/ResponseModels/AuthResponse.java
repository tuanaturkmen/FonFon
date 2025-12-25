package backend.frontendModels.ResponseModels;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
	private String accessToken;
}
