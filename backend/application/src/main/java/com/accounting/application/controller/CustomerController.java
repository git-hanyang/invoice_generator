package com.accounting.application.controller;

import com.accounting.application.dto.CustomerDto;
import com.accounting.application.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDto>> search(@RequestParam String query) {
        return ResponseEntity.ok(customerService.search(query));
    }
}
