import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }
    const userId = user._id

    const { acceptingMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isAcceptingMessages: acceptingMessages
                }
            },
            {
                new: true
            }
        )
        if (!updatedUser) return Response.json({ success: false, message: "failed to update the user message status" }, { status: 401 });

        return Response.json({ success: true, message: "User's accepting messages status updated successfully" }, { status: 200 })

    } catch (error) {
        console.error("Failed to update user's accepting messages status:", error);
        return Response.json({ success: false, message: "Failed to update user's accepting messages status" }, { status: 500 })
    }
}


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) return Response.json({ success: false, message: "failed to find the user" }, { status: 401 });

        return Response.json({ success: true, message: "User's accepting messages status fetched successfully", isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 })
    } catch (error) {
        console.error("Failed to find the user messaging status",error);
        return Response.json({ success: false, message: "failed to find the user" }, { status: 401 });
    }
}