package com.carecircle.email_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.email_service.dto.WelcomeEmailRequest;
import com.carecircle.email_service.service.EmailSenderService;

@RestController
@RequestMapping("/api/email")
public class EmailController {


    @Autowired
    private EmailSenderService emailSenderService;

    @PostMapping("/welcome")
    public ResponseEntity<String> sendWelcomeEmail(
            @RequestBody WelcomeEmailRequest request) {

        emailSenderService.sendWelcomeMail(
                request.getEmail(),
                request.getName(),
                request.getRole()
        );

        return ResponseEntity.ok("Welcome email sent");
    }
    
    @PostMapping("/sendOtp")
    public ResponseEntity<String> sendotp(
            @RequestBody WelcomeEmailRequest request) {

        String otp = emailSenderService.sendOtpMail(
                request.getEmail(), request.getRole()
        );

        return ResponseEntity.ok("Otp is sent successfully");
    }
}

