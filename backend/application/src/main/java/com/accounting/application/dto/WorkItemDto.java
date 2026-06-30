package com.accounting.application.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WorkItemDto {
    private Long id;
    private String description;
    private String vehicleModel;
    private BigDecimal unitPrice;
}
