package backend.service.dataService.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100, unique = true)
	private String username;

	@Column(nullable = false, length = 150, unique = true)
	private String email;

	@Column(name = "password_hash", nullable = false, columnDefinition = "text")
	private String passwordHash;

	// if DB sets this automatically, keep it read-only like this
	@Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;
}
