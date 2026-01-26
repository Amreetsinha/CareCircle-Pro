package com.carecircle.auth_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carecircle.auth_service.model.User;
import com.carecircle.auth_service.model.Role;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailAndRole(String email, Role role);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}