package com.accounting.application.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceDto {
    private Long id;
    private String invoiceNumber;
    private CustomerDto customer;
    private LocalDate invoiceDate;
    private BigDecimal totalAmount;
    private String vehicleModel;
    private String remark;
    private List<InvoiceItemDto> items;
    private List<InvoicePaymentDto> payments;
    private LocalDateTime deletedAt;
}
