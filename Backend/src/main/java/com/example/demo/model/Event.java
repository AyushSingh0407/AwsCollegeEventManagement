package com.example.demo.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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
    private String eventStartDate;

    @DynamoDBAttribute(attributeName = "eventStartTime")
    private String eventStartTime;

    @DynamoDBAttribute(attributeName = "eventEndDate")
    private String eventEndDate;

    @DynamoDBAttribute(attributeName = "eventEndTime")
    private String eventEndTime;

    @DynamoDBAttribute(attributeName = "venue")
    private String venue;

    @DynamoDBAttribute(attributeName = "capacity")
    private int capacity;

    @DynamoDBAttribute(attributeName = "posterUrl")
    private String posterUrl;

    @DynamoDBAttribute(attributeName = "approved")
    private String approved;

    @DynamoDBAttribute(attributeName = "clubEmail")
    private String clubEmail;
}
