package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository; // Assuming you have a repository for Event
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/club")
public class ClubController {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/dashboard/{clubEmail}")
    public List<Event> getEventsByClub(@PathVariable String clubEmail) {
        return eventRepository.findByClubEmail(clubEmail);
    }
}
