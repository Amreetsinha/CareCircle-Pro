package com.carecircle.communication.service.impl;

import com.carecircle.communication.model.notification.Notification;
import com.carecircle.communication.model.notification.NotificationType;
import com.carecircle.communication.repository.notification.NotificationRepository;
import com.carecircle.communication.service.interfaces.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void createNotification(UUID userId, String type, String content) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.valueOf(type));
        notification.setContent(content);

        notificationRepository.save(notification);
    }

    @Override
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}

