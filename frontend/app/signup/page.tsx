// "use client";

// import { useState } from "react";

// export default function SignupPage() {
//   const [fullname, setFullname] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             fullname,
//             username,
//             email,
//             password,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Signup failed. Please try again.");
//       }

//       setSuccess("Account created successfully! You can now log in.");
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Unable to connect to the server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[#090b12] px-5 py-12 text-white">
//       <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11141e] p-8 shadow-2xl shadow-violet-950/20 sm:p-10">
//         <a href="/" className="text-2xl font-extrabold tracking-tight">
//           Vid<span className="text-violet-400">AI</span>
//         </a>

//         <h1 className="mt-8 text-3xl font-bold">Create your account</h1>
//         <p className="mt-3 text-sm leading-6 text-gray-400">
//           Join VidAI and make every lesson count.
//         </p>

//         <form onSubmit={handleSignup} className="mt-8 space-y-5">
//           <div>
//             <label htmlFor="fullname" className="mb-2 block text-sm">
//               Full name
//             </label>
//             <input
//               id="fullname"
//               type="text"
//               autoComplete="name"
//               required
//               value={fullname}
//               onChange={(e) => setFullname(e.target.value)}
//               placeholder="Enter your full name"
//               className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
//             />
//           </div>

//           <div>
//             <label htmlFor="username" className="mb-2 block text-sm">
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               autoComplete="username"
//               required
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Choose a username"
//               className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="mb-2 block text-sm">
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="mb-2 block text-sm">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               autoComplete="new-password"
//               minLength={6}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Create a password"
//               className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
//             />
//           </div>

//           {error && (
//             <p role="alert" className="text-sm text-red-400">
//               {error}
//             </p>
//           )}

//           {success && (
//             <div role="status" className="text-sm leading-6 text-emerald-400">
//               {success}
//               <a href="/login" className="ml-2 underline">
//                 Log in
//               </a>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3.5 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading ? "Creating account..." : "Create account →"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-400">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="font-semibold text-violet-300 hover:text-violet-200"
//           >
//             Log in
//           </a>
//         </p>

//         <a
//           href="/"
//           className="mt-6 block text-center text-sm text-gray-500 hover:text-white"
//         >
//           ← Back to home
//         </a>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!avatar) {
      setError("Please select an avatar image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullname", fullname.trim());
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("avatar", avatar);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "API URL is missing. Check your frontend .env.local file."
        );
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/user/register`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const text = await response.text();

let result;

try {
  result = JSON.parse(text);
} catch {
  throw new Error(
    `Server error ( ${response.status}):$ {text.slice(0,250)}.`
  );
}

if (!response.ok) {
  throw new Error(result.message || "Signup failed.");
}

      

      setSuccess("Account created successfully! You can now log in.");
      setFullname("");
      setUsername("");
      setEmail("");
      setPassword("");
      setAvatar(null);

      const fileInput = document.getElementById(
        "avatar"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b12] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11141e] p-8 shadow-2xl shadow-violet-950/20 sm:p-10">
        <a href="/" className="text-2xl font-extrabold tracking-tight">
          Vid<span className="text-violet-400">AI</span>
        </a>

        <h1 className="mt-8 text-3xl font-bold">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Join VidAI and make every lesson count.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label htmlFor="fullname" className="mb-2 block text-sm">
              Full name
            </label>
            <input
              id="fullname"
              type="text"
              autoComplete="name"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="mb-2 block text-sm">
              Profile picture (required)
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setAvatar(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-white"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <div role="status" className="text-sm leading-6 text-emerald-400">
              {success}
              <a href="/login" className="ml-2 underline">
                Log in
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-violet-300 hover:text-violet-200"
          >
            Log in
          </a>
        </p>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-white"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}