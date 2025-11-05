package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://frontend.localhost", allowCredentials = "true")
@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

   @PostMapping
   public ResponseEntity<User> create(@RequestBody User user) {
        User userInserted = userService.insertUser(user);
        return ResponseEntity.ok(userInserted);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id){
        if(userService.getUserById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @Valid @RequestBody User user){
        if(userService.getUserById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }


        user.setId(id);

        User userUpdated = userService.updateUser(user);
        return ResponseEntity.ok(userUpdated);
    }

}
