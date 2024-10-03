package com.example.demo.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 amazonS3;

    private final String bucketName = "awsclublogo";

    public String uploadFile(MultipartFile file) throws Exception {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Upload file to the specified S3 bucket
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), null));

        // Return the file's URL
        return amazonS3.getUrl(bucketName, fileName).toString();
    }
}
