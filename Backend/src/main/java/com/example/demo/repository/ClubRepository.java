package com.example.demo.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.example.demo.model.Club;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ClubRepository {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public Club save(Club club){
        dynamoDBMapper.save(club);
        return club;
    }

    public Club findByClubEmail(String clubEmail){
        return dynamoDBMapper.load(Club.class, clubEmail);
    }

    public String delete(String clubEmail){
        Club club = dynamoDBMapper.load(Club.class, clubEmail);
        dynamoDBMapper.delete(club);
        return "Club Deleted";
    }

    public String update(String clubEmail, Club club){
        dynamoDBMapper.save(club,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("clubEmail",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(clubEmail)
                                )));
        return clubEmail;
    }

}