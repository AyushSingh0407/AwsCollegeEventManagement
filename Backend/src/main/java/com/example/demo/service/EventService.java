package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Date;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private S3Service s3Service;

    public Event entry(String eventId, String eventName, String eventDescription,
                       String eventStartDate, String eventStartTime, String eventEndDate,
                       String eventEndTime, String venue, int capacity,
                       String posterUrl, String clubEmail, String approved, int registration) throws Exception {

        Event existingEvent = eventRepository.findEventByEventId(eventId);

        if (existingEvent != null) {
            return null;
        } else {
            Event newEvent = new Event();
            newEvent.setEventId(eventId);
            newEvent.setEventName(eventName);
            newEvent.setEventDescription(eventDescription);
            newEvent.setEventStartDate(eventStartDate);
            newEvent.setEventStartTime(eventStartTime);
            newEvent.setEventEndDate(eventEndDate);
            newEvent.setEventEndTime(eventEndTime);
            newEvent.setVenue(venue);
            newEvent.setCapacity(capacity);
            newEvent.setPosterUrl(posterUrl);
            newEvent.setClubEmail(clubEmail);
            newEvent.setApproved(approved);
            newEvent.setRegistration(0);

            return eventRepository.save(newEvent);
        }
    }

    public List<Event> getPendingApprovalEvents() {
        return eventRepository.findPendingApprovalEvents();
    }

    public List<Event> getApprovedEvents() {
        return eventRepository.findApprovedEvents();
    }

    public List<Event> getRegisteredEvent(String endUserEmail){return eventRepository.findRegisteredEvent(endUserEmail);}

}
