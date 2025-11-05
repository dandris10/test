package com.example.authentification.Controller;

import com.example.authentification.Entity.User;
import com.example.authentification.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/info")
    public User getUserDetails(){
        String userName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return userRepo.findByUsername(userName).get();
    }
}