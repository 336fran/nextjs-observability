import Link from "next/link";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-white">About Page</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        This is the about page. Click the button below to go back to home and track the page view!
      </p>
      <Link
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        href="/"
      >
        Go Back to Home
      </Link>
    </div>
  );
}