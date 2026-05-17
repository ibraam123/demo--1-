package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarCreateDto {
    @NotNull(message = "Owner ID is required")
    private Integer ownerId;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Year is required")
    @Min(value = 1900, message = "Invalid year")
    private Integer year;

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    private String color;

    @NotNull(message = "Daily price is required")
    @Min(value = 0, message = "Daily price must be positive")
    private BigDecimal dailyPrice;

    private String status = "AVAILABLE";
}
