package com.accounting.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesSummaryDto {
    private BigDecimal totalAmount;
    private long invoiceCount;
    private List<SalesSummaryItemDto> items;
}
