package com.example.demo.controller;

import com.example.demo.dto.AdminRegistrationDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.UserLoginDto;
import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/user/login")
    public ResponseEntity<AuthResponseDto> authenticateUser(@Valid @RequestBody UserLoginDto loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponseDto> authenticateAdmin(@Valid @RequestBody UserLoginDto loginRequest) {
        return ResponseEntity.ok(authService.authenticateAdmin(loginRequest));
    }

    @PostMapping("/user/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegistrationDto signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/admin/register")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody AdminRegistrationDto signUpRequest) {
        authService.registerAdmin(signUpRequest);
        return ResponseEntity.ok("Admin registered successfully!");
    }
}
