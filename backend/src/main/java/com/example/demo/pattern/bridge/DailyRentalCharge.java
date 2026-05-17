package com.example.demo.pattern.bridge;

import org.springframework.stereotype.Component;

@Component
public class DailyRentalCharge extends RentalCharge {

    public DailyRentalCharge(PricingEngine pricingEngine) {
        super(pricingEngine);
    }
}
