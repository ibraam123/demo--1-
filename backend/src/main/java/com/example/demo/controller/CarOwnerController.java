package com.example.demo.controller;

import com.example.demo.dto.CarOwnerDto;
import com.example.demo.service.CarOwnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/car-owners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CarOwnerController {

    private final CarOwnerService carOwnerService;

    @PostMapping
    public ResponseEntity<CarOwnerDto> createCarOwner(@Valid @RequestBody CarOwnerDto carOwnerDto) {
        return ResponseEntity.ok(carOwnerService.createCarOwner(carOwnerDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarOwnerDto> getCarOwnerById(@PathVariable Integer id) {
        return ResponseEntity.ok(carOwnerService.getCarOwnerById(id));
    }

    @GetMapping
    public ResponseEntity<List<CarOwnerDto>> getAllCarOwners() {
        return ResponseEntity.ok(carOwnerService.getAllCarOwners());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarOwner(@PathVariable Integer id) {
        carOwnerService.deleteCarOwner(id);
        return ResponseEntity.noContent().build();
    }
}
