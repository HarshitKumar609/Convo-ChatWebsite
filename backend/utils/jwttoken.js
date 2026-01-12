import jwt from "jsonwebtoken";

const jsontoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Use a string as cookie name
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // 👈 IMPORTANT
    secure: false, // 👈 IMPORTANT for localhost
  });
};

export default jsontoken;
