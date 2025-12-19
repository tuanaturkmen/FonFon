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

//		new Thread(() -> {
		try {
			if (importEnabled) {
				System.out.println("Starting import from branch deploy-gcp...");
				importService.importFundsFromExcel(FundTypeEnum.INVESTMENT.getName());
				System.out.println("Import finished.");
			}
			System.out.println("✅ Funds imported successfully!");
		} catch (Throwable t) { // <--- CHANGE 'Exception' TO 'Throwable'
			// This catches OutOfMemoryError, NoClassDefFoundError, etc.
			System.out.println("❌ CRITICAL FAILURE in Background Thread!");
			System.out.println("❌ Error type: " + t.getClass().getName());
			System.out.println("❌ Message: " + t.getMessage());
			t.printStackTrace();
		}
//		}).start();

	}
}
