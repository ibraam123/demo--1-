package com.example.demo.pattern.factory;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(10)
public class ElectricCarFactory extends AbstractCarFactory {

    @Override
    public boolean supports(String model) {
        return modelContains(model, "tesla") || modelContains(model, "electric");
    }
}
