package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {
    private Integer carId;
    private Integer ownerId;
    private String ownerName;
    private String model;
    private Integer year;
    private String licensePlate;
    private String color;
    private BigDecimal dailyPrice;
    private String status;
    private LocalDateTime createdAt;
}
