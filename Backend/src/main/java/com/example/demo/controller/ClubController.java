package com.example.demo.controller;

import com.example.demo.model.ApiResponse;
import com.example.demo.model.Club;
import com.example.demo.model.Event;
import com.example.demo.repository.ClubRepository;
import com.example.demo.repository.EventRepository;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private S3Service s3Service;

    @Autowired
    private EventService eventService;

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
    public ResponseEntity<ApiResponse> signup(@RequestBody Club clubRequest) {
        try {
            Club newUser = clubService.signup(
                    clubRequest.getClubName(),
                    clubRequest.getClubEmail(),
                    clubRequest.getClubPassword(),
                    clubRequest.getClubPhoneNo(),
                    clubRequest.getClubDescription()
            );
            ApiResponse response = new ApiResponse("Club signed up successfully", 200, true, newUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(e.getMessage(), 400, false, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody Club clubRequest) {
        try {
            boolean isLoggedIn = clubService.login(
                    clubRequest.getClubEmail(),
                    clubRequest.getClubPassword()
            );

            if (isLoggedIn) {
                String clubName = clubService.getClubNameByEmail(clubRequest.getClubEmail());
                String token = jwtService.generateToken(clubRequest.getClubEmail(), clubName);
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
    public ResponseEntity<ApiResponse> getDashboard(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Authorization header is missing or invalid", 401, false, null));
        }

        String token = authorizationHeader.substring(7);
        String clubEmail = jwtService.extractUsername(token);

        try {
            Club dashboardData = clubService.getDashboardDataForClub(clubEmail);
            return ResponseEntity.ok(new ApiResponse("Dashboard data retrieved successfully", 200, true, dashboardData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), 500, false, null));
        }
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getClubEvents(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = authorizationHeader.substring(7);
        String clubEmail = jwtService.extractUsername(token);

        try {
            List<Event> clubEvents = eventService.getEventsByClubEmail(clubEmail);

            if (clubEvents.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok(clubEvents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/event/create")
    public ResponseEntity<ApiResponse> createEvent(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam("eventId") String eventId,
            @RequestParam("eventName") String eventName,
            @RequestParam("eventDescription") String eventDescription,
            @RequestParam("eventStartDate") String eventStartDate,
            @RequestParam("eventStartTime") String eventStartTime,
            @RequestParam("eventEndDate") String eventEndDate,
            @RequestParam("eventEndTime") String eventEndTime,
            @RequestParam("venue") String venue,
            @RequestParam("capacity") int capacity,
            @RequestParam("posterImg") MultipartFile posterImg,
            @RequestParam("approved") String approved) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Authorization header is missing or invalid", 401, false, null));
        }

        String token = authorizationHeader.substring(7);
        String clubEmail = jwtService.extractUsername(token);

        try {
            String posterUrl = s3Service.uploadFile(posterImg);

            int registration = 0;

            Event event = eventService.entry(
                    eventId, eventName, eventDescription, eventStartDate,
                    eventStartTime, eventEndDate, eventEndTime, venue,
                    capacity, posterUrl, clubEmail, approved, registration
            );

            if (event == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse("Event with same eventID already exists!!", 409, false, null));
            }

            return ResponseEntity.ok(new ApiResponse("Event created successfully", 200, true, event));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error creating event: " + e.getMessage(), 500, false, null));
        }
    }

}