package com.example.demo.service;

import com.example.demo.model.Club;
import com.example.demo.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClubService {
    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Club signup(String clubName, String clubEmail, String rawPassword, String clubPhoneNo, String clubDescription) {
        if (clubRepository.findByClubEmail(clubEmail) != null) {
            throw new RuntimeException("Email already exists!");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        Club club = new Club();
        club.setClubName(clubName);
        club.setClubEmail(clubEmail);
        club.setClubPassword(encodedPassword);
        club.setClubPhoneNo(clubPhoneNo);
        club.setClubDescription(clubDescription);

        return clubRepository.save(club);
    }


    public boolean login(String clubEmail, String rawPassword) {
        Club club = clubRepository.findByClubEmail(clubEmail);

        if (club == null) {
            throw new RuntimeException("User not found!");
        }

        return passwordEncoder.matches(rawPassword, club.getClubPassword());
    }
}