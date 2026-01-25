package com.carecircle.communication.controller.chat;

import com.carecircle.communication.dto.request.BlockUserRequest;
import com.carecircle.communication.service.interfaces.BlockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
}
