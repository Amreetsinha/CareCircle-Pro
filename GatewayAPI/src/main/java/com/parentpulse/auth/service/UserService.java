package com.parentpulse.auth.service;

import com.parentpulse.auth.dto.request.LoginRequest;
import com.parentpulse.auth.dto.request.RegisterRequest;
import com.parentpulse.auth.model.User;

/**
 * Defines authentication-related business operation.
 */
public interface UserService {
	
	/*
	 * Register a new user. 
	 * 
	 * @param request registration request data
	 * @param created user
	 */
	
	User register(RegisterRequest request); 
	
	/*
	 * Authenticate a user
	 * @param request login request data
	 * @return string with having token
	 */
	String loginAndGenerateToken(LoginRequest request);
}
