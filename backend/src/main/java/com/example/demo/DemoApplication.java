package com.example.demo;

import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;
import com.example.demo.pattern.factory.CarFactoryProvider;
import com.example.demo.pattern.factory.CarSeedSpec;
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
	public CommandLineRunner seedData(CarRepository carRepository, CarOwnerRepository ownerRepository, CarFactoryProvider carFactoryProvider) {
		return args -> {
			if (ownerRepository.count() == 0) {
				CarOwner owner = CarOwner.builder()
						.fullName("Velocify Fleet Owner")
						.email("fleet@velocify.com")
						.phoneNumber("+1234567890")
						.build();
				ownerRepository.save(owner);

				if (carRepository.count() == 0) {
					Car porsche = carFactoryProvider.createSeedCar(new CarSeedSpec(
							"Porsche 911 Carrera",
							2023,
							"XYZ-911",
							"Slate",
							new BigDecimal("320.00"),
							"AVAILABLE"), owner);

					Car tesla = carFactoryProvider.createSeedCar(new CarSeedSpec(
							"Tesla Model X",
							2023,
							"ELEC-100",
							"Blue",
							new BigDecimal("185.00"),
							"AVAILABLE"), owner);

					Car audi = carFactoryProvider.createSeedCar(new CarSeedSpec(
							"Audi A4 Sport",
							2022,
							"AUDI-444",
							"White",
							new BigDecimal("110.00"),
							"AVAILABLE"), owner);

					Car ferrari = carFactoryProvider.createSeedCar(new CarSeedSpec(
							"Ferrari F8 Tributo",
							2023,
							"FAST-888",
							"Red",
							new BigDecimal("890.00"),
							"AVAILABLE"), owner);

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
