
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import bcrypt from "bcryptjs"
import { ApiResponse } from "@/types/apiResponse";
import { request } from "http";
import { signUpSchema } from "@/schemas/signUpSchema"


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, username, password } = await request.json()
        

        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerifiedByUsername) return Response.json({ success: false, message: "Username already taken Please try with new username" }, { status: 400 });

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingUserByEmail = await User.findOne({ email })
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) return Response.json({ success: false, message: "User already verified" }, { status: 400 });
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []

            });
            await newUser.save();
            // console.log("The new user is ", newUser)
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) return Response.json({
            success: false, message: emailResponse.message
        }, { status: 500 })
        console.log(emailResponse)
        return Response.json({
            success: true, message: "User registered Successfully Please verify your email"
        }, { status: 200 })

    } catch (error) {
        console.error("Error while registering the user");
        return Response.json({ success: false, message: "Failed to register the user" }, {
            status: 500
        })
    }
}