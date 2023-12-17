const bcrypt = require("bcryptjs");
const User = require("./models/userSchema.js");

async function registerUser(username, password) {
  try {
    const existingUser = await User.findOne(
      { username: username },
      { password: password }
    );

    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Server error" };
  }
}

async function loginUser(username, password) {
  try {
    const user = await User.findOne({ username });

    console.log(user);

    if (!user || !user.password) {
      return { success: false, message: "Invalid credentials" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords

    if (!passwordMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    return { success: true, message: "Login successful", user };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Server error" };
  }
}

module.exports = { registerUser, loginUser };
