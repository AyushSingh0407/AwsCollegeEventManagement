package com.example.demo.controller;

import com.example.demo.model.ApiResponse;
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

        String token = authorizationHeader.substring(7);

        // Validate the token
        if (!jwtService.validateToken(token, jwtService.extractUsername(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
        }

        // If token is valid, blacklist it
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("User signed out successfully.");
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody EndUser endUserRequest) {
        try {
            EndUser newUser = endUserService.signup(
                    endUserRequest.getEndUserName(),
                    endUserRequest.getEndUserEmail(),
                    endUserRequest.getEndUserPassword()
            );
            ApiResponse response = new ApiResponse("User signed up successfully", 200, true, newUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(e.getMessage(), 400, false, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody EndUser endUserRequest) {
        try {
            boolean isLoggedIn = endUserService.login(
                    endUserRequest.getEndUserEmail(), endUserRequest.getEndUserPassword()
            );

            if (isLoggedIn) {
                // Generate JWT token containing user email
                String token = jwtService.generateToken(endUserRequest.getEndUserEmail());
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


    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix from the token
            token = token.substring(7);


            String userEmail = jwtService.extractUsername(token);


            EndUser user = endUserRepository.findByEndUserEmail(userEmail);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }


            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("username", user.getEndUserName());
            userDetails.put("email", user.getEndUserEmail());



            return ResponseEntity.ok(userDetails);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

}