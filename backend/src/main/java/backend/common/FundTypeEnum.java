package backend.common;

public enum FundTypeEnum {

	INVESTMENT("Menkul Kıymet Yatırım Fonları"), PENSION("Emeklilik Fonları"), ENCHANGE_TRADED("Borsa Yatırım Fonları"),
	REAL_ESTATE_INVESTMENT("Gayrimenkul Yatırım Fonları"), VENTURE_CAPITAL("Girişim Sermayesi Yatırım Fonları");

	private String name;

	FundTypeEnum(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

}
