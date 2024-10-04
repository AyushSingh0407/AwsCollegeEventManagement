package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.model.ApiResponse;
import com.example.demo.service.EventService;
import com.example.demo.service.JwtService;
import com.example.demo.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@RestController
@RequestMapping("/club/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createEvent(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam("eventId") String eventId,
            @RequestParam("eventName") String eventName,
            @RequestParam("eventDescription") String eventDescription,
            @RequestParam("eventStartDate") Date eventStartDate,
            @RequestParam("eventStartTime") Date eventStartTime,
            @RequestParam("eventEndDate") Date eventEndDate,
            @RequestParam("eventEndTime") Date eventEndTime,
            @RequestParam("venue") String venue,
            @RequestParam("capacity") int capacity,
            @RequestParam("posterImg") MultipartFile posterImg,
            @RequestParam("approved") String approved){


        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Authorization header is missing or invalid", 401, false, null));
        }

        String token = authorizationHeader.substring(7);
        String clubEmail = jwtService.extractUsername(token);

        try {

            String posterUrl = s3Service.uploadFile(posterImg);

            Event event = eventService.entry(eventId, eventName, eventDescription, eventStartDate,
                    eventStartTime, eventEndDate, eventEndTime, venue, capacity, posterUrl, clubEmail, approved);

            return ResponseEntity.ok(new ApiResponse("Event created successfully", 200, true, event));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error creating event: " + e.getMessage(), 500, false, null));
        }
    }

}
