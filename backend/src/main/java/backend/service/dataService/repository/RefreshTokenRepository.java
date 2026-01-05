package backend.service.dataService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.service.dataService.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByTokenHash(String tokenHash);

	void deleteByUserId(Long userId);
}
