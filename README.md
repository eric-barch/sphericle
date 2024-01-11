# Sphericle

Make custom geography quizzes to study niche locations.

[Live Demo](https://sphericle.app/)

## When to Use

Online geography quizzes like [Seterra](https://www.geoguessr.com/vgp/3355), [playGeography](https://www.playgeography.com/games/countries-of-the-world/), and [Geography.Games](https://geography.games/europe-quiz) are a great way to learn geography! But you're limited to studying _their_ quizzes.

What if you're an intrepid mountaineer, whose very survival depends on knowing every peak and pass in a particular mountain range? Or a budding sommelier, whose career rests on the ability to distinguish between the wine regions of Bordeaux and Burgundy? Maybe you're just an average person with an above-average enthusiasm for geographic trivia.

Whatever your background, geography apps with staff-curated quizzes will never have exactly what you need to study a niche part of the world. Sphericle lets you make your own quiz out of [OpenStreetMap](https://nominatim.openstreetmap.org/ui/search.html) and [Google Places](https://developers.google.com/maps/documentation/places/web-service/overview) locations, then save it, share it, and study it whenever you want.

## How to Use

1. Go to the [Quiz Builder](https://sphericle.app/build-quiz) page. You'll start at the global level, where you can add locations anywhere in the world.
2. Decide whether your first location will be an **Area** or a **Point**. **Area**s are two-dimensional shapes that can contain sublocations. **Point**s correspond to a single latitude longitude coordinate and cannot contain sublocations. Use the button on the left side of the input box to toggle location types. For this tutorial, let's assume that you choose to add an Area.
3. Search for and select your Area to add it to the quiz.

At this point, you can continue adding locations at the global level, or you can add sublocations to your Area. Let's do the latter.

4. Click on the Area to expand it. You'll notice that it has its own location adder search box. Search for and add any sublocations that you want nested inside. Areas can be nested as deep as you want, which is useful for organizing locations by administrative level, e.g. `Country -> State -> County -> City`.
5. Your quiz is saved every time you make a change. Once you're satisfied with it, click `Take Quiz`.
6. As you take the quiz, it will advance through your locations and "descend" through the tree automatically. Using the administrative level example from step 4, you would first be asked to identify all the countries, then each state within each country, then each county within each state, and finally each city within each county.
7. Your score is in the top right corner of the screen. Good luck!

## Product Roadmap

- **GeoJSON Upload**: [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) files for various geographic features are available from a variety of sources, not just OpenStreetMap and Google. Users should be able to upload GeoJSON from their local machine so as not to be constrained by those APIs.
- **Draw Your Own Features**: If a user can't find a feature they want to include in their quiz, they should be able to draw it themselves directly on the map.
- **[Polyline](https://developers.google.com/maps/documentation/javascript/examples/polyline-simple)/[LineString](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.4) Support**: In addition to **Area**s and **Point**s, users should be able to quiz themselves on lines and routes. This would be useful for memorizing highway systems or learning the public transit system of a particular city, for example.
- **Official Flags**: Being a geography nerd is highly correlated with being a flag nerd. Geographic locations should be automatically associated with their official flag, and users should be able to quiz themselves on those flags.
- **Quiz Modes**: There should be more ways to take a quiz than simply typing in the name of the highlighted location. Examples:
  - Users receive the name of the location and have to click on it on the map.
  - Users have to identify an Area based solely on its shape, rather than its position on the map.
  - Users have to identify the border Areas of a particular Area.
- Have a question or feature idea? [Start a discussion](https://github.com/eric-barch/sphericle/discussions/new/choose) or [email me](mailto:eric.michael.barch@gmail.com)!
