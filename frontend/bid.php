<?php
include '../backend/db.php'; 

$sql = "SELECT * FROM auctions WHERE end_date > NOW()"; 
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Current Auctions</title>
    <link rel="stylesheet" href="style.css"> 
</head>
<body>
    <header>
        <h1>Current Auctions</h1>
    </header>
    <main>
        <div class="auction-list">
            <?php if ($result->num_rows > 0): ?>
                <?php while ($auction = $result->fetch_assoc()): ?>
                    <div class="auction-item">
                        <h2><?php echo htmlspecialchars($auction['title']); ?></h2>
                        <p><strong>Description:</strong> <?php echo htmlspecialchars($auction['description']); ?></p>
                        <p><strong>Current Bid:</strong> $<?php echo htmlspecialchars($auction['current_bid']); ?></p>
                        <p><strong>End Date:</strong> <?php echo htmlspecialchars($auction['end_date']); ?></p>
                        
                        <!-- Form to place a bid -->
                        <form action="../backend/bid.php" method="POST">
                            <input type="hidden" name="auction_id" value="<?php echo htmlspecialchars($auction['id']); ?>">
                            <label for="bid_amount">Bid Amount:</label>
                            <input type="number" id="bid_amount" name="bid_amount" min="0" required>
                            <button type="submit">Place Bid</button>
                        </form>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <p>No current auctions available.</p>
            <?php endif; ?>
        </div>
    </main>
    <footer>
        <p>&copy; 2024 Art Auction. All rights reserved.</p>
    </footer>
</body>
</html>

<?php
$conn->close(); 
