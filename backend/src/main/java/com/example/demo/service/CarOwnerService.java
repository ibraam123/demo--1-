package com.example.demo.service;

import com.example.demo.dto.CarOwnerDto;
import com.example.demo.entity.CarOwner;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CarOwnerMapper;
import com.example.demo.repository.CarOwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarOwnerService {

    private final CarOwnerRepository carOwnerRepository;
    private final CarOwnerMapper carOwnerMapper;

    public CarOwnerDto createCarOwner(CarOwnerDto carOwnerDto) {
        CarOwner carOwner = carOwnerMapper.toEntity(carOwnerDto);
        CarOwner saved = carOwnerRepository.save(carOwner);
        return carOwnerMapper.toDto(saved);
    }

    public CarOwnerDto getCarOwnerById(Integer id) {
        CarOwner carOwner = carOwnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CarOwner not found with id: " + id));
        return carOwnerMapper.toDto(carOwner);
    }

    public List<CarOwnerDto> getAllCarOwners() {
        return carOwnerRepository.findAll().stream()
                .map(carOwnerMapper::toDto)
                .collect(Collectors.toList());
    }

    public void deleteCarOwner(Integer id) {
        if (!carOwnerRepository.existsById(id)) {
            throw new ResourceNotFoundException("CarOwner not found with id: " + id);
        }
        carOwnerRepository.deleteById(id);
    }
}
