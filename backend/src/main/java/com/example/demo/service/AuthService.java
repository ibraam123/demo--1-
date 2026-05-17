package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.Admin;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthResponseDto authenticateUser(UserLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new AuthResponseDto(jwt, "ROLE_USER"); // In a real app we'd fetch the role from auth object
    }

    public AuthResponseDto authenticateAdmin(UserLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new AuthResponseDto(jwt, "ROLE_ADMIN");
    }

    public void registerUser(UserRegistrationDto signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent() ||
            adminRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                .build();

        userRepository.save(user);
    }

    public void registerAdmin(AdminRegistrationDto signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent() ||
            adminRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        Admin admin = Admin.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                .build();

        adminRepository.save(admin);
    }
}
