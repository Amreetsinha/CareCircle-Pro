package com.carecircle.email_service.service;

public interface EmailSenderService {
	
	
	public void sendWelcomeMail(String to, String name, String role);
	
	public String sendOtpMail(String emailReceiver, String role); 

}
