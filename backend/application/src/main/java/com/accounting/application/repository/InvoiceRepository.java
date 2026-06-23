package com.accounting.application.repository;

import com.accounting.application.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumberAndDeletedAtIsNull(String invoiceNumber);

    boolean existsByInvoiceNumberAndDeletedAtIsNull(String invoiceNumber);

    @Query("SELECT i FROM Invoice i WHERE i.deletedAt IS NULL AND (i.customer.carPlate LIKE %:query% OR i.customer.phone LIKE %:query%) ORDER BY i.invoiceDate DESC")
    List<Invoice> searchByCustomerCarPlateOrPhone(@Param("query") String query);

    @Query("SELECT i FROM Invoice i WHERE i.deletedAt IS NULL ORDER BY i.invoiceDate DESC")
    List<Invoice> findAllActiveOrderByDateDesc();

    @Query("SELECT i FROM Invoice i ORDER BY i.invoiceDate DESC")
    List<Invoice> findAllIncludeDeletedOrderByDateDesc();

    @Query("SELECT i FROM Invoice i WHERE (i.customer.carPlate LIKE %:query% OR i.customer.phone LIKE %:query%) ORDER BY i.invoiceDate DESC")
    List<Invoice> searchAllIncludeDeletedByCarPlateOrPhone(@Param("query") String query);

    @Query("SELECT i.invoiceNumber FROM Invoice i WHERE i.deletedAt IS NULL AND i.invoiceNumber IS NOT NULL")
    List<String> findAllActiveInvoiceNumbers();
}
