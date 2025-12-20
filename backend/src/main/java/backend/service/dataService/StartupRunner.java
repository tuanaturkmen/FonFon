package backend.service.dataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import backend.common.FundTypeEnum;

@Component
public class StartupRunner implements CommandLineRunner {

	@Value("${app.data.import.file-path}")
	private Resource excelFile;

	@Value("${app.data.import.enabled:true}")
	private boolean importEnabled;

	private final FundDataImportService importService;

	@Autowired
	javax.sql.DataSource dataSource;

	public StartupRunner(FundDataImportService importService) {
		this.importService = importService;
	}

	private void logDbInfo() {
		try (var c = dataSource.getConnection();
				var st = c.createStatement();
				var rs = st.executeQuery("select current_database(), inet_server_addr(), inet_server_port()")) {
			if (rs.next()) {
				System.out.println("🗄️ DB=" + rs.getString(1) + " host=" + rs.getString(2) + ":" + rs.getInt(3));
			}
		} catch (Exception e) {
			System.out.println("❌ DB connection check failed: " + e.getMessage());
			throw new RuntimeException(e);
		}
	}

	@Override
	public void run(String... args) throws Exception {

		logDbInfo();
		if (!importEnabled) {
			System.out.println("ℹ️ Import Data disabled.");
			return;
		}

		try {
			if (importEnabled) {
				System.out.println("Starting import...");
				importService.importFundsFromExcel(FundTypeEnum.INVESTMENT.getName());
				System.out.println("Import finished.");
			}
			System.out.println("✅ Funds imported successfully!");
		} catch (Exception e) {
			System.out.println("❌ Import failed: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}

	}
}
