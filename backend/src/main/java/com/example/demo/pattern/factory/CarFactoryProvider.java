package com.example.demo.pattern.factory;

import com.example.demo.dto.CarCreateDto;
import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CarFactoryProvider {

    private final List<CarFactory> carFactories;

    public Car createCar(CarCreateDto createDto, CarOwner owner) {
        return selectFactory(createDto.getModel()).createCar(createDto, owner);
    }

    public Car createSeedCar(CarSeedSpec seedSpec, CarOwner owner) {
        return selectFactory(seedSpec.model()).createSeedCar(seedSpec, owner);
    }

    private CarFactory selectFactory(String model) {
        return carFactories.stream()
                .filter(factory -> factory.supports(model))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No car factory available"));
    }
}
