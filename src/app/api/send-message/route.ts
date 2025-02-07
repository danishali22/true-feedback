import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
    dbConnect();

    const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // check user accepting the messages or not
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, { status: 403 });
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });


    } catch (error) {
        console.error("Error in sending message", error);
        return Response.json({
            success: false,
            message: "Error in sending message"
        }, { status: 500 });
    }
}