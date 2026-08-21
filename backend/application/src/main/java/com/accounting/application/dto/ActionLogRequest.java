package com.accounting.application.dto;

import lombok.Data;

@Data
public class ActionLogRequest {
    private String action;
    private String path;
}
