package com.example.demo.pattern.factory;

import com.example.demo.dto.CarCreateDto;
import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;

public interface CarFactory {

    boolean supports(String model);

    Car createCar(CarCreateDto createDto, CarOwner owner);

    Car createSeedCar(CarSeedSpec seedSpec, CarOwner owner);
}
