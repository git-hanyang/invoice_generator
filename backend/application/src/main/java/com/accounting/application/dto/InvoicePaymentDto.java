package com.accounting.application.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoicePaymentDto {
    private Long id;
    private BigDecimal amount;
    private LocalDate paymentDate;
}
