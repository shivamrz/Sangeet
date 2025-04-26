import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


export default async function Dashboard(){
  const session = await getServerSession(authOptions);
  const creatorId=session?.user?.id;
  if (!creatorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session) {
    redirect("/"); // from 'next/navigation'
  }
  return <>
    <StreamView creatorId={creatorId} playVideo={true}/>
  </>
}