package com.example.demo.model;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDBTable(tableName = "Club")
public class Club {
    @DynamoDBAttribute(attributeName = "clubName")
    private String clubName;

    @DynamoDBHashKey(attributeName = "clubEmail")
    private String clubEmail;

    @DynamoDBAttribute(attributeName = "clubPassword")
    private String clubPassword;

    @DynamoDBAttribute(attributeName = "clubPhoneNo")
    private String clubPhoneNo;

    @DynamoDBAttribute(attributeName = "clubDescription")
    private String clubDescription;

    @DynamoDBAttribute(attributeName = "clubLogo")
    private String clubLogo;

    @DynamoDBAttribute(attributeName = "events")
    private List<Event> events;

}