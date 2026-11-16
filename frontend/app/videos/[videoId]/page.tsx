"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

// Video type
type Video = {
  _id: string;
  title: string;
  videofile: string;
  thumbnail?: string;
  description: string;
  duration: number;
  views: number;
  isPublished?: boolean;
  owner: string;
};

// Quiz question type
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

// AI content type
type AIContent = {
  transcript?: string;
  summary?: string;
  importantTopics?: string[];
  studyNotes?: string;
  importantQuestions?: string[];
  quiz?: QuizQuestion[];
  status?: string;
};

// AI section type
type AISection =
  | "summary"
  | "transcript"
  | "topics"
  | "notes"
  | "questions"
  | "quiz";

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();

  const videoId = params.videoId as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Video states
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI states
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFetching, setAiFetching] = useState(true);
  const [aiError, setAiError] = useState("");

  const [activeAISection, setActiveAISection] =
    useState<AISection>("summary");

  // Quiz states
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, string>>({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizSaveError, setQuizSaveError] = useState("");
  const [savedQuizScore, setSavedQuizScore] = useState<number | null>(null);
  const lastSavedProgress=useRef(0);
  const videoRef=useRef<HTMLVideoElement | null>(null);
  const [savedPlaybackPosition,setSavedPlayBackPosition]=useState(0)

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!apiUrl) {
          throw new Error("API URL is missing. Check .env.local.");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/video/${videoId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Unable to fetch video.");
        }

        setVideo(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId, router, apiUrl]);
  useEffect(()=>{

  })
  useEffect(()=>{
    const fetchSavedProgress=async()=>{
      try{
        if(!apiUrl || !videoId) return 
        const response =await fetch(`${apiUrl.replace(/\/+$/,"")}/progress/my-progress`,
      {
        method:"GET",
        credentials:"include",
      })
      if(!response.ok) return  
      const result=await response.json()
      const progressList=result.data;
      const currentProgress=progressList.find((item:any)=> item.video?._id===videoId);
      if(currentProgress){
        setSavedPlayBackPosition(currentProgress.lastWatchedPosition || 0);
        lastSavedProgress.current=currentProgress.watchPercentage || 0
      }
      }
      catch(error){
        console.error("Error fetching saved progress",error)
      }
    }
    fetchSavedProgress()
  },[apiUrl,videoId])

  // Fetch previously generated AI content
  useEffect(() => {
    const fetchAIContent = async () => {
      try {
        if (!apiUrl) {
          throw new Error("API URL is missing.");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/ai/${videoId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          return;
        }

        const content = result.data?.aiContent ?? result.data;

        if (content && content.status === "completed") {
          setAiContent(content);
        }
      } catch (err) {
        console.error("Unable to fetch saved AI content:", err);
      } finally {
        setAiFetching(false);
      }
    };

    if (videoId) {
      fetchAIContent();
    }
  }, [videoId, router, apiUrl]);

  // Generate transcript and AI study material
  const generateAIContent = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiContent(null);

      setSelectedAnswers({});
      setQuizSubmitted(false);
      setSavedQuizScore(null);
      setQuizSaveError("");

      if (!apiUrl) {
        throw new Error("API URL is missing.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/ai/${videoId}/transcribe`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "AI content generation failed."
        );
      }

      const content = result.data?.aiContent ?? result.data;

      setAiContent(content);
      setActiveAISection("summary");
    } catch (err) {
      setAiError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Select quiz answer
  const handleAnswerSelect = (
    questionIndex: number,
    answer: string
  ) => {
    if (quizSubmitted) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: answer,
    }));
  };

  // Calculate number of correct answers
  const calculateScore = () => {
    const questions = aiContent?.quiz || [];

    return questions.filter(
      (question, index) =>
        selectedAnswers[index] === question.correctAnswer
    ).length;
  };

  // Submit quiz and save score in MongoDB
  const submitQuiz = async () => {
    try {
      setQuizSaving(true);
      setQuizSaveError("");

      if (!apiUrl) {
        throw new Error("API URL is missing.");
      }

      const totalQuestions = aiContent?.quiz?.length || 0;

      if (totalQuestions === 0) {
        throw new Error("No quiz questions available.");
      }

      if (Object.keys(selectedAnswers).length !== totalQuestions) {
        throw new Error("Please answer all questions.");
      }

      // const correctAnswers = calculateScore();

      // const percentage = Math.round(
      //   (correctAnswers / totalQuestions) * 100
      // );

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/progress/${videoId}/quiz`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
           selectedAnswers,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save quiz score."
        );
      }

      // Save successful: display quiz result
      setSavedQuizScore(result.data?.score ?? null);
      setQuizSubmitted(true);

    } catch (err) {
      setQuizSaveError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setQuizSaving(false);
    }
  };
  const saveVideoProgress=async(percentage:number,
    currentTime:number
  )=>{
    try{
      if(!apiUrl || !videoId) return 
      const roundedPercentage=Math.min(100,Math.round(percentage));
      if(roundedPercentage<lastSavedProgress.current+10 && roundedPercentage!==100) return
      const response=await fetch(`{apiUrl.replace(/\/+$/,"")}/progress/${videoId}`,{
        method:"PATCH",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },  
        body:JSON.stringify({
          watchPercentage:roundedPercentage,
          lastWatchedPosition:currentTime
        }),
      })
      if(!response.ok){
        console.error("Failed to save video progress:",response.statusText)
        return
      }
      lastSavedProgress.current=roundedPercentage;
    }
    catch(err){
      console.error("Error saving video progress:",err)
    }
  }


  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen bg-[#090b12] p-8 text-white">
        Loading video...
      </main>
    );
  }

  // Error screen
  if (error || !video) {
    return (
      <main className="min-h-screen bg-[#090b12] p-8 text-white">
        <p className="text-red-400">
          {error || "Video not found."}
        </p>

        <button
          onClick={() => router.back()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Go Back
        </button>
      </main>
    );
  }

  // AI navigation sections
  const aiSections: { id: AISection; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "transcript", label: "Transcript" },
    { id: "topics", label: "Important Topics" },
    { id: "notes", label: "Study Notes" },
    { id: "questions", label: "Important Questions" },
    { id: "quiz", label: "Practice Quiz" },
  ];

  const quizQuestions = aiContent?.quiz || [];

  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-white md:p-8">

      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Vid<span className="text-violet-400">AI</span>
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/10"
        >
          Home
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Video Player */}
        <section className="lg:col-span-2">

          <div className="overflow-hidden rounded-2xl bg-black">
            <video
            ref={videoRef}
              controls
              poster={video.thumbnail}
              className="aspect-video w-full"
               onLoadedMetadata={(event)=>{
                 const player=event.currentTarget;
                if(savedPlaybackPosition>0 && savedPlaybackPosition<player.duration){
                  player.currentTime=savedPlaybackPosition
                  
                }}
                
                }
              onTimeUpdate={(event)=>{
                const player=event.currentTarget;
               
                if(player.duration>0){
                  const percentage=(player.currentTime/player.duration)*100;
                  saveVideoProgress(percentage,player.currentTime);
                }
              }}
              onEnded={(event)=>saveVideoProgress(100,event?.currentTarget?.duration)}
            >
              <source
                src={video.videofile}
                type="video/mp4"
              />

              Your browser does not support video playback.
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

        {/* AI Study Partner */}
        <aside className="rounded-2xl border border-white/10 bg-[#11141e] p-5">

          <h2 className="text-xl font-bold">
            ✦ AI Study Partner
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Learn smarter with AI-generated study materials.
          </p>

          {/* Generate AI Button */}
          <button
            onClick={generateAIContent}
            disabled={aiLoading}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {aiLoading
              ? "Generating Study Material..."
              : aiContent
                ? "Regenerate AI Material"
                : "Generate AI Study Material"}
          </button>

          {aiLoading && (
            <p className="mt-3 text-sm text-yellow-400">
              Processing video and generating study material.
              This may take several minutes.
            </p>
          )}

          {aiFetching && (
            <p className="mt-3 text-sm text-gray-400">
              Checking saved study material...
            </p>
          )}

          {aiError && (
            <p className="mt-3 text-sm text-red-400">
              {aiError}
            </p>
          )}

          {!aiFetching && !aiLoading && !aiContent && !aiError && (
            <p className="mt-3 text-sm text-gray-400">
              No study material generated yet.
              Click Generate AI Study Material to get started.
            </p>
          )}

          {/* AI Navigation Buttons */}
          {aiSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveAISection(section.id)}
              disabled={!aiContent}
              className={`mt-3 w-full rounded-xl border p-3 text-left transition ${
                activeAISection === section.id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 hover:border-violet-500"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              ✦ {section.label}
            </button>
          ))}

        </aside>
      </div>

      {/* AI Generated Content */}
      {aiContent && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#11141e] p-5 md:p-8">

          <h2 className="mb-6 text-2xl font-bold">
            AI Generated Study Material
          </h2>

          {/* Summary */}
          {activeAISection === "summary" && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-violet-400">
                Video Summary
              </h3>

              <p className="whitespace-pre-line leading-8 text-gray-300">
                {aiContent.summary || "No summary available."}
              </p>
            </div>
          )}

          {/* Transcript */}
          {activeAISection === "transcript" && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-violet-400">
                Video Transcript
              </h3>

              <p className="whitespace-pre-line leading-8 text-gray-300">
                {aiContent.transcript || "No transcript available."}
              </p>
            </div>
          )}

          {/* Important Topics */}
          {activeAISection === "topics" && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-violet-400">
                Important Topics
              </h3>

              <ul className="list-inside list-disc space-y-3 text-gray-300">
                {aiContent.importantTopics?.length ? (
                  aiContent.importantTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))
                ) : (
                  <li>No important topics available.</li>
                )}
              </ul>
            </div>
          )}

          {/* Study Notes */}
          {activeAISection === "notes" && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-violet-400">
                Study Notes
              </h3>

              <p className="whitespace-pre-line leading-8 text-gray-300">
                {aiContent.studyNotes || "No study notes available."}
              </p>
            </div>
          )}

          {/* Important Questions */}
          {activeAISection === "questions" && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-violet-400">
                Important Questions
              </h3>

              <ol className="list-inside list-decimal space-y-4 text-gray-300">
                {aiContent.importantQuestions?.length ? (
                  aiContent.importantQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))
                ) : (
                  <li>No questions available.</li>
                )}
              </ol>
            </div>
          )}

          {/* Practice Quiz */}
          {activeAISection === "quiz" && (
            <div>
              <h3 className="mb-6 text-xl font-semibold text-violet-400">
                Practice Quiz
              </h3>

              {quizQuestions.length === 0 ? (
                <p className="text-gray-400">
                  No quiz questions available.
                </p>
              ) : (
                <>
                  {quizQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="mb-6 rounded-xl border border-white/10 p-5"
                    >
                      <h4 className="mb-4 font-semibold">
                        {index + 1}. {question.question}
                      </h4>

                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                              selectedAnswers[index] === option
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={selectedAnswers[index] === option}
                              disabled={quizSubmitted || quizSaving}
                              onChange={() =>
                                handleAnswerSelect(index, option)
                              }
                            />

                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {/* Correct Answer and Explanation */}
                      {quizSubmitted && (
                        <div className="mt-4 text-sm">
                          <p
                            className={
                              selectedAnswers[index] === question.correctAnswer
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            Correct answer: {question.correctAnswer}
                          </p>

                          {question.explanation && (
                            <p className="mt-2 text-gray-400">
                              Explanation: {question.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Submit Quiz */}
                  {!quizSubmitted ? (
                    <>
                      <button
                        onClick={submitQuiz}
                        disabled={
                          quizSaving ||
                          Object.keys(selectedAnswers).length !==
                            quizQuestions.length
                        }
                        className="rounded-lg bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {quizSaving ? "Saving Score..." : "Submit Quiz"}
                      </button>

                      {quizSaveError && (
                        <p className="mt-3 text-sm text-red-400">
                          {quizSaveError}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl bg-violet-500/10 p-5">
                      <h4 className="text-xl font-bold text-violet-400">
                        Your Score: {calculateScore()} / {quizQuestions.length}
                      </h4>

                      <p className="mt-2 text-gray-300">
                        Percentage: {savedQuizScore}%
                      </p>

                      <p className="mt-2 text-sm text-green-400">
                        Quiz score saved successfully!
                      </p>

                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                          setSavedQuizScore(null);
                          setQuizSaveError("");
                        }}
                        className="mt-4 rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </section>
      )}

    </main>
  );
}