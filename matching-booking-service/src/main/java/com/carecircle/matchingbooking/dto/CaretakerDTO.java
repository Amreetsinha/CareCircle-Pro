package com.carecircle.matchingbooking.dto;

import java.time.LocalTime;

public class CaretakerDTO {
    private Long id;
    private String userEmail;
    private String fullName;
    private String city;
    private String skills;
    private LocalTime availableFrom;
    private LocalTime availableTo;

    public CaretakerDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public LocalTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }
    public LocalTime getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
}
