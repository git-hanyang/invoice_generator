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

    public CustomerDto findOrCreate(String carPlate, String phone, String vehicleModel) {
        String vm = toTitleCase(vehicleModel);
        String ph = phone != null ? phone.trim() : "";
        return repo.findByCarPlateIgnoreCaseAndPhoneAndVehicleModel(carPlate, ph, vm)
                .map(this::toDto)
                .orElseGet(() -> {
                    Customer c = Customer.builder()
                            .carPlate(carPlate.toUpperCase())
                            .phone(ph)
                            .vehicleModel(vm)
                            .build();
                    return toDto(repo.save(c));
                });
    }

    static String toTitleCase(String s) {
        if (s == null || s.isBlank()) return "";
        String[] words = s.trim().toLowerCase().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                if (sb.length() > 0) sb.append(' ');
                sb.append(Character.toUpperCase(word.charAt(0)));
                sb.append(word.substring(1));
            }
        }
        return sb.toString();
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
        dto.setVehicleModel(c.getVehicleModel());
        return dto;
    }
}
