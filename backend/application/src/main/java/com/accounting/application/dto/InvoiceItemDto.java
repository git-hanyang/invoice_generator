package com.accounting.application.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceItemDto {
    private Long id;
    private String description;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private Integer sortOrder;
}
