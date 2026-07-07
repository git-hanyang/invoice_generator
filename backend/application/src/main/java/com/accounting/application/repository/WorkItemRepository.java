package com.accounting.application.repository;

import com.accounting.application.entity.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {

    @Query(value = "SELECT * FROM work_items WHERE id IN (SELECT MAX(id) FROM work_items WHERE MATCH(description) AGAINST (:query IN BOOLEAN MODE) AND business_id = :businessId GROUP BY description) ORDER BY description ASC", nativeQuery = true)
    List<WorkItem> searchByDescription(String query, Long businessId);

    @Query(value = "SELECT * FROM work_items WHERE MATCH(description) AGAINST (:query IN BOOLEAN MODE) AND vehicle_model = :vehicleModel AND business_id = :businessId ORDER BY description ASC", nativeQuery = true)
    List<WorkItem> searchByDescriptionAndVehicleModel(String query, String vehicleModel, Long businessId);

    @Query(value = "SELECT * FROM work_items WHERE MATCH(vehicle_model) AGAINST (:query IN BOOLEAN MODE) AND business_id = :businessId ORDER BY vehicle_model ASC", nativeQuery = true)
    List<WorkItem> searchByVehicleModel(String query, Long businessId);

    Optional<WorkItem> findFirstByDescriptionIgnoreCaseAndVehicleModelIgnoreCaseAndBusinessId(String description, String vehicleModel, Long businessId);

    List<WorkItem> findAllByBusinessId(Long businessId);
}
