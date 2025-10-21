package com.nextskill.controller;

import com.nextskill.dto.AuthRequest;
import com.nextskill.dto.AuthResponse;
import com.nextskill.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest req) {
        return ResponseEntity.ok().body(authService.signup(req));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody AuthRequest req) {
        return ResponseEntity.ok().body(authService.signin(req));
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validate() {
        // This endpoint requires authentication, so if we reach here, token is valid
        return ResponseEntity.ok("Token is valid");
    }
}
