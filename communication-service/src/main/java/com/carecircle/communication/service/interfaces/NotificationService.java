package com.carecircle.communication.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.carecircle.communication.model.notification.Notification;

public interface NotificationService {

    void createNotification(UUID userId, String type, String content);

    void markAsRead(UUID notificationId);
    
    List<Notification> getUserNotifications(UUID userId);

    void markAsRead(UUID notificationId, UUID userId);
}
