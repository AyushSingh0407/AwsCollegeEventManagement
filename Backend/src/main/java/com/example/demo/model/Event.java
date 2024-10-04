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

    @DynamoDBAttribute(attributeName = "posterUrl")
    private String posterUrl;

    @DynamoDBAttribute(attributeName = "approved")
    private boolean approved;

    @DynamoDBAttribute(attributeName = "clubEmail")
    private String clubEmail;
}
