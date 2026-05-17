package com.example.demo.pattern.factory;

import com.example.demo.dto.CarCreateDto;
import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;

public abstract class AbstractCarFactory implements CarFactory {

    @Override
    public final Car createCar(CarCreateDto createDto, CarOwner owner) {
        return Car.builder()
                .model(createDto.getModel())
                .year(createDto.getYear())
                .licensePlate(createDto.getLicensePlate())
                .color(createDto.getColor())
                .dailyPrice(createDto.getDailyPrice())
                .status("AVAILABLE")
                .owner(owner)
                .build();
    }

    @Override
    public final Car createSeedCar(CarSeedSpec seedSpec, CarOwner owner) {
        return Car.builder()
                .model(seedSpec.model())
                .year(seedSpec.year())
                .licensePlate(seedSpec.licensePlate())
                .color(seedSpec.color())
                .dailyPrice(seedSpec.dailyPrice())
                .status(seedSpec.status())
                .owner(owner)
                .build();
    }

    protected boolean modelContains(String model, String value) {
        return model != null && model.toLowerCase().contains(value);
    }
}
