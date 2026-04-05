const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to DB");

  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ username });
  if (existing) {
    existing.password = hashedPassword;
    existing.role = "Court Admin";
    existing.circuitCourt = null;
    await existing.save();
    console.log("✅ Admin user updated!");
    await mongoose.disconnect();
    return;
  }

  const user = new User({ username, password: hashedPassword, role: "Court Admin", circuitCourt: null });

  await user.save();
  console.log("✅ Admin user created!");
  mongoose.disconnect();
}).catch((err) => {
  console.error("❌ DB Error:", err);
});
