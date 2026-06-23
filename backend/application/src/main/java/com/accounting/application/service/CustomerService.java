package com.accounting.application.service;

import com.accounting.application.dto.CustomerDto;
import com.accounting.application.entity.Customer;
import com.accounting.application.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repo;

    public List<CustomerDto> search(String query) {
        return repo.findByCarPlateContainingIgnoreCase(query)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public CustomerDto findOrCreate(String carPlate, String phone) {
        return repo.findByCarPlateIgnoreCase(carPlate)
                .map(c -> {
                    if (phone != null && !phone.isBlank() && !phone.equals(c.getPhone())) {
                        c.setPhone(phone);
                        repo.save(c);
                    }
                    return toDto(c);
                })
                .orElseGet(() -> {
                    Customer c = Customer.builder().carPlate(carPlate.toUpperCase()).phone(phone).build();
                    return toDto(repo.save(c));
                });
    }

    public CustomerDto update(Long id, String carPlate, String phone) {
        Customer c = repo.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        c.setCarPlate(carPlate.toUpperCase());
        c.setPhone(phone);
        return toDto(repo.save(c));
    }

    private CustomerDto toDto(Customer c) {
        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId());
        dto.setCarPlate(c.getCarPlate());
        dto.setPhone(c.getPhone());
        return dto;
    }
}
