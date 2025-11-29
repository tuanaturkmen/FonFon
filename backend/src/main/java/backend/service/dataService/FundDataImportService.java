package backend.service.dataService;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.service.dataService.entity.Fund;
import backend.service.dataService.entity.FundPrice;
import backend.service.dataService.entity.FundType;
import backend.service.dataService.repository.FundPriceRepository;
import backend.service.dataService.repository.FundRepository;
import backend.service.dataService.repository.FundTypeRepository;

@Service
public class FundDataImportService {

	@Value("${app.data.import.file-path}")
	private Resource excelFile;

	@Autowired
	private FundRepository fundRepository;

	@Autowired
	private FundTypeRepository fundTypeRepository;

	@Autowired
	private FundPriceRepository fundPriceRepository;

	@Transactional
	public void importFundsFromExcel(String fundTypeName) throws Exception {
		// 1. Find the Fund Type (e.g., "INVESTMENT")
		FundType type = fundTypeRepository.findByName(fundTypeName)
				.orElseThrow(() -> new IllegalArgumentException("Fund type not found: " + fundTypeName));

		InputStream is = excelFile.getInputStream();

		// Pass 'is' to Apache POI
		Workbook workbook = new XSSFWorkbook(is);
		Sheet sheet = workbook.getSheetAt(0);

		for (Row row : sheet) {
			if (row.getRowNum() == 0)
				continue; // Skip Header

			// --- A. Read Basic Info ---
			String code = getStringValue(row.getCell(1));
			String name = getStringValue(row.getCell(2));

			if (code == null || code.trim().isEmpty() || code.equals("Fon Kodu")) {
				continue;
			}

			// --- B. Find or Create the Fund ---
			Fund fund = fundRepository.findByCode(code).orElseGet(() -> {
				Fund f = new Fund();
				f.setCode(code);
				f.setName(name);
				f.setType(type);
				return fundRepository.save(f);
			});

			// --- C. Read Historical Data ---
			Date excelDate = null;
			try {
				excelDate = row.getCell(0).getDateCellValue();
			} catch (Exception e) {
				continue;
			} // Skip if date is invalid

			if (excelDate != null) {
				java.time.LocalDate localDate = excelDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

				// Check for duplicates
				if (!fundPriceRepository.existsByFundAndDate(fund, localDate)) {

					BigDecimal price = getBigDecimalValue(row.getCell(3)); // Fiyat
					BigDecimal units = getBigDecimalValue(row.getCell(4)); // Tedavüldeki Pay Sayısı
					Integer investors = getIntegerValue(row.getCell(5)); // Kişi Sayısı
					BigDecimal totalVal = getBigDecimalValue(row.getCell(6)); // Fon Toplam Değer

					FundPrice fp = new FundPrice();
					fp.setFund(fund);
					fp.setDate(localDate);
					fp.setPrice(price);
					fp.setCirculatingUnits(units); // Maps to 'circulating_units'
					fp.setInvestorCount(investors); // Maps to 'investor_count'
					fp.setTotalValue(totalVal);

					fundPriceRepository.save(fp);
				}
			}
		}

		workbook.close();
	}

	// --- Helper Methods ---

	private String getStringValue(Cell cell) {
		if (cell == null)
			return "";
		if (cell.getCellType() == CellType.STRING)
			return cell.getStringCellValue();
		if (cell.getCellType() == CellType.NUMERIC)
			return String.valueOf(cell.getNumericCellValue());
		return "";
	}

	private BigDecimal getBigDecimalValue(Cell cell) {
		if (cell == null)
			return BigDecimal.ZERO;
		if (cell.getCellType() == CellType.NUMERIC)
			return BigDecimal.valueOf(cell.getNumericCellValue());
		try {
			if (cell.getCellType() == CellType.STRING)
				return new BigDecimal(cell.getStringCellValue().trim());
		} catch (Exception e) {
		}
		return BigDecimal.ZERO;
	}

	private Integer getIntegerValue(Cell cell) {
		if (cell == null)
			return 0;
		if (cell.getCellType() == CellType.NUMERIC)
			return (int) cell.getNumericCellValue();
		try {
			if (cell.getCellType() == CellType.STRING)
				return Integer.parseInt(cell.getStringCellValue().trim().replace(".", ""));
		} catch (Exception e) {
		}
		return 0;
	}
}