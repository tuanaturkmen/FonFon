package backend;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FundController {

	 @GetMapping("/api/funds")
	    public List<Fund> getFunds() {
	        return FundExcelReader.readFundsFromExcel();
	    }
}
