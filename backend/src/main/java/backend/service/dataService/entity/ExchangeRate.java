package backend.service.dataService.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "exchange_rates")
public class ExchangeRate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "date", nullable = false)
	private LocalDate date;

	@Column(name = "usd_buy_rate", precision = 18, scale = 6)
	private BigDecimal usdBuyRate;

	@Column(name = "usd_sell_rate", precision = 18, scale = 6)
	private BigDecimal usdSellRate;

	@Column(name = "eur_buy_rate", precision = 18, scale = 6)
	private BigDecimal eurBuyRate;

	@Column(name = "eur_sell_rate", precision = 18, scale = 6)
	private BigDecimal eurSellRate;

	@Column(name = "created_at")
	private java.time.OffsetDateTime createdAt;

	// getters & setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public BigDecimal getUsdBuyRate() {
		return usdBuyRate;
	}

	public void setUsdBuyRate(BigDecimal usdBuyRate) {
		this.usdBuyRate = usdBuyRate;
	}

	public BigDecimal getUsdSellRate() {
		return usdSellRate;
	}

	public void setUsdSellRate(BigDecimal usdSellRate) {
		this.usdSellRate = usdSellRate;
	}

	public BigDecimal getEurBuyRate() {
		return eurBuyRate;
	}

	public void setEurBuyRate(BigDecimal eurBuyRate) {
		this.eurBuyRate = eurBuyRate;
	}

	public BigDecimal getEurSellRate() {
		return eurSellRate;
	}

	public void setEurSellRate(BigDecimal eurSellRate) {
		this.eurSellRate = eurSellRate;
	}

	public java.time.OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(java.time.OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
