package com.example.demo.pattern.bridge;

import java.math.BigDecimal;

public interface PricingEngine {

    BigDecimal calculate(BigDecimal dailyPrice, long days);
}
