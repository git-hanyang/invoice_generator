package com.accounting.application.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers", uniqueConstraints = @UniqueConstraint(name = "uq_car_plate_phone_vehicle", columnNames = {"car_plate", "phone", "vehicle_model"}))
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

    @Column(length = 30, nullable = false)
    private String phone;

    @Column(name = "vehicle_model", length = 200, nullable = false)
    private String vehicleModel;
}
