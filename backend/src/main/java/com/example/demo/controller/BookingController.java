package com.example.demo.controller;

import com.example.demo.dto.BookingCreateDto;
import com.example.demo.dto.BookingDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    private Integer getOrCreateUserIdFromJwt(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getSubject() + "@firebase.com";
        }
        String finalEmail = email;
        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            String name = jwt.getClaimAsString("name");
            if (name == null) name = "Firebase User";
            User newUser = User.builder()
                    .email(finalEmail)
                    .fullName(name)
                    .passwordHash("FIREBASE_EXTERNAL_AUTH")
                    .build();
            return userRepository.save(newUser);
        });
        return user.getUserId();
    }

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody BookingCreateDto createDto) {
        Integer userId = getOrCreateUserIdFromJwt(jwt);
        return ResponseEntity.ok(bookingService.createBooking(userId, createDto));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDto>> getMyBookings(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = getOrCreateUserIdFromJwt(jwt);
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
}

