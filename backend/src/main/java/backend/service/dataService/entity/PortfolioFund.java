package backend.service.dataService.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Data
@Entity
@Table(name = "portfolio_funds", uniqueConstraints = @UniqueConstraint(columnNames = { "portfolio_id", "fund_id" }))
public class PortfolioFund {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "portfolio_id", nullable = false)
	private Portfolio portfolio;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fund_id", nullable = false)
	private Fund fund;

	@Column(name = "allocation_percent", precision = 5, scale = 2)
	private BigDecimal allocationPercent;

	@Column(name = "owned_units", precision = 18, scale = 4)
	private BigDecimal ownedUnits;

	@Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;
}
