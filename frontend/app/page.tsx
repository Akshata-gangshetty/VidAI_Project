const courses = [
  {
    category: "WEB DEVELOPMENT",
    title: "Full Stack Web Development",
    description: "Master frontend, backend and modern web technologies.",
    icon: "⌘",
    lessons: "24 lessons",
    gradient: "from-violet-500/20 to-indigo-500/5",
  },
  {
    category: "ARTIFICIAL INTELLIGENCE",
    title: "Introduction to Generative AI",
    description: "Understand AI concepts and how modern AI models work.",
    icon: "✳",
    lessons: "18 lessons",
    gradient: "from-cyan-500/20 to-blue-500/5",
  },
  {
    category: "DATA STRUCTURES",
    title: "DSA Problem Solving",
    description: "Build strong problem-solving and coding skills.",
    icon: "⌘",
    lessons: "32 lessons",
    gradient: "from-amber-500/20 to-orange-500/5",
  },
];

const features = [
  {
    icon: "✦",
    title: "AI-powered summaries",
    description:
      "Understand lengthy lectures through concise, structured notes.",
  },
  {
    icon: "◎",
    title: "Smart quizzes",
    description:
      "Test your understanding with questions generated from videos.",
  },
  {
    icon: "▤",
    title: "Instant transcripts",
    description:
      "Review explanations and find important information quickly.",
  },
];

function VidAILogo() {
  return (
    <a href="/" aria-label="VidAI home" className="group flex items-center gap-3">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-purple-600 to-cyan-400 p-px shadow-lg shadow-violet-500/20 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
        <span className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0c0c18]">
          <svg
            viewBox="0 0 48 48"
            className="h-8 w-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="vidai-gradient" x1="7" y1="6" x2="41" y2="42">
                <stop offset="0%" stopColor="#C4B5FD" />
                <stop offset="55%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#67E8F9" />
              </linearGradient>
            </defs>
            <path
              d="M12 9.5C12 7.8 13.9 6.8 15.4 7.8L35.5 21.1C37 22.1 37 24.3 35.5 25.3L15.4 38.6C13.9 39.6 12 38.6 12 36.9V9.5Z"
              fill="url(#vidai-gradient)"
            />
            <path
              d="M37 5.5L39 10.5L44 12.5L39 14.5L37 19.5L35 14.5L30 12.5L35 10.5L37 5.5Z"
              fill="white"
            />
            <circle cx="8" cy="29" r="2" fill="#67E8F9" />
          </svg>
        </span>
      </span>

      <span className="text-[23px] font-extrabold tracking-tight text-white">
        Vid<span className="bg-linear-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">AI</span>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b12] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#090b12]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <VidAILogo />

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#courses" className="transition hover:text-white">
              Explore
            </a>
            <a href="#features" className="transition hover:text-white">
              AI Features
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/login"
              className="hidden rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:text-white sm:block"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-500"
            >
              Get started <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-28">
        <div className="pointer-events-none absolute left-1/2 top-10 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-40 z-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/8 px-4 py-2 text-xs font-medium text-violet-300 sm:text-sm">
            <span className="text-cyan-300">✦</span>
            Learning, reimagined with AI
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Every video.
            <br />
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              A smarter way to learn.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Turn educational videos into summaries, transcripts, important
            questions and interactive quizzes. Learn at your pace, revise
            with confidence.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#courses"
              className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-7 py-3.5 font-semibold shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Explore learning <span aria-hidden="true">→</span>
            </a>
            <a
              href="/signup"
              className="rounded-xl border border-white/10 bg-white/4 px-7 py-3.5 font-semibold transition hover:border-violet-400/30 hover:bg-white/8"
            >
              Start learning free
            </a>
          </div>

          {/* Learning dashboard preview */}
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/10 bg-[#11141e] p-3 text-left shadow-2xl shadow-violet-950/20 sm:mt-20 sm:p-5">
            <div className="flex items-center gap-2 border-b border-white/8 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-500">
                Your AI learning workspace
              </span>
              <span className="ml-auto rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] text-violet-300">
                AI POWERED
              </span>
            </div>

            <div className="grid gap-4 py-5 sm:grid-cols-[1.3fr_1fr]">
              <div className="flex min-h-52 flex-col items-center justify-center rounded-xl bg-linear-to-br from-violet-900/60 via-[#17182b] to-cyan-900/30 p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl transition hover:scale-110">
                  ▶
                </div>
                <p className="font-semibold">Learn at your own pace</p>
                <p className="mt-2 text-xs text-gray-400">
                  Watch. Understand. Remember.
                </p>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/2 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-violet-400">✦</span>
                  AI-generated summary
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-2 w-full rounded-full bg-white/10" />
                  <div className="h-2 w-5/6 rounded-full bg-white/10" />
                  <div className="h-2 w-4/5 rounded-full bg-white/10" />
                </div>
                <div className="mt-6 rounded-lg border border-violet-400/15 bg-violet-400/6 p-3">
                  <p className="text-xs font-medium text-violet-300">
                    Key concept
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Complex lessons transformed into clear revision notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="border-t border-white/6 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Explore and learn
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Find your next lesson.
              </h2>
              <p className="mt-3 max-w-xl text-gray-400">
                Explore topics, discover ideas and make learning more effective.
              </p>
            </div>
            <span className="text-sm text-gray-500">
              Sample categories · Demo content
            </span>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="group overflow-hidden rounded-2xl border border-white/8 bg-[#10131c] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40"
              >
                <div
                  className={`flex h-44 items-center justify-center bg-linear-to-br ${course.gradient}`}
                >
                  <span className="text-6xl text-white/80 transition duration-300 group-hover:scale-110">
                    {course.icon}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold tracking-[0.15em] text-violet-400">
                    {course.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{course.title}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
                    {course.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                    <span className="text-xs text-gray-500">{course.lessons}</span>
                    <a
                      href="/login"
                      className="text-sm font-medium text-violet-300 transition hover:text-cyan-300"
                    >
                      Start learning →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI features */}
      <section id="features" className="border-t border-white/6 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Learning, upgraded
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Your personal AI study companion.
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              Spend less time making notes and more time understanding what you learn.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/8 bg-white/2 p-7 transition hover:border-violet-400/30 hover:bg-violet-400/3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl text-violet-300">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-violet-400/20 bg-linear-to-br from-violet-600/15 to-cyan-600/6 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10">
            <span className="text-3xl text-violet-300">✦</span>
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Make every lesson count.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Discover a smarter way to learn, revise and retain knowledge with VidAI.
          </p>
          <a
            href="/signup"
            className="mt-8 inline-flex rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Get started with VidAI →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <VidAILogo />
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span className="hidden sm:inline">Learn smarter, not harder.</span>
          </div>
          <p>AI-powered educational video platform.</p>
        </div>
      </footer>
    </main>
  );
}
// const courses = [
//   {
//     title: "Full Stack Web Development",
//     category: "WEB DEVELOPMENT",
//     description: "Master modern frontend and backend technologies.",
//     icon: "</>",
//     color: "from-violet-500/20 to-indigo-500/5",
//     lessons: "24 videos",
//   },
//   {
//     title: "Generative Artificial Intelligence",
//     category: "ARTIFICIAL INTELLIGENCE",
//     description: "Explore AI, machine learning and intelligent systems.",
//     icon: "✳",
//     color: "from-cyan-500/20 to-blue-500/5",
//     lessons: "18 videos",
//   },
//   {
//     title: "Data Structures & Algorithms",
//     category: "COMPUTER SCIENCE",
//     description: "Improve problem-solving and coding skills.",
//     icon: "⌘",
//     color: "from-orange-500/20 to-pink-500/5",
//     lessons: "32 videos",
//   },
// ];

// const features = [
//   {
//     icon: "▤",
//     title: "AI-Powered Summaries",
//     description: "Get concise, structured summaries of educational videos.",
//     color: "bg-violet-500/20 text-violet-300",
//   },
//   {
//     icon: "▣",
//     title: "Instant Transcripts",
//     description: "Review important explanations and find information quickly.",
//     color: "bg-cyan-500/20 text-cyan-300",
//   },
//   {
//     icon: "✳",
//     title: "Smart Quizzes",
//     description: "Test your understanding with AI-generated questions.",
//     color: "bg-emerald-500/20 text-emerald-300",
//   },
//   {
//     icon: "◇",
//     title: "Important Questions",
//     description: "Focus on key concepts and exam-oriented revision.",
//     color: "bg-orange-500/20 text-orange-300",
//   },
// ];

// function Logo() {
//   return (
//     <a href="/" className="flex shrink-0 items-center gap-2.5">
//       <span className="relative flex h-11 w-11 items-center justify-center">
//         <span className="absolute inset-1 rounded-xl bg-violet-500/30 blur-md" />
//         <svg
//           viewBox="0 0 48 48"
//           className="relative h-11 w-11"
//           fill="none"
//           aria-label="VidAI logo"
//         >
//           <defs>
//             <linearGradient id="vidai-gradient" x1="8" y1="8" x2="40" y2="42">
//               <stop stopColor="#E879F9" />
//               <stop offset="0.55" stopColor="#8B5CF6" />
//               <stop offset="1" stopColor="#2563EB" />
//             </linearGradient>
//           </defs>
//           <path
//             d="M7 15.5C7 13 9.8 11.5 12 12.8L35.5 26.4C38 27.9 38 31.5 35.5 33L12 46C9.8 47.3 7 45.7 7 43.2V15.5Z"
//             fill="url(#vidai-gradient)"
//             transform="translate(0 -3)"
//           />
//           <path
//             d="M8 12L24 3L40 12L24 20L8 12Z"
//             fill="#D946EF"
//           />
//           <path
//             d="M8 12L24 20L40 12"
//             stroke="#F5D0FE"
//             strokeWidth="1.4"
//             strokeLinejoin="round"
//           />
//           <path d="M36 13V21" stroke="#E9D5FF" strokeWidth="2" />
//           <circle cx="36" cy="23" r="2" fill="#E9D5FF" />
//         </svg>
//       </span>
//       <span className="text-2xl font-extrabold tracking-tight">
//         Vid<span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">AI</span>
//       </span>
//     </a>
//   );
// }

// export default function Home() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-[#070914] text-white">
//       {/* Navigation */}
//       <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070914]/90 backdrop-blur-xl">
//         <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-10">
//           <Logo />

//           <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
//             <a href="/" className="text-white hover:text-violet-300">Home</a>
//             <a href="#courses" className="hover:text-violet-300">Explore</a>
//             <a href="#features" className="hover:text-violet-300">Features</a>
//             <a href="#about" className="hover:text-violet-300">About</a>
//           </div>

//           <div className="flex items-center gap-3">
//             <a
//               href="/login"
//               className="hidden rounded-xl border border-white/15 px-5 py-2.5 text-sm transition hover:bg-white/5 sm:block"
//             >
//               Log in
//             </a>
//             <a
//               href="/signup"
//               className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:brightness-110 sm:px-5"
//             >
//               Get Started <span className="ml-1">↗</span>
//             </a>
//           </div>
//         </nav>
//       </header>

//       {/* Hero */}
//       <section className="relative px-5 pb-20 pt-16 sm:pt-24 lg:px-10 lg:pb-28">
//         <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
//         <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

//         <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-violet-200 sm:text-sm">
//               <span className="text-fuchsia-300">✦</span>
//               AI-POWERED LEARNING PLATFORM
//             </div>

//             <h1 className="mt-7 text-4xl font-extrabold leading-[1.13] tracking-tight sm:text-6xl">
//               Turn Every Video
//               <br />
//               into a Learning
//               <br />
//               <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
//                 Experience.
//               </span>
//             </h1>

//             <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
//               Watch educational videos with AI-generated summaries,
//               transcripts, important questions, quizzes and structured
//               study material. Learn smarter, not harder.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-4">
//               <a
//                 href="/signup"
//                 className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-6 py-3.5 font-semibold shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
//               >
//                 Start Learning Free <span className="ml-2">→</span>
//               </a>
//               <a
//                 href="#features"
//                 className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold transition hover:border-violet-400/50 hover:bg-white/[0.04]"
//               >
//                 <span className="mr-2 text-cyan-300">▷</span>
//                 Discover Features
//               </a>
//             </div>

//             <div className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10">
//               <div className="pr-4">
//                 <p className="text-2xl font-bold">AI</p>
//                 <p className="mt-1 text-xs text-slate-400 sm:text-sm">Smart learning</p>
//               </div>
//               <div className="px-4">
//                 <p className="text-2xl font-bold">24/7</p>
//                 <p className="mt-1 text-xs text-slate-400 sm:text-sm">Learn anytime</p>
//               </div>
//               <div className="pl-4">
//                 <p className="text-2xl font-bold">4-in-1</p>
//                 <p className="mt-1 text-xs text-slate-400 sm:text-sm">Study tools</p>
//               </div>
//             </div>
//           </div>

//           {/* Product preview */}
//           <div className="relative mx-auto w-full max-w-2xl">
//             <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-600/20 via-blue-500/10 to-fuchsia-500/20 blur-2xl" />

//             <div className="relative rounded-2xl border border-violet-400/25 bg-[#101321] p-4 shadow-2xl shadow-violet-950/40 sm:p-5">
//               <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
//                 <div className="flex items-center gap-2">
//                   <Logo />
//                 </div>
//                 <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
//                   AI Workspace
//                 </span>
//               </div>

//               <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
//                 <div className="flex min-h-64 flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-[#090b14] p-4">
//                   <div>
//                     <span className="text-xs text-violet-300">DATA STRUCTURES</span>
//                     <h3 className="mt-2 text-lg font-semibold">Binary Search</h3>
//                   </div>

//                   <div className="relative flex flex-1 flex-col items-center justify-center py-8">
//                     <div className="flex gap-1.5">
//                       {["1", "3", "5", "7", "9"].map((n) => (
//                         <span
//                           key={n}
//                           className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
//                             n === "5"
//                               ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200"
//                               : "border-white/15 bg-white/[0.03] text-slate-300"
//                           }`}
//                         >
//                           {n}
//                         </span>
//                       ))}
//                     </div>
//                     <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-violet-400/60 bg-violet-500/20 text-xl text-white shadow-lg shadow-violet-600/20">
//                       ▶
//                     </span>
//                     <p className="mt-3 text-xs text-slate-400">
//                       Video preview
//                     </p>
//                   </div>

//                   <div>
//                     <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
//                       <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500" />
//                     </div>
//                     <div className="mt-3 flex justify-between text-xs text-slate-400">
//                       <span>Lesson preview</span>
//                       <span>AI enabled ✦</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border border-white/10 bg-[#0b0e19] p-4">
//                   <div className="flex gap-2">
//                     <span className="rounded-md bg-violet-600 px-2 py-1.5 text-xs font-medium">
//                       Summary
//                     </span>
//                     <span className="rounded-md bg-white/5 px-2 py-1.5 text-xs text-slate-400">
//                       Quiz
//                     </span>
//                   </div>

//                   <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
//                     <span className="text-fuchsia-300">✦</span>
//                     AI Summary
//                   </div>
//                   <p className="mt-3 text-xs leading-6 text-slate-400">
//                     Binary search finds an element in a sorted array by
//                     repeatedly dividing the search interval in half.
//                   </p>

//                   <p className="mt-5 text-xs font-semibold text-white">Key Points</p>
//                   <ul className="mt-3 space-y-3 text-xs text-slate-300">
//                     <li className="flex gap-2">
//                       <span className="text-fuchsia-400">●</span>
//                       Works on sorted arrays
//                     </li>
//                     <li className="flex gap-2">
//                       <span className="text-violet-400">●</span>
//                       Divide and conquer
//                     </li>
//                     <li className="flex gap-2">
//                       <span className="text-cyan-400">●</span>
//                       Time complexity: O(log n)
//                     </li>
//                   </ul>

//                   <div className="mt-5 rounded-lg border border-violet-400/15 bg-violet-400/[0.06] p-3">
//                     <p className="text-xs font-semibold text-violet-300">
//                       ✦ Study smarter
//                     </p>
//                     <p className="mt-1 text-xs leading-5 text-slate-400">
//                       Turn lessons into revision material.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 text-xl">
//                   ✦
//                 </span>
//                 <div>
//                   <p className="text-sm font-semibold">AI transforms your learning</p>
//                   <p className="mt-1 text-xs text-slate-400">
//                     Summaries · Notes · Questions · Quizzes
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section id="features" className="border-t border-white/[0.06] px-5 py-20 lg:px-10">
//         <div className="mx-auto max-w-7xl">
//           <div className="text-center">
//             <p className="text-xs font-bold tracking-[0.25em] text-violet-400">
//               WHY CHOOSE VIDAI
//             </p>
//             <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
//               A Smarter Way to Learn
//             </h2>
//             <p className="mt-4 text-slate-400">
//               Powerful AI features to help you understand, revise and excel.
//             </p>
//           </div>

//           <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {features.map((feature) => (
//               <article
//                 key={feature.title}
//                 className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 transition hover:-translate-y-1 hover:border-violet-400/30"
//               >
//                 <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.color}`}>
//                   {feature.icon}
//                 </span>
//                 <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
//                 <p className="mt-3 text-sm leading-6 text-slate-400">
//                   {feature.description}
//                 </p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Categories */}
//       <section id="courses" className="px-5 py-16 lg:px-10 lg:py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="text-center">
//             <p className="text-xs font-bold tracking-[0.25em] text-violet-400">
//               EXPLORE TOP CATEGORIES
//             </p>
//             <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
//               Start Learning Today
//             </h2>
//             <p className="mt-4 text-slate-400">
//               Discover educational topics and build your skills.
//             </p>
//           </div>

//           <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//             {courses.map((course) => (
//               <article
//                 key={course.title}
//                 className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${course.color} p-6 transition hover:-translate-y-1 hover:border-violet-400/40`}
//               >
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-xl font-bold">
//                   {course.icon}
//                 </div>
//                 <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-violet-300">
//                   {course.category}
//                 </p>
//                 <h3 className="mt-3 text-xl font-bold">{course.title}</h3>
//                 <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
//                   {course.description}
//                 </p>
//                 <div className="mt-6 flex items-center justify-between">
//                   <span className="text-xs text-slate-400">{course.lessons}</span>
//                   <a
//                     href="/login"
//                     aria-label={`Explore ${course.title}`}
//                     className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition hover:bg-violet-600"
//                   >
//                     →
//                   </a>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to action */}
//       <section className="px-5 py-10 lg:px-10 lg:py-16">
//         <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-fuchsia-950/70 via-[#17152d] to-blue-950/70 px-7 py-12 text-center sm:px-12 lg:flex-row lg:text-left">
//           <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />
//           <div className="relative">
//             <p className="text-xs font-bold tracking-[0.25em] text-violet-300">
//               JOIN VIDAI TODAY
//             </p>
//             <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
//               Make Every Lesson Count
//             </h2>
//             <p className="mt-4 max-w-xl leading-7 text-slate-300">
//               Discover a smarter way to study educational videos with
//               AI-powered learning tools.
//             </p>
//           </div>
//           <a
//             href="/signup"
//             className="relative shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-6 py-4 font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110"
//           >
//             Get Started for Free →
//           </a>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer id="about" className="border-t border-white/[0.08] px-5 py-8 lg:px-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
//           <div>
//             <Logo />
//             <p className="mt-2 text-xs text-slate-500">
//               Learn smarter, not harder.
//             </p>
//           </div>
//           <div className="flex gap-6 text-sm text-slate-400">
//             <a href="/" className="hover:text-white">Home</a>
//             <a href="#courses" className="hover:text-white">Explore</a>
//             <a href="#features" className="hover:text-white">Features</a>
//           </div>
//           <p className="text-xs text-slate-500">
//             © {new Date().getFullYear()} VidAI. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </main>
//   );
// }