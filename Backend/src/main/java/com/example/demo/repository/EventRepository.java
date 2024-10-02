package com.example.demo.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.example.demo.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EventRepository {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public List<Event> findAllEvents() {
        return dynamoDBMapper.scan(Event.class, new DynamoDBScanExpression());
    }

    public List<Event> findByClubEmail(String clubEmail) {
        DynamoDBQueryExpression<Event> queryExpression = new DynamoDBQueryExpression<Event>()
                .withHashKeyValues(new Event(clubEmail))
                .withFilterExpression("clubEmail = :clubEmail")
                .addExpressionAttributeValuesEntry(":clubEmail", new AttributeValue().withS(clubEmail));

        return dynamoDBMapper.query(Event.class, queryExpression);
    }
}
