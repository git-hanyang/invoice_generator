package com.accounting.application.controller;

import com.accounting.application.dto.RenameWorkItemDescriptionRequest;
import com.accounting.application.dto.WorkItemDescriptionDto;
import com.accounting.application.dto.WorkItemDto;
import com.accounting.application.service.WorkItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/work-items")
@RequiredArgsConstructor
public class WorkItemController {

    private final WorkItemService workItemService;

    @GetMapping
    public ResponseEntity<List<WorkItemDto>> getAll(@RequestParam(required = false) Long businessId) {
        return ResponseEntity.ok(workItemService.getAll(businessId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<WorkItemDto>> search(
            @RequestParam String query,
            @RequestParam(required = false) String vehicleModel,
            @RequestParam(required = false) Long businessId,
            @RequestParam(required = false, defaultValue = "false") boolean allVehicleModels) {
        return ResponseEntity.ok(workItemService.search(query, vehicleModel, businessId, allVehicleModels));
    }

    @GetMapping("/search/vehicle-model")
    public ResponseEntity<List<WorkItemDto>> searchByVehicleModel(
            @RequestParam String query,
            @RequestParam(required = false) Long businessId) {
        return ResponseEntity.ok(workItemService.searchByVehicleModel(query, businessId));
    }

    @PostMapping
    public ResponseEntity<WorkItemDto> save(@RequestBody WorkItemDto dto) {
        return ResponseEntity.ok(workItemService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/descriptions")
    public ResponseEntity<List<WorkItemDescriptionDto>> getDistinctDescriptions(@RequestParam Long businessId) {
        return ResponseEntity.ok(workItemService.getDistinctDescriptions(businessId));
    }

    @PutMapping("/description")
    public ResponseEntity<?> renameDescription(@RequestBody RenameWorkItemDescriptionRequest req) {
        try {
            int updated = workItemService.renameDescription(req.getBusinessId(), req.getOldDescription(), req.getNewDescription());
            return ResponseEntity.ok(Map.of("updated", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(Map.of("message", "That description already exists for one of the affected vehicle models."));
        }
    }
}
