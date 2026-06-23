package com.accounting.application.controller;

import com.accounting.application.dto.InvoiceDto;
import com.accounting.application.dto.SaveInvoiceRequest;
import com.accounting.application.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<InvoiceDto> save(@RequestBody SaveInvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.save(request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<InvoiceDto>> search(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(invoiceService.search(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @DeleteMapping("/number/{invoiceNumber}")
    public ResponseEntity<Void> deleteByNumber(@PathVariable String invoiceNumber) {
        invoiceService.deleteByInvoiceNumber(invoiceNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> exists(@RequestParam String invoiceNumber) {
        return ResponseEntity.ok(Map.of("exists", invoiceService.invoiceNumberExists(invoiceNumber)));
    }

    @GetMapping("/next-number")
    public ResponseEntity<Map<String, String>> nextNumber() {
        return ResponseEntity.ok(Map.of("invoiceNumber", invoiceService.getNextInvoiceNumber()));
    }
}
