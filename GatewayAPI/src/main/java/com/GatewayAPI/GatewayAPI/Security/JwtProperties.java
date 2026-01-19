package com.GatewayAPI.GatewayAPI.Security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

	//Secret key used to sign and verify JWT tokens 
	private String secret; 
	
	//Token Expiration time(In milliseconds). 
	private long expiration; 
	
	public String getSecret() {
		return secret;
	}
	
	public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
    
	
}
