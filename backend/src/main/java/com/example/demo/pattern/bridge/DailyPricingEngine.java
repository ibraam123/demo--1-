package com.example.demo.pattern.bridge;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DailyPricingEngine implements PricingEngine {

    @Override
    public BigDecimal calculate(BigDecimal dailyPrice, long days) {
        return dailyPrice.multiply(BigDecimal.valueOf(days));
    }
}
