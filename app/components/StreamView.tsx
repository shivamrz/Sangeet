"use client"

import type React from "react"
import {  toast, ToastContainer } from 'react-toastify';
import { useEffect, useRef, useState } from "react"
import { SkipForward, ChevronUp, ChevronDown, Share} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Appbar } from "../components/Appbar"
// @ts-expect-error : player might not be defined on first render
import YouTubePlayer from 'youtube-player';
import Image from "next/image"
// Types
interface Song {
  "id": string,
  "type":string,
  "url":string,
  "extractedId":string,
  "active":boolean,
  "userId":string,
  "title": string,
  "thumbnail": string,
  "upvotes": number,
  "haveUpvoted": boolean
}

const REFRESH_INTERVAL_MS = 30*1000 ;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean
}) {
  const [url, setUrl] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [currentVideo, setCurrentVideo] = useState<Song | null>(null)
  const [loading,setLoading]=useState(false);
  const [playNexetLoader,setPlayNextLoader]=useState(false);
  const videoPlayerRef=useRef<HTMLDivElement>(null);
  
  async function refreshStreams() {
    const res= await fetch(`/api/streams/?creatorId=${creatorId}`,{
        credentials: "include"
    });
    const json= await res.json();
    setSongs(json.streams.sort((a: { upvotes: number }, b: { upvotes: number }) => a.upvotes< b.upvotes ? 1 : -1));
    setCurrentVideo(video => {
      if(video?.id === json.activeStream?.stream?.id){
        return video;
      }
      return json.activeStream.stream
    })
  }

  const playNextSong = async () => {
    if (songs.length > 0 ) {
      try {
        setPlayNextLoader(true);
        const data=await fetch("/api/streams/next",{
          method:"GET"
        })
        const json = await data.json();
        setCurrentVideo(json.stream)
        setSongs(q=> q.filter(x => x.id !== json.stream?.id))
      } catch (error) {
        console.error(error)        
      }
      setPlayNextLoader(false)
    }
  }

  useEffect(()=>{
    refreshStreams();
    const interval = setInterval(()=>{
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  })

  useEffect(()=>{
    if(!videoPlayerRef.current) return;
    const player = YouTubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo?.extractedId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: YT.OnStateChangeEvent){
      if (event.data === 0){
        playNextSong();
      }
    }
    // 'stopVideo' is queued after 'playVideo'.
    player.on('stateChange', eventHandler);
    return () => {
      player.destroy();
    }
  }, [currentVideo])

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/creator/${creatorId}`
    navigator.clipboard.writeText(shareableLink).then(()=>{
        toast.success('Link copied to Clipboard', {
            position:"top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    },(err) => {
        console.error('could not copy text: ', err)
        toast.error('Failed to copy link. Please try again.', {
            position:"top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    })
  }
  const handleVote = async (id: string, isUpvote: boolean) => {
    setSongs(songs.map((song) => 
        song.id === id
            ?
            { ...song, upvotes: isUpvote ? song.upvotes + 1 : song.upvotes - 1,
              haveUpvoted: !song.haveUpvoted
            }
            : song
    ).sort((a, b) => (b.upvotes) - (a.upvotes)))

    await fetch(`/api/streams/${isUpvote ? "upvote" : "downvote" }`, {
        method: "POST",
        body: JSON.stringify({
            streamId: id
        })
    })
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const res=await fetch("/api/streams/",{
      method:"POST",
      body: JSON.stringify({
        creatorId: creatorId,
        url: url
      })
    })

    setSongs([...songs, await res.json()])
    setLoading(false)
    setUrl("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* App Bar */}
      <Appbar/>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left Column (2/3 width) */}
        <div className="w-full p-4 md:w-2/3 md:p-6">
          {/* Now Playing Section */}
          <Card className="mb-6 overflow-hidden bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border-violet-800/20 backdrop-blur-md">
            <CardContent className="p-0">
              <div className="p-6">                
                <div className="flex flex-row justify-between">
                  <h2 className="text-3xl text-center font-bold mb-4">Now Playing</h2>
                  <Button onClick={handleShare} variant="ghost" size="default" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
                      <Share className="h-5 w-5" />
                      <span className="sr-only">Share</span>Share
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Media Section - Conditionally shows thumbnail or YouTube embed */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/40">
                    {currentVideo ? (
                      <div>
                        {playVideo ? <>
                          <div ref={videoPlayerRef} className="absolute inset-0 w-full h-full"/>
                          {/* <iframe
                          src={`https://www.youtube.com/embed/${currentVideo?.extractedId }?autoplay=1`}
                          title={currentVideo?.title}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe> */}
                        </> : <>
                        <Image
                          src={currentVideo.thumbnail || "/placeholder.svg"}
                          alt="currentVideo"
                          fill
                          className="object-cover"
                        />
                        <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                        </>}                      
                    </div>) : (
                      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
                        <p className="text-center text-xl font-bold text-gray-400">
                          No Video Playing                                                
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Song Info and Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentVideo?.title}</h3>
                      <div className="flex items-center gap-2 text-violet-300">
                        {/* <span className="text-sm">Most Upvoted • {currentVideo?.upvotes} votes</span> */}
                      </div>
                    </div>
                    {playVideo && <Button disabled={playNexetLoader}
                      onClick={() => {                        
                        playNextSong()
                      }}
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300"
                    >
                      <SkipForward className="mr-2 h-4 w-4" />
                      {playNexetLoader ? "Loading..." : "Play Next"}
                    </Button>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* YouTube URL Input Section */}
          <Card className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border-violet-800/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Add YouTube Song</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Paste YouTube URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-white/10 border-violet-800/30 placeholder:text-white/50 focus-visible:ring-violet-500"
                />
                <Button 
                  disabled={loading}
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  {loading? "Loading..." : "Add to Queue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="w-full p-4 md:w-1/3 md:p-6">
          {/* Queue Section */}
          <Card className="h-full bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border-violet-800/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Queue</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(100vh-12rem)]">
              <div className="space-y-3">
                {songs.length==0 && <Card className="mb-6 overflow-hidden bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border-violet-800/20 backdrop-blur-md"><CardContent className="p-0"> <p className="text-center text-xl font-bold text-gray-400">No Video in Queue</p></CardContent></Card>}
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      song.id === currentVideo?.id
                        ? "bg-violet-800/30 border border-violet-500/50"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={song.thumbnail || "/placeholder.svg"}
                        alt={song.title || "Now playing"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/10 hover:text-violet-400"
                        onClick={() => handleVote(song.id, song.haveUpvoted? false : true)}
                      >
                        {song.haveUpvoted  ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        
                        <span className="sr-only">Upvote</span>
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{song.upvotes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </main>
      <ToastContainer/>
    </div>
  )
}
