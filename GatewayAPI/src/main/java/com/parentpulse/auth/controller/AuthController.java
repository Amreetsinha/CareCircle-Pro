package com.parentpulse.auth.controller;

import com.parentpulse.auth.dto.request.LoginRequest;
import com.parentpulse.auth.dto.request.RegisterRequest;
import com.parentpulse.auth.dto.response.AuthResponse;
import com.parentpulse.auth.model.User;
import com.parentpulse.auth.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication operations.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    /**
     * Authenticate a user and issue JWT token.
     * (JWT generation will be added in next step)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        User user = userService.login(request);

        // Temporary token placeholder (JWT comes next)
        String temporaryToken = "TEMP_TOKEN";

        return ResponseEntity.ok(new AuthResponse(temporaryToken));
    }
}
