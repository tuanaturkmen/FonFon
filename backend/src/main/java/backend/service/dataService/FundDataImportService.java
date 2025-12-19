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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.github.pjfanning.xlsx.StreamingReader;

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

	int processed = 0, insertedFunds = 0, insertedPrices = 0;

	public void importFundsFromExcel(String fundTypeName) throws Exception {

		processed = 0;
		insertedFunds = 0;
		insertedPrices = 0;

		// 1. Find the Fund Type (e.g., "INVESTMENT")
		FundType type = fundTypeRepository.findByName(fundTypeName).orElseGet(() -> {
			System.out.println("⚠️ FundType '" + fundTypeName + "' not found. Creating it...");
			FundType newType = new FundType();
			newType.setName(fundTypeName); // Assuming FundType has a setName method
			return fundTypeRepository.save(newType);
		});

		System.out.println("Excel file exists? " + excelFile.exists() + " | " + excelFile);
		try (InputStream is = excelFile.getInputStream();
				// --- 2. THE FIX: Use StreamingReader instead of XSSFWorkbook ---
				Workbook workbook = StreamingReader.builder().rowCacheSize(100) // Keep only 100 rows in memory
						.bufferSize(4096) // Read 4KB at a time
						.open(is)) {
			System.out.println("✅ Workbook opened in STREAMING mode.");
			Sheet sheet = workbook.getSheetAt(0);
			int rows = 0;

			for (Row row : sheet) {
				if (row.getRowNum() == 0)
					continue; // Skip Header

				try {

					if (++rows % 100 == 0) { // Log every 100 rows to reduce noise
						System.out.println("…processed rows=" + rows);
					}

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
						insertedFunds++;
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
						java.time.LocalDate localDate = excelDate.toInstant().atZone(ZoneId.systemDefault())
								.toLocalDate();

						// Check for duplicates

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
						try {
							int inserted = fundPriceRepository.insertIgnoreDuplicate(fund.getId(), localDate, price,
									units, investors, totalVal);

							processed++;
							if (inserted == 1) {
								insertedPrices++;
							} else {
								// duplicate skipped
							}
						} catch (org.springframework.dao.DataIntegrityViolationException dup) {
							// duplicate row -> ignore
						}
					}
				} catch (Exception e) {
					System.out.println("❌ Failed at excelRow=" + row.getRowNum());
					e.printStackTrace();
					throw e;
				}
			}

			System.out.println("📊 Total processed rows=" + rows);
			System.out.println("📊 processedRows=" + processed + " insertedFunds=" + insertedFunds + " insertedPrices="
					+ insertedPrices);

		}
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