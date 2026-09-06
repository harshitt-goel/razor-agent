package com.razoragent.repository;

import com.razoragent.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findBySessionIdOrderByTimestampAsc(String sessionId);
    List<AuditLog> findTop50ByOrderByTimestampDesc();
}
