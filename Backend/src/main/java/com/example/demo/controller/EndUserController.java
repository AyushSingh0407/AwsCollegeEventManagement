package com.example.demo.controller;

import com.example.demo.model.ApiResponse;
import com.example.demo.model.EndUser;
import com.example.demo.model.Event;
import com.example.demo.repository.EndUserRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.sesv2.model.Template;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enduser")
public class EndUserController {

    @Autowired
    private EndUserService endUserService;

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EndUserRepository endUserRepository;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private EventRepository eventRepository;

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
            token = token.substring(7);

            String userEmail = jwtService.extractUsername(token);

            EndUser user = endUserRepository.findByEndUserEmail(userEmail);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            List<Event> approvedEvents = eventService.getApprovedEvents();

            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("username", user.getEndUserName());
            userDetails.put("email", user.getEndUserEmail());
            userDetails.put("approvedEvents", approvedEvents);

            return ResponseEntity.ok(userDetails);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/approvedevent")
    public ResponseEntity<List<Event>> getApprovedEvents() {
        List<Event> approvedEvents = eventService.getApprovedEvents();
        return ResponseEntity.ok(approvedEvents);
    }

    @GetMapping("/registeredevent")
    public ResponseEntity<List<Event>> getRegisteredEvents(@RequestHeader("Authorization") String token) {
        try {
            token = token.substring(7);

            String userEmail = jwtService.extractUsername(token);

            EndUser user = endUserRepository.findByEndUserEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            List<Event> registeredEvents = eventService.getRegisteredEvent(user.getEndUserEmail());

            return ResponseEntity.ok(registeredEvents);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/registernewevent")
    public ResponseEntity<String> registerEvent(@RequestHeader("Authorization") String token, @RequestBody String eventId){
        try{
            token = token.substring(7);

            String userEmail = jwtService.extractUsername(token);

            EndUser user = endUserRepository.findByEndUserEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            //Check if already registered to the event or not
            Event event = eventRepository.findEventByEventId(eventId);

            if(user.getRegisteredEvent() != null && user.getRegisteredEvent().contains(event.getEventId())){
                return new ResponseEntity<>("Already registered to the event", HttpStatus.CONFLICT);
            }

            //check if event is full or not
            if(event.getRegistration() == event.getCapacity()){
                return new ResponseEntity<>("Event capacity full", HttpStatus.CONFLICT);
            }

            //Default email of Sender
            String sender = "divyanshukm18@gmail.com";
            //Email template name
            String templateName = "EventRegistrationTemplateWithPoster";

            Template myTemplate = Template.builder()
                    .templateName(templateName)
                    .templateData("{\n" +
                            "  \"name\": \"" + user.getEndUserName() + "\",\n" +
                            "  \"event_name\": \""+ event.getEventName() +"\",\n" +
                            "  \"organiser\": \""+ event.getClubEmail().split("@")[0] +"\",\n" +
                            "  \"description\": \""+ event.getEventDescription() +"\",\n" +
                            "  \"start_date\": \""+ event.getEventStartDate() +"\",\n" +
                            "  \"start_time\": \""+ event.getEventStartTime() +"\",\n" +
                            "  \"end_date\": \""+ event.getEventEndDate() +"\",\n" +
                            "  \"end_time\": \""+ event.getEventEndTime() +"\",\n" +
                            "  \"venue\": \""+ event.getVenue() +"\",\n" +
                            "  \"poster_url\": \""+ event.getPosterUrl() +"\"\n" +
                            "}")
                    .build();

            //Sending email
            try{
                emailTemplateService.send(sender, userEmail, templateName, myTemplate);
            }
            catch (Exception e){
                return new ResponseEntity<>("Error in sending mail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }

            //change the registration count
            try{
                List<EndUser> registeredUsers = event.getRegisteredUser();
                List<String> registeredEvents = user.getRegisteredEvent();
                if(registeredUsers == null){
                    registeredUsers = new ArrayList<>();
                }
                if(registeredEvents == null){
                    registeredEvents = new ArrayList<>();
                }
                registeredEvents.add(event.getEventId());
                user.setRegisteredEvent(registeredEvents);
                endUserRepository.save(user);

                registeredUsers.add(user);
                event.setRegisteredUser(registeredUsers);
                event.setRegistration(event.getRegistration()+1);
                eventRepository.save(event);
            }
            catch (Exception e){
                return new ResponseEntity<>("Error in updating event registrations"+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return new ResponseEntity<>("Registered successfully to event: "+eventId, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


}