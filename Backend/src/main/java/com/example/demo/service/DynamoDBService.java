package com.example.demo.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.example.demo.model.Club;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DynamoDBService {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public void updateClubImageURL(String clubEmail, String imageUrl, String fileName) {
        Club club = dynamoDBMapper.load(Club.class, clubEmail);

        if (club != null) {
            club.setClubLogo(imageUrl);
            dynamoDBMapper.save(club);
        } else {
            throw new RuntimeException("Club not found");
        }
    }
}
