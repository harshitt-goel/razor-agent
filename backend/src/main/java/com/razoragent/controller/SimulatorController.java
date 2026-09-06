package com.razoragent.controller;

import com.razoragent.model.BuyerSimulatorResult;
import com.razoragent.service.BuyerSimulatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulator")
public class SimulatorController {

    private final BuyerSimulatorService buyerSimulatorService;

    public SimulatorController(BuyerSimulatorService buyerSimulatorService) {
        this.buyerSimulatorService = buyerSimulatorService;
    }

    @PostMapping("/run")
    public ResponseEntity<List<BuyerSimulatorResult>> runSimulations() {
        return ResponseEntity.ok(buyerSimulatorService.runSimulations());
    }

    @GetMapping("/personas")
    public ResponseEntity<List<BuyerSimulatorResult>> getSampleSimulations() {
        return ResponseEntity.ok(buyerSimulatorService.runSimulations());
    }
}
