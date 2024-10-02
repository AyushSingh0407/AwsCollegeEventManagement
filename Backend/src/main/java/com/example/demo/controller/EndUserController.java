package com.example.demo.controller;

import com.example.demo.model.EndUser;
import com.example.demo.repository.EndUserRepository;
import com.example.demo.service.EndUserService;
import com.example.demo.service.JwtService;
import com.example.demo.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/enduser")
public class EndUserController {

    @Autowired
    private EndUserService endUserService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EndUserRepository endUserRepository;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

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
        return ResponseEntity.ok("User signed out successfully.");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody EndUser endUserRequest) {
        try {
            EndUser newUser = endUserService.signup(
                    endUserRequest.getEndUserName(), endUserRequest.getEndUserEmail(), endUserRequest.getEndUserPassword()
            );
            return ResponseEntity.ok("User signed up successfully: " + newUser.getEndUserEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody EndUser endUserRequest) {
        try {
            boolean isLoggedIn = endUserService.login(
                    endUserRequest.getEndUserEmail(), endUserRequest.getEndUserPassword()
            );

            if (isLoggedIn) {
                // Generate JWT token containing user email and roles
                String token = jwtService.generateToken(endUserRequest.getEndUserEmail());
                return ResponseEntity.ok("Bearer " + token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix from the token
            token = token.substring(7);

            // Extract user email from the token
            String userEmail = jwtService.extractUsername(token);

            // Fetch user details from the database
            EndUser user = endUserRepository.findByEndUserEmail(userEmail);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            // Prepare user-specific details for the dashboard
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("username", user.getEndUserName());
            userDetails.put("email", user.getEndUserEmail());



            return ResponseEntity.ok(userDetails);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


}
