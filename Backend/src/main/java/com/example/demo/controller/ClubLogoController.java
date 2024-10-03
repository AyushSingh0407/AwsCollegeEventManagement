package com.example.demo.controller;

import com.example.demo.model.ImageUploadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.service.S3Service;
import com.example.demo.service.DynamoDBService;

public class ClubLogoController {
    @Autowired
    private S3Service s3Service;

    @Autowired
    private DynamoDBService dynamoDBService;

    @PostMapping("/uploadImage")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {

            String imageUrl = s3Service.uploadFile(file);

            dynamoDBService.saveImageMetadata(imageUrl, file.getOriginalFilename(), System.currentTimeMillis());

            ImageUploadResponse response = new ImageUploadResponse(
                    "Image uploaded successfully", imageUrl, System.currentTimeMillis()
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ImageUploadResponse errorResponse = new ImageUploadResponse(
                    "Image upload failed: " + e.getMessage(), null, System.currentTimeMillis()
            );
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}