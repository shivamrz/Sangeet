import { prismaClient } from "@/app/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest){
    const session= await getServerSession(authOptions);
    const email=session?.user.email;
    console.log("🔐 User session email:", email);
    if(!email){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: email
        }
    })
    console.log("👤 Voting user ID:", user?.id);
    if(!user){
        return NextResponse.json({
            message : "Unauthenticated"
        },{
            status:403
        })
    }

    try {
        const data= upvoteSchema.parse(await req.json());
        console.log("🎯 Upvoting stream ID:", data.streamId);
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
        return NextResponse.json({
            message: "Done"
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message : "unable to upvote"
        },{
            status:403
        })
    }
}