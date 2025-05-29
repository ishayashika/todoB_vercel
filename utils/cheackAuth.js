/* based on this cookes or token we need to varify our token */
import Jwt from "jsonwebtoken";
import createError from "./createError.js";
export default (req, res, next) => {
  console.log("Checking authentication");
  const token = req.cookies.token;
  console.log("Token from cookies:", token ? "Present" : "Not present");
  
  if (!token) {
    console.log("No token found in request");
    return next(createError({ status: 401, message: "Unauthorized Token Not found" }));
  }
  
  return Jwt.verify(token, process.env.JWT_SECRETE, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return next(createError({ status: 401, message: "Invalid Token" }));
    }
    console.log("Token verified, user ID:", decoded.id);
    req.user = decoded;
    //adding user here in the decoded one we will hava a id if you remember in the decoded one we have id and data go userAuth.js cheack login you'll get payload from there we grabbed it.
    return next();
  });
};
