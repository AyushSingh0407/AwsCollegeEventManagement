package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.DSWRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.sesv2.model.Template;

import java.util.List;

@RestController
@RequestMapping("/dsw")
public class DSWController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private DSWService dswService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private DSWRepository dswRepository;

    @Autowired
    TokenBlacklistService tokenBlacklistService;

    @Autowired
    EmailTemplateService emailTemplateService;

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

    @PostMapping("/pendingevent")
    public ResponseEntity<String> approveEvent(@RequestBody String eventId) {
        try {
            Event event = eventRepository.findEventByEventId(eventId);

            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.");
            }

            if ("approved".equals(event.getApproved())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Event is already approved.");
            }

            event.setApproved("approved");
            eventRepository.save(event);

            return ResponseEntity.ok("Event approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving event: " + e.getMessage());
        }
    }

    @PostMapping("/pendingevent/deny")
    public ResponseEntity<String> denyEvent(@RequestBody String eventId) {
        try {
            Event event = eventRepository.findEventByEventId(eventId);

            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.");
            }

            //Cancelling the event by DSW
            if(event.getApproved().equals("approved")){

                List<EndUser> registeredUsers = event.getRegisteredUser();

                //Default email of Sender
                String sender = "divyanshukm18@gmail.com";

                if(registeredUsers != null){
                    //Email template name for users
                    String templateName = "EventCancellationTemplate";

                    //Sending mail to all registered users
                    for(EndUser user : registeredUsers){
                        Template userTemplate = Template.builder()
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
                                        "  \"contact_email\": \""+ event.getClubEmail() +"\"\n" +
                                        "}")
                                .build();

                        //Sending email
                        try{
                            emailTemplateService.send(sender, user.getEndUserEmail(), templateName, userTemplate);
                        }
                        catch (Exception e){
                            return new ResponseEntity<>("Error in sending mail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                }
                

                //Sending mail to Club
                Template clubTemplate = Template.builder()
                        .templateName("EventCancellationClubTemplate")
                        .templateData("{\n" +
                                "  \"club_name\": \""+ event.getClubEmail().split("@")[0] +"\",\n" +
                                "  \"event_name\": \""+ event.getEventName() +"\",\n" +
                                "  \"description\": \""+ event.getEventDescription() +"\",\n" +
                                "  \"requested_capacity\": \""+ event.getCapacity() +"\",\n" +
                                "  \"start_date\": \""+ event.getEventStartDate() +"\",\n" +
                                "  \"start_time\": \""+ event.getEventStartTime() +"\",\n" +
                                "  \"end_date\": \""+ event.getEventEndDate() +"\",\n" +
                                "  \"end_time\": \""+ event.getEventEndTime() +"\",\n" +
                                "  \"venue\": \""+ event.getVenue() +"\",\n" +
                                "  \"contact_email\": \""+ sender +"\"\n" +
                                "}")
                        .build();

                //Sending email
                try{
                    emailTemplateService.send(sender, event.getClubEmail(), "EventCancellationClubTemplate", clubTemplate);
                }
                catch (Exception e){
                    return new ResponseEntity<>("Error in sending mail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            else{
                //Default email of Sender
                String sender = "divyanshukm18@gmail.com";

                //Sending mail to Club for event denial by DSW
                Template clubTemplate = Template.builder()
                        .templateName("EventRejectionTemplate")
                        .templateData("{\n" +
                                "  \"club_name\": \""+ event.getClubEmail().split("@")[0] +"\",\n" +
                                "  \"event_name\": \""+ event.getEventName() +"\",\n" +
                                "  \"description\": \""+ event.getEventDescription() +"\",\n" +
                                "  \"requested_capacity\": \""+ event.getCapacity() +"\",\n" +
                                "  \"start_date\": \""+ event.getEventStartDate() +"\",\n" +
                                "  \"start_time\": \""+ event.getEventStartTime() +"\",\n" +
                                "  \"end_date\": \""+ event.getEventEndDate() +"\",\n" +
                                "  \"end_time\": \""+ event.getEventEndTime() +"\",\n" +
                                "  \"venue\": \""+ event.getVenue() +"\",\n" +
                                "  \"contact_email\": \""+ sender +"\"\n" +
                                "}")
                        .build();

                //Sending email
                try{
                    emailTemplateService.send(sender, event.getClubEmail(), "EventRejectionTemplate", clubTemplate);
                }
                catch (Exception e){
                    return new ResponseEntity<>("Error in sending mail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }


            eventRepository.deleteEvent(event);

            return ResponseEntity.ok("Event denied and deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error denying event: " + e.getMessage());
        }
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