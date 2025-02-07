import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth].ts/options";
import UserModel from "@/models/User";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid;
    dbConnect();

    const session = getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message Deleted"
        }, { status: 200 });


    } catch (error) {
        console.error("Error in deleting messages", error);
        return Response.json({
            success: false,
            message: "Error in deleting messages"
        }, { status: 500 });
    }
}