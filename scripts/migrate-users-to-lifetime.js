/**
 * Migration script to upgrade all existing users to Lifetime tier
 * 
 * This script should be run once after deploying the GoCardless integration
 * to ensure existing users get grandfathered into the lifetime plan.
 * 
 * Usage:
 * 1. Connect to your MongoDB instance
 * 2. Switch to your database: use minihabits
 * 3. Run this script: load("migrate-users-to-lifetime.js")
 * 
 * Or run directly with mongosh:
 * mongosh "mongodb://your-connection-string" --file migrate-users-to-lifetime.js
 */

// Configuration - Update these values for your environment
const DATABASE_NAME = "minihabits"; // Change to your database name
const COLLECTION_NAME = "users";

// Switch to the correct database
use(DATABASE_NAME);

// Migration script
function migrateUsersToLifetime() {
  print("Starting migration: Upgrading existing users to Lifetime tier...");
  
  const startTime = new Date();
  
  try {
    // Find all users who don't have subscription fields or are on free tier
    const usersToUpdate = db[COLLECTION_NAME].find({
      $or: [
        { subscriptionTier: { $exists: false } },
        { subscriptionTier: "free" },
        { subscriptionTier: null }
      ]
    });
    
    const userCount = usersToUpdate.count();
    print(`Found ${userCount} users to migrate`);
    
    if (userCount === 0) {
      print("No users need migration. All users already have subscription tiers assigned.");
      return;
    }
    
    // Update all existing users to lifetime tier
    const updateResult = db[COLLECTION_NAME].updateMany(
      {
        $or: [
          { subscriptionTier: { $exists: false } },
          { subscriptionTier: "free" },
          { subscriptionTier: null }
        ]
      },
      {
        $set: {
          subscriptionTier: "lifetime",
          subscriptionStatus: "active",
          subscriptionStartDate: new Date(),
          subscriptionEndDate: null, // Lifetime has no end date
          habitLimit: 999999, // Unlimited habits for lifetime users
          // Note: We don't set GoCardless IDs since these are grandfathered users
          goCardlessCustomerId: null,
          goCardlessSubscriptionId: null
        }
      }
    );
    
    print(`Migration completed successfully!`);
    print(`Users updated: ${updateResult.modifiedCount}`);
    print(`Users matched: ${updateResult.matchedCount}`);
    
    // Verify the migration
    const lifetimeUsers = db[COLLECTION_NAME].countDocuments({
      subscriptionTier: "lifetime"
    });
    
    print(`Total lifetime users after migration: ${lifetimeUsers}`);
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    print(`Migration completed in ${duration} seconds`);
    
  } catch (error) {
    print(`Migration failed with error: ${error.message}`);
    print("Please check your database connection and try again.");
  }
}

// Add users who somehow don't have habitLimit field
function ensureHabitLimit() {
  print("Ensuring all users have habitLimit field...");
  
  const result = db[COLLECTION_NAME].updateMany(
    { habitLimit: { $exists: false } },
    {
      $set: {
        habitLimit: function() {
          // This won't work in updateMany, so we'll use a separate query
          return this.subscriptionTier === "free" ? 3 : 999999;
        }
      }
    }
  );
  
  // Fix habitLimit for users without it
  const freeUsers = db[COLLECTION_NAME].updateMany(
    { 
      habitLimit: { $exists: false },
      subscriptionTier: "free"
    },
    { $set: { habitLimit: 3 } }
  );
  
  const premiumUsers = db[COLLECTION_NAME].updateMany(
    { 
      habitLimit: { $exists: false },
      subscriptionTier: { $in: ["monthly", "yearly", "lifetime"] }
    },
    { $set: { habitLimit: 999999 } }
  );
  
  print(`Updated habitLimit for ${freeUsers.modifiedCount} free users`);
  print(`Updated habitLimit for ${premiumUsers.modifiedCount} premium users`);
}

// Run the migration
print("=".repeat(60));
print("MiniHabits User Migration Script");
print("Upgrading existing users to Lifetime tier");
print("=".repeat(60));

migrateUsersToLifetime();
ensureHabitLimit();

print("=".repeat(60));
print("Migration script completed!");
print("=".repeat(60));

// Optional: Show a summary of all subscription tiers
print("\nSubscription Summary:");
print("--------------------");
const summary = db[COLLECTION_NAME].aggregate([
  {
    $group: {
      _id: "$subscriptionTier",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);

summary.forEach(function(tier) {
  print(`${tier._id || 'undefined'}: ${tier.count} users`);
});