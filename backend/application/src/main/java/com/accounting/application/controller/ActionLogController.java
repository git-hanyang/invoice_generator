package com.accounting.application.controller;

import com.accounting.application.dto.ActionLogRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/actions")
public class ActionLogController {

    private static final Logger AUDIT_LOG = LoggerFactory.getLogger("USER_ACTION");
    private static final int MAX_LEN = 200;

    @PostMapping("/log")
    public ResponseEntity<Void> log(@RequestBody ActionLogRequest request, Principal principal) {
        String user = principal != null ? principal.getName() : "anonymous";
        String action = truncate(request.getAction());
        String path = truncate(request.getPath());
        AUDIT_LOG.info("user={} action=\"{}\" path=\"{}\"", user, action, path);
        return ResponseEntity.ok().build();
    }

    private String truncate(String s) {
        if (s == null) return "";
        return s.length() > MAX_LEN ? s.substring(0, MAX_LEN) : s;
    }
}
