package com.example.demo.mapper;

import com.example.demo.dto.BookingCreateDto;
import com.example.demo.dto.BookingDto;
import com.example.demo.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "car.carId", target = "carId")
    @Mapping(source = "car.model", target = "carModel")
    BookingDto toDto(Booking booking);

    @Mapping(source = "carId", target = "car.carId")
    Booking toEntity(BookingCreateDto bookingCreateDto);

    List<BookingDto> toDtoList(List<Booking> bookings);
}
