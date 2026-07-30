package com.accounting.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WorkItemDescriptionDto {
    private String description;
    private long count;
}
