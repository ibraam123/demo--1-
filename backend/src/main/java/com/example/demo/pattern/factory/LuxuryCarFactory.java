package com.example.demo.pattern.factory;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(20)
public class LuxuryCarFactory extends AbstractCarFactory {

    @Override
    public boolean supports(String model) {
        return modelContains(model, "porsche") || modelContains(model, "ferrari");
    }
}
