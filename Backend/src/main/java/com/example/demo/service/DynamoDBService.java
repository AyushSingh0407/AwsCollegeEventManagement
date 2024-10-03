package com.example.demo.service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DynamoDBService {

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    public void saveImageMetadata(String imageUrl, String imageName, long uploadTime) {
        DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
        Table table = dynamoDB.getTable("ImageMetadata");

        Item item = new Item()
                .withPrimaryKey("ImageId", System.currentTimeMillis())
                .withString("ImageUrl", imageUrl)
                .withString("ImageName", imageName)
                .withLong("UploadTime", uploadTime);

        table.putItem(item);
    }
}
