package com.razoragent.controller;

import com.razoragent.model.AnalyticsMetric;
import com.razoragent.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsMetric> getDashboardMetrics() {
        return ResponseEntity.ok(analyticsService.getMerchantDashboardMetrics());
    }
}
