package com.example.authentification.Controller;

import com.example.authentification.Entity.Role;
import com.example.authentification.Entity.User;
import com.example.authentification.Model.LoginCreds;
import com.example.authentification.Repository.UserRepository;
import com.example.authentification.Security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, Object> registerHandler(@RequestBody User user) {
        System.out.println(user.getUsername());
        System.out.println(user.getPassword());

        String encodedPass = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPass);
        user.setRole(Role.ROLE_USER);
        user = userRepo.save(user);

        String token = jwtUtil.generateToken(user.getUsername(),user.getId(),user.getRole().name());
        return Collections.singletonMap("token", token);
    }

    @PostMapping("/login")
    public Map<String, Object> loginHandler(@RequestBody LoginCreds body) {
        try {
            UsernamePasswordAuthenticationToken authInputToken =
                    new UsernamePasswordAuthenticationToken(body.getUsername(), body.getPassword());
            authenticationManager.authenticate(authInputToken);

            User user = userRepo.findByUsername(body.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(body.getUsername(), user.getId(),user.getRole().name());
            return Collections.singletonMap("token", token);
        } catch (AuthenticationException authExc) {
            throw new RuntimeException("Invalid username/password.");
        }
    }
}
