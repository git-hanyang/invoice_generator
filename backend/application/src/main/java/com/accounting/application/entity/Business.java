package com.accounting.application.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "businesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "name_secondary", length = 200)
    private String nameSecondary;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 50)
    private String tel;

    @Column(name = "hand_phone", length = 50)
    private String handPhone;

    @Column(name = "hand_phone2", length = 50)
    private String handPhone2;

    @Column(name = "gst_reg_no", length = 50)
    private String gstRegNo;

    @Column(name = "specialty_en", columnDefinition = "TEXT")
    private String specialtyEn;

    @Column(name = "specialty_zh", columnDefinition = "TEXT")
    private String specialtyZh;
}
