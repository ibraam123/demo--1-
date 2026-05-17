package com.example.demo.specification;

import com.example.demo.entity.Car;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class CarSpecification {

    public static Specification<Car> hasModel(String model) {
        return (root, query, cb) -> model == null ? cb.conjunction() : cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%");
    }

    public static Specification<Car> hasYear(Integer year) {
        return (root, query, cb) -> year == null ? cb.conjunction() : cb.equal(root.get("year"), year);
    }

    public static Specification<Car> hasStatus(String status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Car> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("dailyPrice"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("dailyPrice"), minPrice);
            } else if (maxPrice != null) {
                return cb.lessThanOrEqualTo(root.get("dailyPrice"), maxPrice);
            } else {
                return cb.conjunction();
            }
        };
    }
}
