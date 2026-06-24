package com.accounting.application.repository;

import com.accounting.application.entity.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {
    List<WorkItem> findByDescriptionContainingIgnoreCaseOrderByDescriptionAsc(String description);
    Optional<WorkItem> findFirstByDescriptionIgnoreCase(String description);
}
