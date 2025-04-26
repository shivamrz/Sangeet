import { prismaClient } from "@/app/lib/db";
import { authOptions } from "@/lib/auth";
import { YT_REGEX } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";


const ytAPIKEY=process.env.API_KEY;

const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url : z.string()
})

export async function POST(req: NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt= data.url.match(YT_REGEX);
        if(!isYt){
            return NextResponse.json({
                message: "Wrong youtube URL!"
            }, {
                status : 411
            })
        }
        const extractedId=isYt[1];
        const ytThumbnail=`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${extractedId}&key=${ytAPIKEY}`);
        const ytData = await response.json();
        const ytTitle = ytData.items[0].snippet.title;
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url : data.url,
                extractedId,
                title:ytTitle,
                thumbnail:ytThumbnail,
                type: "Youtube",
            }
        })
        return NextResponse.json({
            ...stream,
            hasUpvoted : false,
            upvotes : 0
        })
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status : 411
        })
    }
}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if(!creatorId){
        return NextResponse.json({
            message: "Error"
        },{
            status: 411
        })
    }

    const session= await getServerSession(authOptions);
    const email=session?.user.email;
    if(!email){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: email
        }
    })

    if(!user){
        return NextResponse.json({
            message : "Unauthenticated"
        },{
            status:403
        })
    }
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where:{
            userId: creatorId,
            played: false
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include: {
            stream: true
        }
    })])

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) =>({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length>0 ? true : false
        })),
        activeStream
    })
}