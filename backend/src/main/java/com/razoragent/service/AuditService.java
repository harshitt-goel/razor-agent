package com.razoragent.service;

import com.razoragent.model.AuditLog;
import com.razoragent.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog logEvent(String sessionId, String eventType, String description, String payloadJson) {
        AuditLog auditLog = AuditLog.builder()
                .sessionId(sessionId)
                .eventType(eventType)
                .description(description)
                .payloadJson(payloadJson)
                .timestamp(LocalDateTime.now())
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("[AUDIT] [{}] [{}] {}", sessionId, eventType, description);
        return saved;
    }

    public List<AuditLog> getSessionAuditLogs(String sessionId) {
        return auditLogRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
