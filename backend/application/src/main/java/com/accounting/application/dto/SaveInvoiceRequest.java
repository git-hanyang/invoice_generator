package com.accounting.application.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class SaveInvoiceRequest {
    private String invoiceNumber;
    private Long customerId;
    private String carPlate;
    private String phone;
    private LocalDate invoiceDate;
    private BigDecimal totalAmount;
    private String remark;
    private List<InvoiceItemDto> items;
    private List<InvoicePaymentDto> payments;
    private String pdfBase64;
}
