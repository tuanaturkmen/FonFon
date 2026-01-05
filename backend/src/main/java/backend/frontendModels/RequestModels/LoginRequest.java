package backend.frontendModels.RequestModels;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
	// allow login by username OR email
	@NotBlank
	private String login;
	@NotBlank
	private String password;
}
