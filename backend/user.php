<?php
// user.php
require_once 'db.php';

function registerUser($username, $email, $password) {
    $db = getDB();
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $db->prepare("INSERT INTO users (username, email, password_hash, created_at, verified) VALUES (?, ?, ?, NOW(), 0)");
    return $stmt->execute([$username, $email, $password_hash]);
}

function loginUser($email, $password) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        return $user;
    }
    
    return false; // Invalid credentials
}

function verifyUser($user_id) {
    $db = getDB();
    $stmt = $db->prepare("UPDATE users SET verified = 1 WHERE user_id = ?");
    return $stmt->execute([$user_id]);
}

function getUserById($user_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    return $stmt->fetch();
}

// Additional user functions can be added here.
?>
