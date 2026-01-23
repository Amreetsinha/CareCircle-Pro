package com.carecircle.user_profile_service.child.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a child.
 *
 * Parent ownership is derived from authenticated user context.
 */

public class CreateChildRequest {

    @NotBlank(message = "Child name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be zero or greater")
    private Integer age;

    private String gender;
    private String specialNeeds;

    public CreateChildRequest() {
        // For JSON deserialization
    }

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getSpecialNeeds() {
        return specialNeeds;
    }
}


