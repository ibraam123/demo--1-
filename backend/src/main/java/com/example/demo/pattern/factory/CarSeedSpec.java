package com.example.demo.pattern.factory;

import java.math.BigDecimal;

public record CarSeedSpec(
        String model,
        Integer year,
        String licensePlate,
        String color,
        BigDecimal dailyPrice,
        String status
) {
}
