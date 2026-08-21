package com.accounting.application.service;

import com.accounting.application.dto.WorkItemDescriptionDto;
import com.accounting.application.dto.WorkItemDto;
import com.accounting.application.entity.Business;
import com.accounting.application.entity.WorkItem;
import com.accounting.application.repository.BusinessRepository;
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
    private final BusinessRepository businessRepository;

    public List<WorkItemDto> search(String query, String vehicleModel, Long businessId, boolean allVehicleModels) {
        if (query == null || query.isBlank() || businessId == null) return List.of();
        String ftQuery = toFulltextQuery(query);
        if (vehicleModel != null && !vehicleModel.isBlank()) {
            return repo.searchByDescriptionAndVehicleModel(ftQuery, CustomerService.toTitleCase(vehicleModel), businessId)
                    .stream().map(this::toDto).collect(Collectors.toList());
        }
        List<WorkItem> results = allVehicleModels
                ? repo.searchAllByDescription(ftQuery, businessId)
                : repo.searchByDescription(ftQuery, businessId);
        return results.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<WorkItemDto> searchByVehicleModel(String query, Long businessId) {
        if (query == null || query.isBlank() || businessId == null) return List.of();
        return repo.searchByVehicleModel(toFulltextQuery(query), businessId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private String toFulltextQuery(String raw) {
        return Arrays.stream(raw.trim().split("\\s+"))
                .filter(t -> !t.isEmpty())
                .map(t -> t + "*")
                .collect(Collectors.joining(" "));
    }

    public List<WorkItemDto> getAll(Long businessId) {
        List<WorkItem> items = businessId != null ? repo.findAllByBusinessId(businessId) : repo.findAll();
        return items.stream().map(this::toDto).collect(Collectors.toList());
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
        if (dto.getBusinessId() != null) {
            Business business = businessRepository.findById(dto.getBusinessId())
                    .orElseThrow(() -> new IllegalArgumentException("Business not found"));
            item.setBusiness(business);
        }
        return toDto(repo.save(item));
    }

    @Transactional
    public void upsertByDescriptionAndVehicleModel(String description, String vehicleModel, BigDecimal unitPrice, Long businessId) {
        if (description == null || description.isBlank()) return;
        String vm = CustomerService.toTitleCase(vehicleModel);
        WorkItem item = repo.findFirstByDescriptionIgnoreCaseAndVehicleModelIgnoreCaseAndBusinessId(description.trim(), vm, businessId)
                .orElse(new WorkItem());
        item.setDescription(description.trim());
        item.setVehicleModel(vm);
        item.setUnitPrice(unitPrice != null ? unitPrice : BigDecimal.ZERO);
        if (businessId != null) {
            businessRepository.findById(businessId).ifPresent(item::setBusiness);
        }
        repo.save(item);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<WorkItemDescriptionDto> getDistinctDescriptions(Long businessId) {
        if (businessId == null) return List.of();
        return repo.findDistinctDescriptionCounts(businessId).stream()
                .map(row -> new WorkItemDescriptionDto((String) row[0], ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
    }

    @Transactional
    public int renameDescription(Long businessId, String oldDescription, String newDescription) {
        if (businessId == null || oldDescription == null || oldDescription.isBlank()
                || newDescription == null || newDescription.isBlank()) {
            throw new IllegalArgumentException("businessId, oldDescription and newDescription are required.");
        }
        return repo.renameDescription(businessId, oldDescription.trim(), newDescription.trim());
    }

    private WorkItemDto toDto(WorkItem w) {
        WorkItemDto dto = new WorkItemDto();
        dto.setId(w.getId());
        dto.setDescription(w.getDescription());
        dto.setVehicleModel(w.getVehicleModel());
        dto.setUnitPrice(w.getUnitPrice());
        dto.setBusinessId(w.getBusiness() != null ? w.getBusiness().getId() : null);
        return dto;
    }
}
