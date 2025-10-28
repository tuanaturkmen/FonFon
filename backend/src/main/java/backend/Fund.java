package backend;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Fund {

	private LocalDate date; 
//	private String code;
//	private String name;
	private double price;
//	private int numberOfPeople; 
	
}
