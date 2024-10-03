package com.example.demo.service;

import com.example.demo.model.DSW;
import com.example.demo.model.EndUser;
import com.example.demo.repository.DSWRepository;
import com.example.demo.repository.EndUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DSWService {
    @Autowired
    private DSWRepository dswRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public DSW signup(String dswMobileNo, String dswCollegeEmail, String rawPassword) {
        if (dswRepository.findByDswCollegeEmail(dswCollegeEmail) != null) {
            throw new RuntimeException("Email already exists!");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        DSW dsw = new DSW();
        dsw.setDswMobileNo(dswMobileNo);
        dsw.setDswCollegeEmail(dswCollegeEmail);
        dsw.setDswPassword(encodedPassword);

        return dswRepository.save(dsw);
    }


    public boolean login(String dswCollegeEmail, String rawPassword) {
        DSW existingUser = dswRepository.findByDswCollegeEmail(dswCollegeEmail);

        if (existingUser == null) {
            throw new RuntimeException("DSW not found!");
        }

        return passwordEncoder.matches(rawPassword, existingUser.getDswPassword());
    }
}
