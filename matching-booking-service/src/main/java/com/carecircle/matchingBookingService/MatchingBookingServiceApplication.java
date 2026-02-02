package com.carecircle.matchingBookingService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MatchingBookingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MatchingBookingServiceApplication.class, args);
	}

}
