<?php
require_once 'db.php';

function createAuction($artwork_id, $starting_price, $start_time, $end_time, $reserve_price) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO auctions (artwork_id, starting_price, current_bid, start_time, end_time, reserve_price, status) VALUES (?, ?, ?, ?, ?, ?, 'upcoming')");
    return $stmt->execute([$artwork_id, $starting_price, null, $start_time, $end_time, $reserve_price]);
}

function updateAuctionStatus($auction_id, $status) {
    $db = getDB();
    $stmt = $db->prepare("UPDATE auctions SET status = ? WHERE auction_id = ?");
    return $stmt->execute([$status, $auction_id]);
}

function getActiveAuctions() {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM auctions WHERE status = 'live'");
    return $stmt->fetchAll();
}

function getAuctionDetails($auction_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM auctions WHERE auction_id = ?");
    $stmt->execute([$auction_id]);
    return $stmt->fetch();
}

