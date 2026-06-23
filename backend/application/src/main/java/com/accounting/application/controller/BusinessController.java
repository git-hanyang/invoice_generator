package com.accounting.application.controller;

import com.accounting.application.dto.BusinessDto;
import com.accounting.application.entity.Business;
import com.accounting.application.repository.BusinessRepository;
import com.accounting.application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<BusinessDto>> getAll() {
        return ResponseEntity.ok(
                businessRepository.findAll().stream().map(this::toDto).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessDto> getById(@PathVariable Long id) {
        return businessRepository.findById(id)
                .map(b -> ResponseEntity.ok(toDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BusinessDto> create(@RequestBody BusinessDto request, Principal principal) {
        Business b = new Business();
        b.setCode(request.getCode() != null && !request.getCode().isBlank()
                ? request.getCode().toUpperCase()
                : request.getName().replaceAll("[^A-Za-z0-9]", "").toUpperCase().substring(0, Math.min(8, request.getName().replaceAll("[^A-Za-z0-9]", "").length())));
        b.setName(request.getName());
        b.setNameSecondary(request.getNameSecondary());
        b.setAddress(request.getAddress());
        b.setTel(request.getTel());
        b.setHandPhone(request.getHandPhone());
        b.setHandPhone2(request.getHandPhone2());
        b.setGstRegNo(request.getGstRegNo());
        b.setSpecialtyEn(request.getSpecialtyEn());
        b.setSpecialtyZh(request.getSpecialtyZh());
        Business saved = businessRepository.save(b);

        // Bind to current user
        if (principal != null) {
            userRepository.findByUsername(principal.getName()).ifPresent(user -> {
                user.setBusiness(saved);
                userRepository.save(user);
            });
        }

        return ResponseEntity.ok(toDto(saved));
    }

    private BusinessDto toDto(Business b) {
        BusinessDto dto = new BusinessDto();
        dto.setId(b.getId());
        dto.setCode(b.getCode());
        dto.setName(b.getName());
        dto.setNameSecondary(b.getNameSecondary());
        dto.setAddress(b.getAddress());
        dto.setTel(b.getTel());
        dto.setHandPhone(b.getHandPhone());
        dto.setHandPhone2(b.getHandPhone2());
        dto.setGstRegNo(b.getGstRegNo());
        dto.setSpecialtyEn(b.getSpecialtyEn());
        dto.setSpecialtyZh(b.getSpecialtyZh());
        return dto;
    }
}
