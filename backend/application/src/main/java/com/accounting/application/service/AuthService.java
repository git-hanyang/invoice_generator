package com.accounting.application.service;

import com.accounting.application.dto.BusinessDto;
import com.accounting.application.dto.LoginRequest;
import com.accounting.application.dto.LoginResponse;
import com.accounting.application.entity.Business;
import com.accounting.application.entity.User;
import com.accounting.application.repository.BusinessRepository;
import com.accounting.application.repository.UserRepository;
import com.accounting.application.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = jwtUtil.generate(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        return new LoginResponse(token, request.getUsername(), toBusinessDto(user.getBusiness()));
    }

    @Transactional
    public LoginResponse register(LoginRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        String token = jwtUtil.generate(request.getUsername());
        return new LoginResponse(token, request.getUsername(), null);
    }

    @Transactional
    public BusinessDto selectBusiness(String username, Long businessId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found"));
        user.setBusiness(business);
        userRepository.save(user);
        return toBusinessDto(business);
    }

    public BusinessDto toBusinessDto(Business b) {
        if (b == null) return null;
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
