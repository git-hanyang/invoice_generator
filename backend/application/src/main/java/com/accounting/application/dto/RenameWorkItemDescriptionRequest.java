package com.accounting.application.dto;

import lombok.Data;

@Data
public class RenameWorkItemDescriptionRequest {
    private Long businessId;
    private String oldDescription;
    private String newDescription;
}
