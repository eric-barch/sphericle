export default function Home() {
  return (
    <div className="h-[calc(100vh-3rem)] overflow-auto">
      <div className="flex flex-row min-w-full">
        <div className="w-1/2 p-14 flex flex-col items-start justify-center space-y-6 min-h-[calc(100vh-3rem)]">
          <p>
            Welcome to <strong>Sphericle</strong>, a customizable way to learn
            the geography of the world.
          </p>
          <p>
            Maybe you’re traveling to a new country and want to develop a mental
            map before you get there. Or maybe you want to solidify your
            geographic understanding of a city you’ve lived in for years. If we
            don’t already have the quiz you’re looking for,{" "}
            <strong>you can build it yourself.</strong>
          </p>
          <p>
            Watch the demo video below, or click Get Started to jump into
            building your own quiz!
          </p>

          <div
            className="relative w-full  outline-2 outline-black"
            style={{ paddingTop: "62.52%" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              style={{ height: "100%", width: "100%" }}
              src="https://www.youtube.com/embed/PlWm2r0FBMI?showinfo=0&rel=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div className="bg-blue-300 w-1/2" />
      </div>
    </div>
  );
}
