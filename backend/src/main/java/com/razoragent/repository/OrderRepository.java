package com.razoragent.repository;

import com.razoragent.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findBySessionIdOrderByCreatedAtDesc(String sessionId);
    List<Order> findByStatus(String status);
}
