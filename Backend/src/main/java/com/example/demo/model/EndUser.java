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
@DynamoDBTable(tableName = "EndUser")
public class EndUser {

    @DynamoDBHashKey(attributeName = "endUserEmail")
    private String endUserEmail;

    @DynamoDBAttribute(attributeName = "endUserName")
    private String endUserName;

    @DynamoDBAttribute(attributeName = "endUserPassword")
    private String endUserPassword;

//    @DynamoDBAttribute(attributeName = "registeredEvent")
//    private List<Event> registeredEvent;

    @DynamoDBAttribute(attributeName = "registeredEvent")
    private List<String> registeredEvent;
}
