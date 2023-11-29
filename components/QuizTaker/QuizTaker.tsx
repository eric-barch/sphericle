import Map from "@/components/Map";
import { useQuiz } from "@/components/QuizProvider";
import { useEffect, useState } from "react";
import AnswerBox from "./AnswerBox";

interface QuizTakerProps {}

export default function QuizTaker({}: QuizTakerProps) {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const quiz = useQuiz();

  useEffect(() => {
    async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }
    }

    loadPlacesLibrary();
  }, []);

  return (
    <>
      {placesLoaded ? (
        <div className="h-[calc(100vh-48px)] relative flex justify-center content-center">
          <Map
            mapId="8777b9e5230900fc"
            displayedLocation={quiz.selectedSublocation}
          />
          <AnswerBox />
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
}
