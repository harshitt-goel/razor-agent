package com.razoragent.controller;

import com.razoragent.model.AuditLog;
import com.razoragent.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<AuditLog>> getAuditTrailForSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(auditService.getSessionAuditLogs(sessionId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AuditLog>> getRecentAuditTrail() {
        return ResponseEntity.ok(auditService.getRecentAuditLogs());
    }
}
