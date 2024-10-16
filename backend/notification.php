<?php
require_once 'db.php';

function createNotification($user_id, $message) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO notifications (user_id, message, created_at, read_status) VALUES (?, ?, NOW(), 0)");
    return $stmt->execute([$user_id, $message]);
}

function getNotificationsForUser($user_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

