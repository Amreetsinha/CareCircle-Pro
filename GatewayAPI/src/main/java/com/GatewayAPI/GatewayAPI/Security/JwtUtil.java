package com.GatewayAPI.GatewayAPI.Security;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

/*
 * Utility class for parsing and validating JWT tokens. 
 * No request filtering logic is handled here. 
 */


@Component
public class JwtUtil {

	private final JwtProperties jwtProperties; 
	
	private final Key signingKey;
	
	public JwtUtil(JwtProperties jwtProperties) {
		
		this.jwtProperties = jwtProperties; 
		
		this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes()); 
	}
	
	/*
	 * Extracts claims from a JWT token. 
	 * 
	 * @param token JWT token string 
	 * 
	 * @Param parsed JWT claims
	 * 
	 */
	
	public Claims extractClaims(String token) {
		
		return Jwts.parserBuilder()
				.setSigningKey(signingKey)
				.build()
				.parseClaimsJws(token)
				.getBody(); 
	}
}


