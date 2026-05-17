package com.example.demo.mapper;

import com.example.demo.dto.CarCreateDto;
import com.example.demo.dto.CarDto;
import com.example.demo.entity.Car;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CarMapper {
    
    @Mapping(source = "owner.ownerId", target = "ownerId")
    @Mapping(source = "owner.fullName", target = "ownerName")
    CarDto toDto(Car car);

    @Mapping(source = "ownerId", target = "owner.ownerId")
    Car toEntity(CarCreateDto carCreateDto);

    List<CarDto> toDtoList(List<Car> cars);
}
