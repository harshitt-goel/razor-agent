package com.razoragent.controller;

import com.razoragent.agent.AgentOrchestrator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final AgentOrchestrator agentOrchestrator;

    public ChatController(AgentOrchestrator agentOrchestrator) {
        this.agentOrchestrator = agentOrchestrator;
    }

    public static class ChatRequest {
        private String sessionId;
        private String message;
        private boolean simulateFailure;

        public ChatRequest() {}

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public boolean isSimulateFailure() { return simulateFailure; }
        public void setSimulateFailure(boolean simulateFailure) { this.simulateFailure = simulateFailure; }
    }

    @PostMapping
    public ResponseEntity<AgentOrchestrator.AgentResponse> handleChat(@RequestBody ChatRequest request) {
        String sessionId = (request.getSessionId() != null && !request.getSessionId().isBlank())
                ? request.getSessionId() 
                : "session-" + System.currentTimeMillis();
        AgentOrchestrator.AgentResponse response = agentOrchestrator.processUserMessage(
                sessionId, 
                request.getMessage(), 
                request.isSimulateFailure()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/approve")
    public ResponseEntity<AgentOrchestrator.AgentResponse> approvePayment(@RequestBody ChatRequest request) {
        AgentOrchestrator.AgentResponse response = agentOrchestrator.approveAndCreateOrder(
                request.getSessionId(), 
                request.isSimulateFailure()
        );
        return ResponseEntity.ok(response);
    }
}
