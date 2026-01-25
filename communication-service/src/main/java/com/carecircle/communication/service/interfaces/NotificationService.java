package com.carecircle.communication.service.interfaces;

import java.util.UUID;

public interface NotificationService {

    void createNotification(UUID userId, String type, String content);

    void markAsRead(UUID notificationId);
}
