package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.entities.UserDeviceDTO;
import com.example.demo.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Get all users in the database
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }


    @Transactional
    public User insertUser(User user){

        User savedUser = userRepository.save(user);


        RestTemplate restTemplate = new RestTemplate();
        UserDeviceDTO userDeviceDTO = new UserDeviceDTO(savedUser.getId());

        System.out.println("UserDTO:" + userDeviceDTO.getId());

        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://device-management-app:8081/users",
                userDeviceDTO,
                String.class
        );


        if (!response.getStatusCode().is2xxSuccessful()) {
            System.out.println("User not created in device management or User not created in authorization");
            throw new RuntimeException("Device management creation failed or authorization creation failed");
        }

        return savedUser;
    }

    //Delete a user from the database
    @Transactional
    public void deleteUserById(UUID id){
        RestTemplate restTemplate = new RestTemplate();

        String URL = "http://device-management-app:8081/users/" + id;
        ResponseEntity<String> response = restTemplate.exchange(
                URL,
                HttpMethod.DELETE,
                null,
                String.class
        );

        userRepository.deleteById(id);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }


    //Check if a user exists in the database
    public Optional<User> getUserById(UUID id){
        return userRepository.findById(id);
    }

}
