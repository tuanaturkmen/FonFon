package backend.service.dataService;

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

	public StartupRunner(FundDataImportService importService) {
		this.importService = importService;
	}

	@Override
	public void run(String... args) throws Exception {
		try {
			if (importEnabled)
				importService.importFundsFromExcel(FundTypeEnum.INVESTMENT.getName());
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("✅ Funds imported successfully!");
	}
}
