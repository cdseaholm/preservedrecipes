const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[match[1]] = value;
  }
}

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    adminIDs: { type: [String], default: [] },
    creatorID: { type: String, required: true },
    communityMemberIDs: { type: [String], default: [] },
    privacyLevel: {
      type: String,
      enum: ["public", "private", "hidden", "restricted", "passwordProtected"],
      default: "public",
    },
    communityPassword: { type: String, required: false },
    tags: { type: [String], default: [] },
    description: { type: String, required: false },
    postIDs: { type: [String], default: [] },
    recipeIDs: { type: [String], default: [] },
    requestIDs: { type: [String], default: [] },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const seeds = [
  {
    name: "Weeknight Dinners",
    description:
      "Fast, reliable meals for busy evenings: one-pan dinners, 30-minute mains, and smart leftovers.",
    tags: ["weeknight", "quick", "dinner", "family meals"],
  },
  {
    name: "Baking Corner",
    description:
      "A cozy place for breads, cakes, cookies, pies, pastries, and troubleshooting bakes.",
    tags: ["baking", "bread", "dessert", "pastry"],
  },
  {
    name: "Comfort Food Classics",
    description:
      "Share soups, casseroles, stews, nostalgic favorites, and the recipes people ask for again.",
    tags: ["comfort food", "classic", "family recipes", "hearty"],
  },
  {
    name: "Healthy Home Cooking",
    description:
      "Balanced everyday cooking with vegetables, lean proteins, whole grains, and practical meal prep.",
    tags: ["healthy", "meal prep", "vegetables", "balanced"],
  },
  {
    name: "Budget Friendly Meals",
    description:
      "Recipes that stretch ingredients, reduce waste, and feed people well without overspending.",
    tags: ["budget", "pantry", "leftovers", "affordable"],
  },
  {
    name: "Vegetarian & Plant-Based",
    description:
      "Vegetarian, vegan, and plant-forward recipes with satisfying flavor and texture.",
    tags: ["vegetarian", "vegan", "plant based", "meatless"],
  },
  {
    name: "Global Kitchen",
    description:
      "Explore dishes, techniques, spices, and food traditions from around the world.",
    tags: ["global", "international", "spices", "culture"],
  },
  {
    name: "Family Recipe Archive",
    description:
      "Preserve heirloom recipes, handwritten-card classics, holiday dishes, and family food stories.",
    tags: ["family recipes", "heritage", "heirloom", "traditions"],
  },
  {
    name: "Grilling & BBQ",
    description:
      "Smoked, grilled, charred, sauced, and slow-cooked recipes for backyard cooking.",
    tags: ["grilling", "bbq", "smoking", "outdoor cooking"],
  },
  {
    name: "Soups, Stews & Chilis",
    description:
      "Bowls for cold nights, sick days, big batches, and freezer-friendly comfort.",
    tags: ["soup", "stew", "chili", "freezer friendly"],
  },
  {
    name: "Dessert Table",
    description:
      "Sweet recipes for celebrations and small treats: cookies, cakes, bars, puddings, and more.",
    tags: ["dessert", "cookies", "cake", "sweet"],
  },
  {
    name: "Kitchen Questions",
    description:
      "Ask cooking questions, troubleshoot recipes, swap substitutions, and compare techniques.",
    tags: ["questions", "technique", "substitutions", "tips"],
  },
  {
    name: "Meal Prep & Freezer Meals",
    description:
      "Batch cooking, freezer meals, lunch prep, and planning systems that make future-you happy.",
    tags: ["meal prep", "freezer meals", "planning", "batch cooking"],
  },
  {
    name: "Seasonal Cooking",
    description:
      "Recipes organized around farmers markets, gardens, holidays, and what tastes best right now.",
    tags: ["seasonal", "farmers market", "holidays", "garden"],
  },
  {
    name: "Beginner Cooks",
    description:
      "A welcoming space for basic techniques, simple recipes, confidence-building wins, and no-silly-questions help.",
    tags: ["beginner", "basics", "learning", "easy"],
  },
];

async function main() {
  loadLocalEnv();

  const uri = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_USERNAME;
  if (!uri) throw new Error("Missing MONGODB_URI");
  if (!adminEmail) throw new Error("Missing ADMIN_USERNAME");

  const Community =
    mongoose.models.Community || mongoose.model("Community", communitySchema);
  const User = mongoose.models.User || mongoose.model("User", userSchema);

  await mongoose.connect(uri);

  const admin = await User.findOne({ email: adminEmail }).lean();
  if (!admin) throw new Error("Admin user not found for ADMIN_USERNAME");

  const creatorID = admin._id.toString();
  let created = 0;
  let updated = 0;

  for (const seed of seeds) {
    const result = await Community.updateOne(
      { name: seed.name },
      {
        $set: {
          ...seed,
          privacyLevel: "public",
          creatorID,
          adminIDs: [creatorID],
          communityMemberIDs: [creatorID],
          communityPassword: "",
          postIDs: [],
          recipeIDs: [],
          requestIDs: [],
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount) created += 1;
    else if (result.modifiedCount) updated += 1;
  }

  console.log(`Seeded communities. Created: ${created}. Updated: ${updated}. Total: ${seeds.length}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
