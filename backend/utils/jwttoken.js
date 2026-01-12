import jwt from "jsonwebtoken";

const jsontoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Use a string as cookie name
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // REQUIRED on HTTPS
    sameSite: "None", // REQUIRED for cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default jsontoken;
