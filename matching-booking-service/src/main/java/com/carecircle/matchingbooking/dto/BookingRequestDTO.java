package com.carecircle.matchingbooking.dto;

import java.time.LocalDateTime;

public class BookingRequestDTO {
    private String parentEmail;
    private String childName;
    private String caretakerEmail;
    private String city;
    private LocalDateTime slotStart;
    private LocalDateTime slotEnd;

    public BookingRequestDTO() {}

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }
    public String getCaretakerEmail() { return caretakerEmail; }
    public void setCaretakerEmail(String caretakerEmail) { this.caretakerEmail = caretakerEmail; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDateTime getSlotStart() { return slotStart; }
    public void setSlotStart(LocalDateTime slotStart) { this.slotStart = slotStart; }
    public LocalDateTime getSlotEnd() { return slotEnd; }
    public void setSlotEnd(LocalDateTime slotEnd) { this.slotEnd = slotEnd; }
}
