import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, content }: any = await request.json();


        const messageRecipient = await UserModel.findOne({ username })
        if (!messageRecipient) return Response.json({ success: false, message: "Invalid username" }, { status: 400 });
        if (!messageRecipient.isAcceptingMessage) return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
        const newMessage = {
            content,
            createdAt: new Date()
        }
        // in the below line "as Message is used for asserting the value to the messages otherwise we'll get the error"
        messageRecipient.messages.push(newMessage as Message);
        await messageRecipient.save();
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }

}