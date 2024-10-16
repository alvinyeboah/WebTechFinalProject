<?php
require_once 'db.php';

function createGallery($artist_id, $gallery_name, $description) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO galleries (artist_id, gallery_name, description, created_at) VALUES (?, ?, ?, NOW())");
    return $stmt->execute([$artist_id, $gallery_name, $description]);
}

function updateGallery($gallery_id, $gallery_name, $description) {
    $db = getDB();
    $stmt = $db->prepare("UPDATE galleries SET gallery_name = ?, description = ? WHERE gallery_id = ?");
    return $stmt->execute([$gallery_name, $description, $gallery_id]);
}

function deleteGallery($gallery_id) {
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM galleries WHERE gallery_id = ?");
    return $stmt->execute([$gallery_id]);
}

function getGalleriesForArtist($artist_id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM galleries WHERE artist_id = ?");
    $stmt->execute([$artist_id]);
    return $stmt->fetchAll();
}

