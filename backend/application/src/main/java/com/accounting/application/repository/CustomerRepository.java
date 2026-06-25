package com.accounting.application.repository;

import com.accounting.application.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByCarPlateContainingIgnoreCase(String carPlate);
    Optional<Customer> findByCarPlateIgnoreCase(String carPlate);
    Optional<Customer> findByCarPlateIgnoreCaseAndPhone(String carPlate, String phone);
    List<Customer> findByPhoneContaining(String phone);
}
