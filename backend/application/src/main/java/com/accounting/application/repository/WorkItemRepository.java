package com.accounting.application.repository;

import com.accounting.application.entity.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {
    List<WorkItem> findByDescriptionContainingIgnoreCaseOrderByDescriptionAsc(String description);
}
