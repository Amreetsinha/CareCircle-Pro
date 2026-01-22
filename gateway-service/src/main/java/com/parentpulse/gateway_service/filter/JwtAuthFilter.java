package com.parentpulse.gateway_service.filter;

import com.parentpulse.gateway_service.security.JwtUtil;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

	private final JwtUtil jwtUtil;

	public JwtAuthFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

	    String path = exchange.getRequest().getURI().getPath();

	    // ===== PUBLIC ENDPOINTS (NO JWT, NO ROLE CHECK) =====
	    if (
	        path.equals("/register") ||
	        path.equals("/login") ||
	        path.startsWith("/auth/") ||
	        path.startsWith("/actuator/")
	    ) {
	        return chain.filter(exchange);
	    }

	    // ===== JWT REQUIRED =====
	    String authHeader = exchange.getRequest()
	            .getHeaders()
	            .getFirst(HttpHeaders.AUTHORIZATION);

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
	        return exchange.getResponse().setComplete();
	    }

	    String token = authHeader.substring(7);

	    Claims claims;
	    try {
	        claims = jwtUtil.validateAndExtractClaims(token);
	    } catch (Exception e) {
	        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
	        return exchange.getResponse().setComplete();
	    }

	    String role = claims.get("role", String.class);

	    // ===== ROLE-BASED AUTHORIZATION =====
	    if (!isAuthorized(path, role)) {
	        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
	        return exchange.getResponse().setComplete();
	    }

	    // ===== FORWARD TRUSTED HEADERS =====
	    exchange = exchange.mutate()
	            .request(builder -> builder
	                    .header("X-User-Email", claims.getSubject())
	                    .header("X-User-Role", role)
	            )
	            .build();

	    return chain.filter(exchange);
	}
	
	private boolean isAuthorized(String path, String role) {

	    if (path.startsWith("/admin/")) {
	        return "ROLE_ADMIN".equals(role);
	    }

	    if (path.startsWith("/provider/")) {
	        return "ROLE_PROVIDER".equals(role);
	    }

	    if (path.startsWith("/parent/")) {
	        return "ROLE_PARENT".equals(role);
	    }

	    return true;
	}

}
