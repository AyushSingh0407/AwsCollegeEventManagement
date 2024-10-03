package com.example.demo.controller;

import com.example.demo.model.Club;
import com.example.demo.model.EndUser;
import com.example.demo.model.Event;
import com.example.demo.repository.ClubRepository;
import com.example.demo.repository.EndUserRepository;
import com.example.demo.repository.EventRepository; // Assuming you have a repository for Event
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.example.demo.service.ClubService;
import com.example.demo.service.JwtService;
import com.example.demo.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/club")
public class ClubController {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ClubService clubService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ClubRepository clubRepository;

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
    public ResponseEntity<String> signup(@RequestBody Club clubRequest) {
        try {
            Club newUser = clubService.signup(
                    clubRequest.getClubName(), clubRequest.getClubEmail(), clubRequest.getClubPassword(), clubRequest.getClubPhoneNo(), clubRequest.getClubDescription()
            );
            return ResponseEntity.ok("Club signed up successfully: " + newUser.getClubEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Club clubRequest) {
        try {
            boolean isLoggedIn = clubService.login(
                    clubRequest.getClubEmail(), clubRequest.getClubPassword()
            );

            if (isLoggedIn) {
                // Generate JWT token containing user email and roles
                String token = jwtService.generateToken(clubRequest.getClubEmail());
                return ResponseEntity.ok("Bearer " + token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard/{clubEmail}")
    public List<Event> getEventsByClub(@PathVariable String clubEmail) {
        return eventRepository.findByClubEmail(clubEmail);
    }


}
