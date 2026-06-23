package com.accounting.application.service;

import com.accounting.application.dto.WorkItemDto;
import com.accounting.application.entity.WorkItem;
import com.accounting.application.repository.WorkItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkItemService {

    private final WorkItemRepository repo;

    public List<WorkItemDto> search(String query) {
        return repo.findByDescriptionContainingIgnoreCaseOrderByDescriptionAsc(query)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<WorkItemDto> getAll() {
        return repo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public WorkItemDto save(WorkItemDto dto) {
        WorkItem item;
        if (dto.getId() != null) {
            item = repo.findById(dto.getId()).orElse(new WorkItem());
        } else {
            item = new WorkItem();
        }
        item.setDescription(dto.getDescription());
        item.setUnitPrice(dto.getUnitPrice() != null ? dto.getUnitPrice() : BigDecimal.ZERO);
        return toDto(repo.save(item));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private WorkItemDto toDto(WorkItem w) {
        WorkItemDto dto = new WorkItemDto();
        dto.setId(w.getId());
        dto.setDescription(w.getDescription());
        dto.setUnitPrice(w.getUnitPrice());
        return dto;
    }
}
