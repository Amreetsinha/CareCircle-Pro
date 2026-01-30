package com.carecircle.email_service.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.carecircle.email_service.service.EmailSenderService;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {
	
	  @Autowired
	    private JavaMailSender mailSender;
	  	
	    @Override
	    public void sendWelcomeMail(String to, String name, String role) {

	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(to);
	        message.setSubject("Welcome to CareCircle 🎉");

	        String body = "Hi " + name + ",\n\n"
	                + "Welcome to CareCircle!\n"
	                + "Your role: " + role + "\n\n"
	                + "We’re excited to have you with us.\n\n"
	                + "Regards,\n"
	                + "CareCircle Team";

	        message.setText(body);

	        mailSender.send(message);
	    }

		@Override
		public String sendOtpMail(String emailReceiver, String role) {
			SimpleMailMessage message = new SimpleMailMessage();
			 message.setTo(emailReceiver); 
			 message.setSubject("CareCircle OTP");
			 
			 String otp = "";
			 String body = "Hi " + ",\n\n"
		                + "Welcome to CareCircle! for the"+role+"\n"
		                + "Your Otp " + otp + "\n\n"
		                + "We’re excited to have you with us.\n\n"
		                + "Regards,\n"
		                + "CareCircle Team";
			 
			 message.setText(body);

		     mailSender.send(message);
			 
			 return otp;
		}

}
