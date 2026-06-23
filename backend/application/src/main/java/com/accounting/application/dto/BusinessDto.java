package com.accounting.application.dto;

import lombok.Data;

@Data
public class BusinessDto {
    private Long id;
    private String code;
    private String name;
    private String nameSecondary;
    private String address;
    private String tel;
    private String handPhone;
    private String handPhone2;
    private String gstRegNo;
    private String specialtyEn;
    private String specialtyZh;
}
