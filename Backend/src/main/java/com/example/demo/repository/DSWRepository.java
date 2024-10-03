package com.example.demo.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.example.demo.model.DSW;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DSWRepository {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public DSW save(DSW dsw){
        dynamoDBMapper.save(dsw);
        return dsw;
    }

    public DSW findByDswCollegeEmail(String dswEmail){
        return dynamoDBMapper.load(DSW.class, dswEmail);
    }
    public String update(String dswEmail, DSW dsw){
        dynamoDBMapper.save(dsw,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("dswEmail",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(dswEmail)
                                )));
        return dswEmail;
    }
}
