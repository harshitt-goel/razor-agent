package com.razoragent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sessionId;
    private String eventType;

    @Column(length = 2000)
    private String description;

    @Column(length = 4000)
    private String payloadJson;
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(Long id, String sessionId, String eventType, String description, String payloadJson, LocalDateTime timestamp) {
        this.id = id;
        this.sessionId = sessionId;
        this.eventType = eventType;
        this.description = description;
        this.payloadJson = payloadJson;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPayloadJson() { return payloadJson; }
    public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @PrePersist
    public void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String sessionId;
        private String eventType;
        private String description;
        private String payloadJson;
        private LocalDateTime timestamp;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder eventType(String eventType) { this.eventType = eventType; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder payloadJson(String payloadJson) { this.payloadJson = payloadJson; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public AuditLog build() {
            return new AuditLog(id, sessionId, eventType, description, payloadJson, timestamp);
        }
    }
}
