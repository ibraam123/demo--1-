package com.example.demo.service;

import com.example.demo.dto.CarCreateDto;
import com.example.demo.dto.CarDto;
import com.example.demo.entity.Car;
import com.example.demo.entity.CarOwner;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CarMapper;
import com.example.demo.pattern.factory.CarFactoryProvider;
import com.example.demo.repository.CarOwnerRepository;
import com.example.demo.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final CarOwnerRepository carOwnerRepository;
    private final CarMapper carMapper;
    private final CarFactoryProvider carFactoryProvider;

    public CarDto createCar(CarCreateDto createDto) {
        CarOwner owner = carOwnerRepository.findById(createDto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("CarOwner not found with id: " + createDto.getOwnerId()));
        
        Car car = carFactoryProvider.createCar(createDto, owner);
        
        Car saved = carRepository.save(car);
        return carMapper.toDto(saved);
    }

    public CarDto getCarById(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
        return carMapper.toDto(car);
    }

    public Page<CarDto> getAllCars(Pageable pageable) {
        return carRepository.findAll(pageable)
                .map(carMapper::toDto);
    }

    public Page<CarDto> getAllCarsFiltered(String model, Integer year, String status, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Car> spec = org.springframework.data.jpa.domain.Specification.where(com.example.demo.specification.CarSpecification.hasModel(model))
                .and(com.example.demo.specification.CarSpecification.hasYear(year))
                .and(com.example.demo.specification.CarSpecification.hasStatus(status))
                .and(com.example.demo.specification.CarSpecification.priceBetween(minPrice, maxPrice));

        return carRepository.findAll(spec, pageable)
                .map(carMapper::toDto);
    }

    public void deleteCar(Integer id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }
}
