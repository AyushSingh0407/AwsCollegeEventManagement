package com.example.demo.controller;

import com.example.demo.model.DSW;
import com.example.demo.model.EndUser;
import com.example.demo.model.Event;
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

        // Extract token from the "Bearer" prefix
        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

        // Validate the token
        if (!jwtService.validateToken(token, jwtService.extractUsername(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
        }

        // If token is valid, blacklist it
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("DSW signed out successfully.");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody DSW dswRequest) {
        try {
            DSW dsw = dswService.signup(
                    dswRequest.getDswMobileNo(), dswRequest.getDswCollegeEmail(), dswRequest.getDswPassword()
            );
            return ResponseEntity.ok("DSW signed up successfully: " + dsw.getDswCollegeEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody DSW dswRequest) {
        try {
            boolean isLoggedIn = dswService.login(
                    dswRequest.getDswCollegeEmail(), dswRequest.getDswPassword()
            );

            if (isLoggedIn) {
                // Generate JWT token containing user email and roles
                String token = jwtService.generateToken(dswRequest.getDswCollegeEmail());
                return ResponseEntity.ok("Bearer " + token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}