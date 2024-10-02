package com.example.demo.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDBTable(tableName = "Event")
public class Event {

    @DynamoDBHashKey(attributeName = "eventId")
    private String eventId;

    @DynamoDBAttribute(attributeName = "eventName")
    private String eventName;

    @DynamoDBAttribute(attributeName = "eventDescription")
    private String eventDescription;

    @DynamoDBAttribute(attributeName = "eventStartDate")
    private Date eventStartDate;

    @DynamoDBAttribute(attributeName = "eventStartTime")
    private Date eventStartTime;

    @DynamoDBAttribute(attributeName = "eventEndDate")
    private Date eventEndDate;

    @DynamoDBAttribute(attributeName = "eventEndTime")
    private Date eventEndTime;

    @DynamoDBAttribute(attributeName = "venue")
    private String venue;

    @DynamoDBAttribute(attributeName = "capacity")
    private int capacity;

    @DynamoDBAttribute(attributeName = "registrations")
    private int registrations;

    @DynamoDBAttribute(attributeName = "status")
    private String status;  // approved, pending, rejected, completed

    @DynamoDBAttribute(attributeName = "posterImg")
    private String posterImg;

    @DynamoDBAttribute(attributeName = "registeredEndUsers")
    private List<String> registeredEndUsers;

    // Foreign key to link the event to the club
    @DynamoDBAttribute(attributeName = "clubEmail")
    private String clubEmail;  // Reference to Club's email

    public Event(String clubEmail) {
        this.clubEmail = clubEmail;
    }

}
