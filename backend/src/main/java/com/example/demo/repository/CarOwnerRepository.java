package com.example.demo.repository;

import com.example.demo.entity.CarOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarOwnerRepository extends JpaRepository<CarOwner, Integer> {
    Optional<CarOwner> findByEmail(String email);
}
