import jwt from "jsonwebtoken";

export const generateToken=(userId,res) => {
        const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d",
    });

    res.cookie("jwt",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // mencegah serangan css serangan skrip lintas situs
        sameSite: "strict", // serangan csrf serangan pemalsuan permintaan lintas situs
        secure: process.env.NODE_ENV !== "development"
    });
    return token;
};