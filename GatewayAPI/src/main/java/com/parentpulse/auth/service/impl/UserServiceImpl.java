package com.parentpulse.auth.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.parentpulse.auth.dto.request.LoginRequest;
import com.parentpulse.auth.dto.request.RegisterRequest;
import com.parentpulse.auth.exception.InvalidCredentialsException;
import com.parentpulse.auth.exception.UserAlreadyExistsException;
import com.parentpulse.auth.model.User;
import com.parentpulse.auth.repository.UserRepository;
import com.parentpulse.auth.security.JwtUtil;
import com.parentpulse.auth.service.UserService;

/*
 * Implementation of authentication business logic
 */
@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtUtil jwtUtil;

	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
	}

	@Override
	public User register(RegisterRequest request) {

		// Business rule: email must be unique
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("Email already registered.");
		}

		User user = new User();

		user.setEmail(request.getEmail());

		user.setPassword(passwordEncoder.encode(request.getPassword()));

		user.setRole(request.getRole());

		user.setEnabled(true);

		return userRepository.save(user);
	}

	@Override
	public String loginAndGenerateToken(LoginRequest request) {

	    User user = userRepository.findByEmail(request.getEmail())
	            .filter(User::isEnabled)
	            .orElseThrow(() ->
	                    new InvalidCredentialsException("Invalid email or password"));

	    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        throw new InvalidCredentialsException("Invalid email or password");
	    }

	    return jwtUtil.generateToken(user);
	}

}
