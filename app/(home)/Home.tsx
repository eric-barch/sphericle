import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center px-[10%] py-[2%] space-y-7 text-left">
      <p className="w-full">
        Welcome to <strong>Sphericle</strong>, a customizable way to learn the
        geography of the world. Watch the demo video below, or click Build a
        Quiz to jump into building your own quiz!
      </p>
      <iframe
        className="w-1/2 aspect-[14.4/9]"
        src="https://www.youtube.com/embed/PlWm2r0FBMI?showinfo=0&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <p className="w-full">
        Maybe you’re traveling to a new country and want to develop a mental map
        before you get there. Or maybe you want to solidify your geographic
        understanding of a city you’ve lived in for years. If we don’t already
        have the quiz you’re looking for,{" "}
        <strong>you can build it yourself.</strong>
      </p>
      <p className="w-full">
        Sphericle lets you build and take your own custom geography quizzes, so
        they include all the places and things that are of interest to{" "}
        <strong>YOU</strong>.
      </p>
      <Link className="rounded-3xl px-3 py-2 bg-green-700" href="/build-quiz">
        Build a Quiz
      </Link>
    </div>
  );
};

export default Home;
