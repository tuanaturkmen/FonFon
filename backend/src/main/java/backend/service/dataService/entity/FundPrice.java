package backend.service.dataService.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "fund_price_history", uniqueConstraints = { @UniqueConstraint(columnNames = { "fund_id", "date" }) })
public class FundPrice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; // integer in DB

	@ManyToOne
	@JoinColumn(name = "fund_id", nullable = false)
	private Fund fund;

	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false, precision = 18, scale = 6)
	private BigDecimal price;

	// Matches "circulating_units" in your DB image
	@Column(name = "circulating_units", precision = 18, scale = 2)
	private BigDecimal circulatingUnits;

	// Matches "investor_count" in your DB image
	@Column(name = "investor_count")
	private Integer investorCount;

	@Column(name = "total_value", precision = 18, scale = 2)
	private BigDecimal totalValue;

	@Column(name = "created_at")
	private Timestamp createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = new Timestamp(System.currentTimeMillis());
	}

	// --- Getters and Setters ---

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Fund getFund() {
		return fund;
	}

	public void setFund(Fund fund) {
		this.fund = fund;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getCirculatingUnits() {
		return circulatingUnits;
	}

	public void setCirculatingUnits(BigDecimal circulatingUnits) {
		this.circulatingUnits = circulatingUnits;
	}

	public Integer getInvestorCount() {
		return investorCount;
	}

	public void setInvestorCount(Integer investorCount) {
		this.investorCount = investorCount;
	}

	public BigDecimal getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(BigDecimal totalValue) {
		this.totalValue = totalValue;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}
}