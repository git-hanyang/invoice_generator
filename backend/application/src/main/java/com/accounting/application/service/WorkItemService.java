package com.accounting.application.service;

import com.accounting.application.dto.WorkItemDto;
import com.accounting.application.entity.WorkItem;
import com.accounting.application.repository.WorkItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkItemService {

    private final WorkItemRepository repo;

    public List<WorkItemDto> search(String query, String vehicleModel) {
        if (query == null || query.isBlank()) return List.of();
        String ftQuery = toFulltextQuery(query);
        if (vehicleModel != null && !vehicleModel.isBlank()) {
            return repo.searchByDescriptionAndVehicleModel(ftQuery, CustomerService.toTitleCase(vehicleModel))
                    .stream().map(this::toDto).collect(Collectors.toList());
        }
        return repo.searchByDescription(ftQuery)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<WorkItemDto> searchByVehicleModel(String query) {
        if (query == null || query.isBlank()) return List.of();
        return repo.searchByVehicleModel(toFulltextQuery(query))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private String toFulltextQuery(String raw) {
        return Arrays.stream(raw.trim().split("\\s+"))
                .filter(t -> !t.isEmpty())
                .map(t -> t + "*")
                .collect(Collectors.joining(" "));
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
        item.setVehicleModel(dto.getVehicleModel());
        item.setUnitPrice(dto.getUnitPrice() != null ? dto.getUnitPrice() : BigDecimal.ZERO);
        return toDto(repo.save(item));
    }

    @Transactional
    public void upsertByDescriptionAndVehicleModel(String description, String vehicleModel, BigDecimal unitPrice) {
        if (description == null || description.isBlank()) return;
        String vm = CustomerService.toTitleCase(vehicleModel);
        WorkItem item = repo.findFirstByDescriptionIgnoreCaseAndVehicleModelIgnoreCase(description.trim(), vm)
                .orElse(new WorkItem());
        item.setDescription(description.trim());
        item.setVehicleModel(vm);
        item.setUnitPrice(unitPrice != null ? unitPrice : BigDecimal.ZERO);
        repo.save(item);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private WorkItemDto toDto(WorkItem w) {
        WorkItemDto dto = new WorkItemDto();
        dto.setId(w.getId());
        dto.setDescription(w.getDescription());
        dto.setVehicleModel(w.getVehicleModel());
        dto.setUnitPrice(w.getUnitPrice());
        return dto;
    }
}
