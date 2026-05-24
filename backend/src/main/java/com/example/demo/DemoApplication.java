package com.example.demo;

import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;
import com.example.demo.repository.CarOwnerRepository;
import com.example.demo.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedData(CarRepository carRepository, CarOwnerRepository ownerRepository) {
		return args -> {
			if (ownerRepository.count() == 0) {
				CarOwner owner = CarOwner.builder()
						.fullName("Velocify Fleet Owner")
						.email("fleet@velocify.com")
						.phoneNumber("+1234567890")
						.build();
				ownerRepository.save(owner);

				if (carRepository.count() == 0) {
					Car porsche = Car.builder()
							.model("Porsche 911 Carrera")
							.year(2023)
							.licensePlate("XYZ-911")
							.color("Slate")
							.dailyPrice(new BigDecimal("320.00"))
							.status("AVAILABLE")
							.owner(owner)
							.build();

					Car tesla = Car.builder()
							.model("Tesla Model X")
							.year(2023)
							.licensePlate("ELEC-100")
							.color("Blue")
							.dailyPrice(new BigDecimal("185.00"))
							.status("AVAILABLE")
							.owner(owner)
							.build();

					Car audi = Car.builder()
							.model("Audi A4 Sport")
							.year(2022)
							.licensePlate("AUDI-444")
							.color("White")
							.dailyPrice(new BigDecimal("110.00"))
							.status("AVAILABLE")
							.owner(owner)
							.build();

					Car ferrari = Car.builder()
							.model("Ferrari F8 Tributo")
							.year(2023)
							.licensePlate("FAST-888")
							.color("Red")
							.dailyPrice(new BigDecimal("890.00"))
							.status("AVAILABLE")
							.owner(owner)
							.build();

					carRepository.save(porsche);
					carRepository.save(tesla);
					carRepository.save(audi);
					carRepository.save(ferrari);
					System.out.println(">>> Database seeded with initial fleet of 4 premium cars!");
				}
			}
		};
	}
}
