import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }

    // 👇 yahin fix
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Authentication failed. Token invalid or expired: ${error.message}` });
  }
};

export default isAuth;
