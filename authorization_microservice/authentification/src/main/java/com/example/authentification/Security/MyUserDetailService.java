package com.example.authentification.Security;

import com.example.authentification.Entity.User;
import com.example.authentification.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;

@Component
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userRes = userRepo.findByUsername(username);

        if (userRes.isEmpty()) {
            throw new UsernameNotFoundException("No user found with username: " + username);
        }

        User user = userRes.get();

        // Convert the user's role to a GrantedAuthority
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().toString());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
