package com.example.demo.pattern.factory;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(100)
public class StandardCarFactory extends AbstractCarFactory {

    @Override
    public boolean supports(String model) {
        return true;
    }
}
