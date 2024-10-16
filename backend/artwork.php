<?php
require_once 'db.php';

function addArtwork($title, $description, $category, $image_url, $price, $dimensions, $medium, $year, $artist_id) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO artwork (title, description, category, image_url, price, dimensions, medium, year, artist_id, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'for sale')");
    return $stmt->execute([$title, $description, $category, $image_url, $price, $dimensions, $medium, $year, $artist_id]);
}

function updateArtwork($artwork_id, $title, $description, $price) {
    $db = getDB();
    $stmt = $db->prepare("UPDATE artwork SET title = ?, description = ?, price = ? WHERE artwork_id = ?");
    return $stmt->execute([$title, $description, $price, $artwork_id]);
}

function deleteArtwork($artwork_id) {
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM artwork WHERE artwork_id = ?");
    return $stmt->execute([$artwork_id]);
}

function getAllArtworks() {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM artwork");
    return $stmt->fetchAll();
}

?>
