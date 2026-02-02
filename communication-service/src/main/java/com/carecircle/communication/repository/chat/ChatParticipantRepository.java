package com.carecircle.communication.repository.chat;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.carecircle.communication.model.chat.ChatParticipant;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, UUID> {

	List<ChatParticipant> findByRoomId(UUID roomId);

	List<ChatParticipant> findByUserId(UUID userId);

	boolean existsByRoomIdAndUserId(UUID roomId, UUID userId);

    @Query("SELECT p1.roomId FROM ChatParticipant p1 JOIN ChatParticipant p2 ON p1.roomId = p2.roomId WHERE p1.userId = :userId1 AND p2.userId = :userId2")
    List<UUID> findCommonRoomIds(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);
}