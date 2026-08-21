package com.accounting.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesSummaryItemDto {
    private Long id;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private BigDecimal totalAmount;
}
