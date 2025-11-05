package com.example.authentification.Controller;

import com.example.authentification.Entity.Role;
import com.example.authentification.Entity.User;
import com.example.authentification.Repository.UserRepository;
import com.example.authentification.Security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping("/admin")
    public ResponseEntity<Void> verifyAdmin(
            @CookieValue(value = "value", required = false) String cookieToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        System.out.println("Verifying ADMIN access");
        System.out.println("Cookie token: " + (cookieToken != null ? "Present" : "Not found"));
        System.out.println("Authorization header: " + (authHeader != null ? "Present" : "Not found"));

        String token = extractToken(authHeader, cookieToken);

        if (token == null || token.isEmpty()) {
            System.out.println("No token provided - Returning 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String username = jwtUtil.validateTokenAndRetrieveSubject(token);
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != Role.ROLE_ADMIN) {
                System.out.println("User '" + username + "' is not admin (role: " + user.getRole() + ") - Returning 403");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            System.out.println("Admin user '" + username + "' authorized - Returning 200");
            return ResponseEntity.ok()
                    .header("X-User-Role", user.getRole().name())
                    .header("X-User-Id", user.getId().toString())
                    .build();

        } catch (Exception e) {
            System.out.println("Invalid token - Returning 401: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<Void> verifyUser(
            @CookieValue(value = "value", required = false) String cookieToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        System.out.println("Verifying USER access");
        System.out.println("Cookie token: " + (cookieToken != null ? "Present" : "Not found"));
        System.out.println("Authorization header: " + (authHeader != null ? "Present" : "Not found"));

        String token = extractToken(authHeader, cookieToken);

        if (token == null || token.isEmpty()) {
            System.out.println("No token provided - Returning 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String username = jwtUtil.validateTokenAndRetrieveSubject(token);
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("User '" + username + "' (role: " + user.getRole() + ") authorized - Returning 200");
            return ResponseEntity.ok()
                    .header("X-User-Role", user.getRole().name())
                    .header("X-User-Id", user.getId().toString())
                    .build();
        } catch (Exception e) {
            System.out.println("Invalid token - Returning 401: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private String extractToken(String authHeader, String cookieToken) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            System.out.println("Token extracted from Authorization header");
            return authHeader.substring(7);
        }

        if (cookieToken != null && !cookieToken.isEmpty()) {
            System.out.println("Token extracted from Cookie");
            return cookieToken;
        }

        return null;
    }
}