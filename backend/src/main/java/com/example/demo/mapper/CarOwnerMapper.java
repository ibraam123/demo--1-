package com.example.demo.mapper;

import com.example.demo.dto.CarOwnerDto;
import com.example.demo.entity.CarOwner;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CarOwnerMapper {
    CarOwnerDto toDto(CarOwner carOwner);
    CarOwner toEntity(CarOwnerDto carOwnerDto);
}
