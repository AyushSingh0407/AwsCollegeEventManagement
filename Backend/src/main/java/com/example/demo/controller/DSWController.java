package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.DSWRepository;
import com.example.demo.service.DSWService;
import com.example.demo.service.EventService;
import com.example.demo.service.JwtService;
import com.example.demo.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dsw")
public class DSWController {

    @Autowired
    private EventService eventService;

    @Autowired
    private DSWService dswService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private DSWRepository dswRepository;

    @Autowired
    TokenBlacklistService tokenBlacklistService;


    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }


    @PostMapping("/signout")
    public ResponseEntity<String> signout(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header is missing or invalid.");
        }

        String token = authorizationHeader.substring(7);

        // Validate the token
        if (!jwtService.validateToken(token, jwtService.extractUsername(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
        }

        // If token is valid, blacklist it
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("DSW signed out successfully.");
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody DSW dswRequest) {
        try {
            DSW dsw = dswService.signup(
                    dswRequest.getDswMobileNo(), dswRequest.getDswCollegeEmail(), dswRequest.getDswPassword()
            );
            ApiResponse response = new ApiResponse("DSW signed up successfully", 200, true, dsw);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(e.getMessage(), 400, true, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody DSW dswRequest) {
        try {
            boolean isLoggedIn = dswService.login(
                    dswRequest.getDswCollegeEmail(), dswRequest.getDswPassword()
            );

            if (isLoggedIn) {
                // Generate JWT token containing user email
                String token = jwtService.generateToken(dswRequest.getDswCollegeEmail());
                ApiResponse response = new ApiResponse("Login successful", 200, true, "Bearer " + token);
                return ResponseEntity.ok(response);
            } else {
                ApiResponse errorResponse = new ApiResponse("Login failed!", 401, false, null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(e.getMessage(), 400, false, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/pendingevent")
    public ResponseEntity<List<Event>> getPendingApprovalEvents() {
        List<Event> pendingEvents = eventService.getPendingApprovalEvents();

        if (pendingEvents.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(pendingEvents);
        }
        return ResponseEntity.ok(pendingEvents);
    }

    @GetMapping("/approvedevent")
    public ResponseEntity<List<Event>> getApprovedEvents() {
        List<Event> approvedEvents = eventService.getApprovedEvents();
        return ResponseEntity.ok(approvedEvents);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Authorization header is missing or invalid", 401, false, null));
        }

        String token = authorizationHeader.substring(7);
        String dswCollegeEmail = jwtService.extractUsername(token);

        try {
            DSW dashboardData = dswService.getDashboardDataForDSW(dswCollegeEmail);
            return ResponseEntity.ok(new ApiResponse("Dashboard data retrieved successfully", 200, true, dashboardData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), 500, false, null));
        }
    }
}