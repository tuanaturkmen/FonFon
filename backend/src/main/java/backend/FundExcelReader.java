package backend;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class FundExcelReader {

    public static List<Fund> readFundsFromExcel() {
        List<Fund> funds = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");

        try (InputStream inputStream = FundExcelReader.class.getResourceAsStream("/TakasbankTEFASTarihselVeriler.xlsx");
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // start from row 1 to skip header
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Cell dateCell = row.getCell(0);
                if (dateCell == null) continue;

                LocalDate date;
                if (dateCell.getCellType() == CellType.NUMERIC) {
                    // Excel stores real dates as numeric
                    date = dateCell.getLocalDateTimeCellValue().toLocalDate();
                } else {
                    // Sometimes it's stored as text like "9/29/2025"
                    String text = dateCell.getStringCellValue().trim();
                    if (text.isEmpty() || text.equalsIgnoreCase("Tarih")) continue;
                    date = LocalDate.parse(text, formatter);
                }

                String code = getString(row.getCell(1));
                String name = getString(row.getCell(2));
                double price = getDouble(row.getCell(3));
                int numberOfPeople = (int) getDouble(row.getCell(5));

//              funds.add(new Fund(date, code, name, price, numberOfPeople));
                funds.add(new Fund(date, price));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return funds;
    }

    // Utility: safely get string values
    private static String getString(Cell cell) {
        if (cell == null) return "";
        return cell.toString().trim();
    }

    // Utility: safely get double values
    private static double getDouble(Cell cell) {
        if (cell == null) return 0;
        try {
            return Double.parseDouble(cell.toString().trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public static void main(String[] args) {
        List<Fund> funds = readFundsFromExcel();
        funds.forEach(System.out::println);
    }
}
