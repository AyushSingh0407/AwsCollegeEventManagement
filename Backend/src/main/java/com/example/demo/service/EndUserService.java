package com.example.demo.service;

import com.example.demo.model.EndUser;
import com.example.demo.repository.EndUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EndUserService {

    @Autowired
    private EndUserRepository endUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public EndUser signup(String endUserName, String endUserEmail, String rawPassword) {
        if (endUserRepository.findByEndUserEmail(endUserEmail) != null) {
            throw new RuntimeException("Email already exists!");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        EndUser endUser = new EndUser();
        endUser.setEndUserName(endUserName);   // Correctly set the username
        endUser.setEndUserEmail(endUserEmail); // Correctly set the email
        endUser.setEndUserPassword(encodedPassword);

        return endUserRepository.save(endUser);
    }


    public boolean login(String endUserEmail, String rawPassword) {
        EndUser existingUser = endUserRepository.findByEndUserEmail(endUserEmail);

        if (existingUser == null) {
            throw new RuntimeException("User not found!");
        }

        return passwordEncoder.matches(rawPassword, existingUser.getEndUserPassword());
    }
}
