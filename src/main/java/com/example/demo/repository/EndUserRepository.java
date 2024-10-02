package com.example.demo.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.example.demo.model.EndUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class EndUserRepository {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public EndUser save(EndUser endUser){
        dynamoDBMapper.save(endUser);
        return endUser;
    }

    public EndUser findByEndUserEmail(String endUserEmail){
        return dynamoDBMapper.load(EndUser.class, endUserEmail);
    }

    public String delete(String endUserId){
        EndUser endUser = dynamoDBMapper.load(EndUser.class, endUserId);
        dynamoDBMapper.delete(endUser);
        return "EndUser Deleted";
    }

    public String update(String endUserId, EndUser endUser){
        dynamoDBMapper.save(endUser,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("endUserId",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(endUserId)
                                )));
        return endUserId;
    }
}