"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Video = {
  _id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  duration?: number;
  views?: number;
  isPublished?: boolean;
};

type LearningProgress = {
  video: Video | null;
  watchPercentage: number;
  completed: boolean;
};

type DashboardData = {
  videos: Video[];
  continueLearning: LearningProgress[];
  statistics: {
    totalVideosStarted: number;
    completedVideos: number;
    averageProgress: number;
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Overview");
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "API URL is missing. Check your frontend .env.local file."
          );
        }

        // Assumes the backend route is:
        // GET /api/v1/dashboard/student-dashboard
        const response = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/dashboard/student-dashboard`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const text = await response.text();
        let result;

        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(
            `Invalid server response (${response.status}). Check the backend route and terminal.`
          );
        }

        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load your dashboard."
          );
        }

        if (!result.data) {
          throw new Error(
            "Dashboard data is missing from the API response."
          );
        }

        setDashboardData(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Logout failed."
      );
    }
  };

  const statistics = dashboardData?.statistics;

  const menuItems = [
    { label: "Overview", icon: "⌂" },
    { label: "My Learning", icon: "▶" },
    { label: "AI Study Tools", icon: "✦" },
  ];

  return (
    <main className="min-h-screen bg-[#090b12] text-white md:flex">
      {/* Sidebar */}
      <aside className=" border-b border-white/10 bg-[#11141e] p-5 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
       <header className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold">
          Vid<span className="text-violet-400">AI</span>
        </Link> 
        <button
          onClick={handleLogout}
          className="  w-50px rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          ↪ Log out
        </button>
        </header>

        <p className="mb-4 mt-8 text-xs uppercase tracking-widest text-gray-500">
          Student Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm transition ${
                activeTab === item.label
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-4">
          <p className="font-semibold">Your AI study partner</p>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Turn lessons into summaries, notes, and quizzes.
          </p>
        </div>

       
      </aside>

      {/* Main content */}
      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-violet-300">
              YOUR LEARNING SPACE
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {activeTab === "Overview"
                ? "Student Dashboard"
                : activeTab}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Learn at your own pace. Let AI help you revise.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-bold">
              S
            </div>
            <div>
              <p className="text-sm font-medium">Student</p>
              <p className="text-xs text-gray-500">Learner account</p>
            </div>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-3 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#11141e] p-8 text-gray-400">
            Loading your learning dashboard...
          </div>
        ) : (
          <>
            {activeTab === "Overview" && (
              <>
                <section className="mt-8 rounded-3xl border border-violet-400/20 bg-linear-to-br from-violet-950 via-[#19132d] to-[#11141e] p-6 sm:p-9">
                  <p className="text-sm font-medium text-violet-300">
                    LEARN • UNDERSTAND • REMEMBER
                  </p>
                  <h2 className="mt-4 max-w-xl text-2xl font-bold sm:text-3xl">
                    Your videos. Your notes. Your AI study partner.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-gray-300">
                    Explore educational videos and turn them into
                    summaries, important questions, and practice quizzes.
                  </p>

                  <button
                    onClick={() => setActiveTab("My Learning")}
                    className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                  >
                    Explore lessons →
                  </button>
                </section>

                <h2 className="mb-4 mt-9 text-xl font-bold">
                  Your learning progress
                </h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Videos started"
                    value={statistics?.totalVideosStarted ?? 0}
                  />
                  <StatCard
                    label="Videos completed"
                    value={statistics?.completedVideos ?? 0}
                  />
                  <StatCard
                    label="Average progress"
                    value={`${statistics?.averageProgress ?? 0}%`}
                  />
                </div>

                <section className="mt-9">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">
                      Continue learning
                    </h2>
                    <button
                      onClick={() => setActiveTab("My Learning")}
                      className="text-sm text-violet-300 hover:text-violet-200"
                    >
                      View all
                    </button>
                  </div>

                  {dashboardData?.continueLearning.length ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {dashboardData.continueLearning.map((item, index) => (
                        item.video && (
                          <VideoCard
                            key={item.video._id || index}
                            video={item.video}
                            progress={item.watchPercentage}
                          />
                        )
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="You haven't started any lessons yet. Explore the latest videos below." />
                  )}
                </section>

                <VideoSection
                  title="Recently uploaded lessons"
                  videos={dashboardData?.videos ?? []}
                />
              </>
            )}

            {activeTab === "My Learning" && (
              <>
                <section className="mt-8">
                  <h2 className="text-xl font-bold">
                    Continue learning
                  </h2>
                  {dashboardData?.continueLearning.length ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {dashboardData.continueLearning.map((item, index) =>
                        item.video ? (
                          <VideoCard
                            key={item.video._id || index}
                            video={item.video}
                            progress={item.watchPercentage}
                          />
                        ) : null
                      )}
                    </div>
                  ) : (
                    <EmptyState message="Your in-progress lessons will appear here." />
                  )}
                </section>

                <VideoSection
                  title="All available lessons"
                  videos={dashboardData?.videos ?? []}
                />
              </>
            )}

            {activeTab === "AI Study Tools" && (
              <section className="mt-8">
                <div className="rounded-2xl border border-white/10 bg-[#11141e] p-6">
                  <h2 className="text-xl font-bold">
                    AI Study Tools
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Choose a lesson to generate study materials using
                    VidAI's AI services.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Video summaries",
                      description: "Review the key ideas from a lesson.",
                    },
                    {
                      title: "Transcripts",
                      description: "Read the spoken content of a video.",
                    },
                    {
                      title: "Important questions",
                      description: "Prepare for exams with key questions.",
                    },
                    {
                      title: "Practice quizzes",
                      description: "Test your understanding of a lesson.",
                    },
                  ].map((tool) => (
                    <div
                      key={tool.title}
                      className="rounded-2xl border border-white/10 bg-[#11141e] p-5"
                    >
                      <span className="text-xl text-violet-300">✦</span>
                      <h3 className="mt-3 font-semibold">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {tool.description}
                      </p>
                      <p className="mt-4 text-xs text-gray-500">
                        AI integration coming next
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#11141e] p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/20 p-6 text-sm leading-6 text-gray-400">
      {message}
    </div>
  );
}

function VideoSection({
  title,
  videos,
}: {
  title: string;
  videos: Video[];
}) {
  return (
    <section className="mt-9">
      <h2 className="text-xl font-bold">{title}</h2>

      {videos.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState message="No published lessons are available yet." />
      )}
    </section>
  );
}

function VideoCard({
  video,
  progress,
}: {
  video: Video;
  progress?: number;
}) {
  return (
    <Link
      href={`/videos/${video._id}`}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#11141e] transition hover:border-violet-400/50"
    >
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-44 w-full bg-white/5 object-cover"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-white/5 text-gray-500">
          No thumbnail available
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold">{video.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
          {video.description || "Educational lesson"}
        </p>

        <p className="mt-3 text-xs text-gray-500">
          {video.views ?? 0} views
          {typeof video.duration === "number" &&
            ` · ${Math.round(video.duration / 60)} min`}
        </p>

        {typeof progress === "number" && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                }}
              />
            </div>
          </div>
        )}

        <p className="mt-4 text-sm font-medium text-violet-300">
          Watch lesson →
        </p>
      </div>
    </Link>
  );
}