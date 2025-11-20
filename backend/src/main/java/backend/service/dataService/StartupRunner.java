package backend.service.dataService;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import backend.common.FundTypeEnum;

@Component
public class StartupRunner implements CommandLineRunner {

	@Value("${app.data.import.file-path}")
	private String excelFilePath;

	private final FundDataImportService importService;

	public StartupRunner(FundDataImportService importService) {
		this.importService = importService;
	}

	@Override
	public void run(String... args) throws Exception {
		File file = new File(excelFilePath); // will need to change during deploy process
		try {
			importService.importFundsFromExcel(file, FundTypeEnum.INVESTMENT.getName());
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("✅ Funds imported successfully!");
	}
}
