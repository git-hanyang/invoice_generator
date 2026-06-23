package com.accounting.application.controller;

import com.accounting.application.dto.BusinessDto;
import com.accounting.application.dto.LoginRequest;
import com.accounting.application.dto.LoginResponse;
import com.accounting.application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PutMapping("/select-business/{businessId}")
    public ResponseEntity<BusinessDto> selectBusiness(@PathVariable Long businessId, Principal principal) {
        return ResponseEntity.ok(authService.selectBusiness(principal.getName(), businessId));
    }
}
