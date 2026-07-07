package com.accounting.application.controller;

import com.accounting.application.dto.WorkItemDto;
import com.accounting.application.service.WorkItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            @RequestParam(required = false) Long businessId) {
        return ResponseEntity.ok(workItemService.search(query, vehicleModel, businessId));
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
}
