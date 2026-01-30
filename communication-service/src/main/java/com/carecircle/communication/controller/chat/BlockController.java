package com.carecircle.communication.controller.chat;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.communication.dto.request.BlockUserRequest;
import com.carecircle.communication.service.interfaces.BlockService;

@RestController
@RequestMapping("/blocks")
public class BlockController {

    private final BlockService blockService;

    public BlockController(BlockService blockService) {
        this.blockService = blockService;
    }

    @PostMapping
    public ResponseEntity<Void> blockUser(
            @RequestHeader("X-User-Id") UUID blockerId,
            @RequestBody BlockUserRequest request
    ) {
        blockService.blockUser(blockerId, request.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> unblockUser(
            @RequestHeader("X-User-Id") UUID blockerId,
            @RequestBody BlockUserRequest request
    ) {
        blockService.unblockUser(blockerId, request.getUserId());
        return ResponseEntity.ok().build();
    }
    
    @GetMapping
    public ResponseEntity<Map<String, List<UUID>>> getBlockedUsers(
            @RequestHeader("X-User-Id") UUID blockerId
    ) {
        return ResponseEntity.ok(
                Map.of("blockedUserIds", blockService.getBlockedUsers(blockerId))
        );
    }

}
