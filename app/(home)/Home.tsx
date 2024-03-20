"use client";

import { Logo } from "@/components/logo";
import { Nav } from "@/components/nav";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Logo className="h-64 m-4" />
      <Nav />
      <div className="flex flex-row h-[calc(100vh-20rem)] border-black border-b-2 text-black">
        <div className="flex flex-col bg-light-blue p-8 h-full w-1/2 items-center justify-center border-black border-r-[calc(1px)]">
          <p className="text-4xl font-extrabold w-full mb-16">
            Learn your world.
          </p>
          <p className="mb-16">
            Sphericle helps you study geography. The main offering is the Quiz
            Builder, which lets you build and save your own quizzes. It also has
            pre-built quizzes for popular feature sets. Get started by trying
            one of those!
          </p>
          <Link
            className="rounded-full p-4 py-3 bg-black text-white"
            href="/browse-quizzes"
          >
            Browse Quizzes
          </Link>
        </div>
        <div className="h-full w-1/2 border-black border-l-[calc(1px)]" />
      </div>
      <div className="flex flex-row h-[calc(100vh-20rem)] text-black">
        <div className="h-full w-1/2 border-black border-r-[calc(1px)]" />
        <div className="flex flex-col bg-light-green p-8 h-full w-1/2 items-center justify-center border-black border-l-[calc(1px)]">
          <p className="text-4xl font-extrabold w-full mb-16">
            As big as Google Maps.
          </p>
          <p className="mb-16">
            <span>Sphericle is built on </span>
            <Link
              className="text-blue-800"
              href="https://www.openstreetmap.org"
            >
              OpenStreetMap
            </Link>
            <span> and </span>
            <Link
              className="text-blue-800"
              href="https://developers.google.com/maps/documentation/places/web-service"
            >
              Google Places
            </Link>
            <span>
              . If it’s on Google Maps, it’s on Sphericle. You could build a
              quiz of all the Dunkin's in New England. Good luck memorizing
              them.
            </span>
          </p>
          <Link
            className="rounded-full p-4 py-3 bg-black text-white"
            href="/build-quiz"
          >
            Build a Quiz
          </Link>
        </div>
      </div>
      <div className="bg-black h-64" />
    </>
  );
};

export default Home;
