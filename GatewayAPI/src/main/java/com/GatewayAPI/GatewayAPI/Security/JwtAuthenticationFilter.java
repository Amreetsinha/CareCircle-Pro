package com.GatewayAPI.GatewayAPI.Security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter{

	private final JwtUtil jwtUtil; 
	
	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		
		this.jwtUtil = jwtUtil; 

	}

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		
		String path = exchange.getRequest().getURI().getPath(); 
		
		//skip JWT validation for authentication endpoints 
		if(path.startsWith("/auth/")) {
			return chain.filter(exchange); 
		}
		
		String authHeader = exchange.getRequest()
				.getHeaders()
				.getFirst(HttpHeaders.AUTHORIZATION); 
		
		// Missing or invalid Authorization header
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
	    }
		
		String token = authHeader.substring(7); 
		
		try {
			
			Claims claims =  jwtUtil.extractClaims(token); 
			
			//Forward user context to downstream services
			exchange = exchange.mutate()
                    .request(builder -> builder
                            .header("X-User-Email", claims.getSubject())
                            .header("X-User-Role", claims.get("role", String.class))
                    )
                    .build();
					
		} catch (Exception ex) {
            // Token is invalid or expired
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
		
		return chain.filter(exchange);
	}
	
	
}
