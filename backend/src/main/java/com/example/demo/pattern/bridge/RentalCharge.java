package com.example.demo.pattern.bridge;

import com.example.demo.entity.Car;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public abstract class RentalCharge {

    private final PricingEngine pricingEngine;

    protected RentalCharge(PricingEngine pricingEngine) {
        this.pricingEngine = pricingEngine;
    }

    public BigDecimal calculateTotal(Car car, LocalDate startDate, LocalDate endDate) {
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days == 0) {
            days = 1;
        }
        return pricingEngine.calculate(car.getDailyPrice(), days);
    }
}
