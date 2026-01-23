# User Profile Service

## Purpose
Manages domain-level user profiles for CareCircle Pro.

Supports:
- Parent profiles
- Provider (nanny/caregiver) profiles
- Admin profiles

## Responsibilities
- Store extended user profile data
- Manage children and care requirements
- Handle verification status and skills

## What this service does NOT do
- Authentication
- Authorization
- JWT validation

## Security Model
This service trusts headers injected by the API Gateway:
- X-User-Email
- X-User-Role

## Tech Stack
- Java 21
- Spring Boot 3.x
- Spring Data JPA
