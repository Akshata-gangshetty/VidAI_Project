"use client";

import {  useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
type Video={
    _id:string;
    title:string;
    videofile:string;
    thumbnail:string;
    description:number;
    duration:number;
    views:number;
    isPulished:boolean;
    owner:string;
}
export default function VideoPage(){
    const params=useParams();
    const router=useRouter();
    const videoId=params.videoId as string;
    const [video,setVideo]=useState<Video|null>(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    useEffect(()=>{
        const fetchVideo = async () => {
        try{
             const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "API URL is missing. Check your frontend .env.local file."
        );
      }
      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/videos/${videoId}    `,
        {
          method: "GET",
          credentials: "include",
          body: "no-store",
        }
      );
      const result=await response.json();
      if(response.status===401 || response.status===403){
        router.replace("/login");
        return
      }
      if (!response.ok) {
  throw new Error(result.message || "Unable to fetch video.");
}
    setVideo(result.data);


        }
        catch(err){
            setError(
                err instanceof Error?err.message:"Something went wrong"
            )

        }
        finally{
            setLoading(false);
        }
    };
    if(videoId){
        fetchVideo();
    }
},[videoId,router])
    if (loading) {
    return (
      <main className="min-h-screen bg-[#090b12] p-8 text-white">
        Loading video...
      </main>
    );
  }
  if(error || !video){
    return (
      <main className="min-h-screen bg-[#090b12] p-8 text-white">
        <p className="text-red-400">{error || "Video not found."}</p>
        <button onClick={()=>router.back()} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
    Go Back
  </button>
      </main>
    );  
  }
  return(
    <main className="min-h-screen bg-[#090b12] p-5 text-white md:p-8">
        <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Vid<span className="text-violet-400">AI</span>
        </h1>
          <button
          onClick={() => router.push("/dashboard")}
          className="rounded-xl border border-white/10 px-4 py-2"
        >
         Home
        </button>
         </header>
         <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
                <div className="overflow-hidden rounded-2xl bg-black">
                    <video controls poster={video?.thumbnail}
                    className="aspect-video w-full">
                        <source src={video?.videofile} type="video/mp4"/>
                        Your browser does not support the video playback

                    </video>
                </div>
                <h2 className="mt-5 text-2xl font-bold">
                    {video.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-400">
            {video.description}
          </p>
            <div className="mt-5 flex gap-5 text-sm text-gray-400">
            <span>{video.views} views</span>
            <span>{video.duration} seconds</span>
          </div>

            </section>
              <aside className="rounded-2xl border border-white/10 bg-[#11141e] p-5">

          <h2 className="text-xl font-bold">
            ✦ AI Study Partner
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Learn smarter with AI-generated materials.
          </p>

          {[
            "Video Summary",
            "Transcript",
            "Important Questions",
            "Study Notes",
            "Practice Quiz",
          ].map((tool) => (
            <button
              key={tool}
              className="mt-4 w-full rounded-xl border border-white/10 p-4 text-left hover:border-violet-500"
            >
              ✦ {tool}
            </button>
          ))}

        </aside>

         </div>

    </main>
  )
  
}