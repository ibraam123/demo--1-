package com.example.demo.service;

import com.example.demo.dto.BookingCreateDto;
import com.example.demo.dto.BookingDto;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Car;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.BookingMapper;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CarRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    public BookingDto createBooking(Integer userId, BookingCreateDto createDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Car car = carRepository.findById(createDto.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + createDto.getCarId()));

        if (!"AVAILABLE".equals(car.getStatus())) {
            throw new BadRequestException("Car is not available for booking");
        }

        if (createDto.getEndDate().isBefore(createDto.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        long days = ChronoUnit.DAYS.between(createDto.getStartDate(), createDto.getEndDate());
        if (days == 0) days = 1; // Minimum 1 day charge
        
        BigDecimal totalPrice = car.getDailyPrice().multiply(BigDecimal.valueOf(days));

        Booking booking = bookingMapper.toEntity(createDto);
        booking.setUser(user);
        booking.setCar(car);
        booking.setTotalPrice(totalPrice);
        booking.setStatus("CONFIRMED");

        car.setStatus("BOOKED");
        carRepository.save(car);

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toDto(saved);
    }

    public List<BookingDto> getUserBookings(Integer userId) {
        return bookingMapper.toDtoList(bookingRepository.findByUser_UserId(userId));
    }

    public BookingDto getBookingById(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return bookingMapper.toDto(booking);
    }
}
