<?php
require_once 'db.php';

function addReview($artwork_id, $reviewer_id, $rating, $comment) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO reviews (artwork_id, reviewer_id, rating, comment, review_date) VALUES (?, ?, ?, ?, NOW())");
    return $stmt->execute([$artwork_id, $reviewer_id, $rating, $comment]);
}

function getReviewsForArtwork($artwork_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM reviews WHERE artwork_id = ?");
    $stmt->execute([$artwork_id]);
    return $stmt->fetchAll();
}

