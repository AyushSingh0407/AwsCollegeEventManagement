package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.service.S3Service;
import com.example.demo.service.DynamoDBService;
import com.example.demo.service.JwtService;

@RestController
@RequestMapping("/club")
public class ClubLogoController {
    @Autowired
    private S3Service s3Service;

    @Autowired
    private DynamoDBService dynamoDBService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.replace("Bearer ", "");
            String clubEmail = jwtService.extractEmail(token);
            String imageUrl = s3Service.uploadFile(file);
            dynamoDBService.updateClubImageURL(clubEmail, imageUrl, file.getOriginalFilename());
            return ResponseEntity.ok("Image uploaded successfully. URL: " + imageUrl);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}