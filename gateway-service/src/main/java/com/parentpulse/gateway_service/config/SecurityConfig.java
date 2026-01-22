package com.parentpulse.gateway_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        System.out.println("✅ Gateway SecurityConfig LOADED (CSRF DISABLED)");

        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)   // 🔥 THIS WAS MISSING
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/auth/**", "/actuator/**").permitAll()
                .anyExchange().authenticated()
            )
            .build();
    }
}
