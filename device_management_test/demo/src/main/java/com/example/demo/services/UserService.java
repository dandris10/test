package com.example.demo.services;

import com.example.demo.entities.Device;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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


    //Insert a user into the database
    @Transactional
    public User insertUser(User user){
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID id){
        userRepository.deleteById(id);
    }

}
