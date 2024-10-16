<?php
require_once 'db.php';

function createTransaction($buyer_id, $artwork_id, $amount, $payment_method) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO transactions (buyer_id, artwork_id, amount, payment_method, transaction_date, status) VALUES (?, ?, ?, ?, NOW(), 'completed')");
    return $stmt->execute([$buyer_id, $artwork_id, $amount, $payment_method]);
}

function getTransactionsForUser($user_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM transactions WHERE buyer_id = ?");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

