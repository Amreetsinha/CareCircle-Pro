package com.GatewayAPI.GatewayAPI.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class Securityconfig {
	/*
	 * Base Security configuration for API Gateway 
	 * 
	 * - Disable CSRF because the gateway is stateless
	 * - Allows public access only to authenticate endpoints 
	 * - Secures all other routes by default
	 * 
	 * jwt authentication will be added in  a separate step	
	 */

	@Bean
	public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

		return http
				// Disable CSRF because gateway is stateless and uses JWT
				.csrf(ServerHttpSecurity.CsrfSpec::disable).authorizeExchange(exchange -> exchange

						// Public endpoints (authentication service)

						.pathMatchers("/auth/**").permitAll()

						/// All other routes must be authenticated

						.anyExchange().authenticated())
				.build();

	}
	
	
	/*
	 * Security related beans for auth service
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); 
	}
}
