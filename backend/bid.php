<?php
// bid.php
require_once 'db.php';

function placeBid($auction_id, $bidder_id, $bid_amount) {
    $db = getDB();
    
    // Update the current bid in the auctions table
    $stmt = $db->prepare("UPDATE auctions SET current_bid = ?, winner_id = ? WHERE auction_id = ?");
    $stmt->execute([$bid_amount, $bidder_id, $auction_id]);
    
    // Insert the bid into the bids table
    $stmt = $db->prepare("INSERT INTO bids (auction_id, bidder_id, bid_amount, bid_time) VALUES (?, ?, ?, NOW())");
    return $stmt->execute([$auction_id, $bidder_id, $bid_amount]);
}

function getBidsForAuction($auction_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM bids WHERE auction_id = ?");
    $stmt->execute([$auction_id]);
    return $stmt->fetchAll();
}

