package com.accounting.application.service;

import com.accounting.application.dto.*;
import com.accounting.application.entity.*;
import com.accounting.application.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;
    private final CustomerRepository customerRepo;
    private final CustomerService customerService;
    private final WorkItemService workItemService;

    @Transactional
    public InvoiceDto save(SaveInvoiceRequest req) {
        CustomerDto customerDto = customerService.findOrCreate(req.getCarPlate(), req.getPhone());
        Customer customer = customerRepo.findById(customerDto.getId()).orElseThrow();

        Invoice invoice = invoiceRepo.findByInvoiceNumberAndDeletedAtIsNull(req.getInvoiceNumber())
                .orElse(Invoice.builder().build());

        invoice.setInvoiceNumber(req.getInvoiceNumber());
        invoice.setCustomer(customer);
        invoice.setInvoiceDate(req.getInvoiceDate());
        invoice.setTotalAmount(req.getTotalAmount());
        invoice.setRemark(req.getRemark());

        if (req.getPdfBase64() != null && !req.getPdfBase64().isBlank()) {
            String raw = req.getPdfBase64();
            int comma = raw.indexOf(',');
            String encoded = comma >= 0 ? raw.substring(comma + 1) : raw;
            invoice.setPdfData(Base64.getMimeDecoder().decode(encoded));
        }

        invoice.getItems().clear();
        if (req.getItems() != null) {
            for (int i = 0; i < req.getItems().size(); i++) {
                InvoiceItemDto d = req.getItems().get(i);
                InvoiceItem item = InvoiceItem.builder()
                        .invoice(invoice)
                        .description(d.getDescription())
                        .quantity(d.getQuantity())
                        .unitPrice(d.getUnitPrice())
                        .amount(d.getAmount())
                        .sortOrder(i)
                        .build();
                invoice.getItems().add(item);
                workItemService.upsertByDescription(d.getDescription(), d.getUnitPrice());
            }
        }

        invoice.getPayments().clear();
        if (req.getPayments() != null) {
            for (InvoicePaymentDto p : req.getPayments()) {
                InvoicePayment payment = InvoicePayment.builder()
                        .invoice(invoice)
                        .amount(p.getAmount())
                        .paymentDate(p.getPaymentDate())
                        .build();
                invoice.getPayments().add(payment);
            }
        }

        return toDto(invoiceRepo.save(invoice), false);
    }

    @Transactional
    public void deleteByInvoiceNumber(String invoiceNumber) {
        invoiceRepo.findByInvoiceNumberAndDeletedAtIsNull(invoiceNumber).ifPresent(inv -> {
            inv.setDeletedAt(LocalDateTime.now());
            invoiceRepo.save(inv);
        });
    }

    public List<InvoiceDto> search(String query) {
        List<Invoice> results = (query == null || query.isBlank())
                ? invoiceRepo.findAllIncludeDeletedOrderByDateDesc()
                : invoiceRepo.searchAllIncludeDeletedByCarPlateOrPhone(query);
        return results.stream().map(i -> toDto(i, false)).collect(Collectors.toList());
    }

    public InvoiceDto getById(Long id) {
        Invoice inv = invoiceRepo.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
        return toDto(inv, true);
    }

    public boolean invoiceNumberExists(String invoiceNumber) {
        return invoiceRepo.existsByInvoiceNumberAndDeletedAtIsNull(invoiceNumber);
    }

    public String getNextInvoiceNumber() {
        List<String> numbers = invoiceRepo.findAllActiveInvoiceNumbers();
        int max = numbers.stream()
                .filter(n -> n != null && n.matches(".*\\d+$"))
                .mapToInt(n -> {
                    try {
                        String digits = n.replaceAll(".*?(\\d+)$", "$1");
                        return Integer.parseInt(digits);
                    } catch (NumberFormatException e) { return 0; }
                })
                .max().orElse(0);
        return String.format("INV-%03d", max + 1);
    }

    private InvoiceDto toDto(Invoice inv, boolean includePdf) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(inv.getId());
        dto.setInvoiceNumber(inv.getInvoiceNumber());
        dto.setInvoiceDate(inv.getInvoiceDate());
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setRemark(inv.getRemark());

        CustomerDto cd = new CustomerDto();
        cd.setId(inv.getCustomer().getId());
        cd.setCarPlate(inv.getCustomer().getCarPlate());
        cd.setPhone(inv.getCustomer().getPhone());
        dto.setCustomer(cd);

        dto.setItems(inv.getItems().stream().map(item -> {
            InvoiceItemDto id2 = new InvoiceItemDto();
            id2.setId(item.getId());
            id2.setDescription(item.getDescription());
            id2.setQuantity(item.getQuantity());
            id2.setUnitPrice(item.getUnitPrice());
            id2.setAmount(item.getAmount());
            id2.setSortOrder(item.getSortOrder());
            return id2;
        }).collect(Collectors.toList()));

        dto.setPayments(inv.getPayments().stream().map(p -> {
            InvoicePaymentDto pd = new InvoicePaymentDto();
            pd.setId(p.getId());
            pd.setAmount(p.getAmount());
            pd.setPaymentDate(p.getPaymentDate());
            return pd;
        }).collect(Collectors.toList()));

        dto.setDeletedAt(inv.getDeletedAt());

        if (includePdf && inv.getPdfData() != null) {
            dto.setPdfBase64("data:application/pdf;base64," + Base64.getEncoder().encodeToString(inv.getPdfData()));
        }

        return dto;
    }
}
