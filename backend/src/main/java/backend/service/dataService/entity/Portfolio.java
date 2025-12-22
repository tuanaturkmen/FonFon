package backend.service.dataService.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "portfolios")
public class Portfolio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// For now just store userId as Long, you can later map @ManyToOne to User.
	@Column(name = "user_id", nullable = false)
	private Long userId;

	@Column(nullable = false)
	private String name;

	@Column(name = "creation_time", nullable = false)
	private LocalDate creationTime;

	@OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PortfolioFund> funds = new ArrayList<>();

	@Column(name = "total_amount", precision = 18, scale = 2)
	private BigDecimal totalAmount;
}
