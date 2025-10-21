package com.nextskill.service;

import com.nextskill.dto.AuthRequest;
import com.nextskill.dto.AuthResponse;
import com.nextskill.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse signup(AuthRequest req) {
        User user = userService.register(req.getEmail(), req.getPassword());
        String token = jwtService.generateToken(userService.loadUserByUsername(user.getEmail()));
        return new AuthResponse(token);
    }

    public AuthResponse signin(AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtService.generateToken((org.springframework.security.core.userdetails.User) auth.getPrincipal());
        return new AuthResponse(token);
    }
}
