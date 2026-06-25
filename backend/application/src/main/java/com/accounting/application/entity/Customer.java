package com.accounting.application.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers", uniqueConstraints = @UniqueConstraint(columnNames = {"car_plate", "phone"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "car_plate", nullable = false, length = 50)
    private String carPlate;

    @Column(length = 30)
    private String phone;
}
