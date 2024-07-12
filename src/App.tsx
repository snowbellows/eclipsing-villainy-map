import { useState } from "react";
import { scaleLinear } from "@visx/scale";
import "./App.css";
const background = "#2B2D42";
const PERSIAN_RED = "#BB4430";
const VERDIGRIS = "#7EBDC2";
const VANILLA = "#F3DFA2";
const LINEN = "#EFE6DD";
const GREY = "#bcbab8";

const width = 2048;
const height = 2048;

const centreX = width / 2 - 500;
const centreY = width / 2 + 300;

const numAsteroidsPerCluster = 6;

const random = Math.random()

const scalePlanets = scaleLinear({
  domain: [0, 1],
  range: [0, 200],
  round: true,
});

const regionNames = [
  "inner_system",
  "earth_orbit",
  "mars",
  "the_belt",
  "jupiter",
  "titan",
  "outer_system",
] as const;

type RegionName = (typeof regionNames)[number];

const planetNames = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;

type PlanetName = (typeof planetNames)[number];

const planets = [
  { name: "mercury" },
  { name: "venus" },
  { name: "earth" },
  { name: "mars" },
  { name: "jupiter" },
  { name: "saturn" },
  { name: "uranus" },
  { name: "neptune" },
];

interface Planet {
  name: PlanetName;
  orbitPos: number;
}

interface Region {
  name: RegionName;
  planets?: Planet[];
  asteroids?: { orbitPos: number; clusters: number };
}

const regions: Region[] = [
  {
    name: "inner_system",
    planets: [
      { name: "mercury", orbitPos: -273 },
      { name: "venus", orbitPos: -249 },
    ],
  },
  { name: "earth_orbit", planets: [{ name: "earth", orbitPos: -207 }] },
  { name: "mars", planets: [{ name: "mars", orbitPos: -222 }] },
  { name: "the_belt", asteroids: { orbitPos: -50, clusters: 5 } },
  { name: "jupiter", planets: [{ name: "jupiter", orbitPos: -52 }] },
  { name: "titan", planets: [{ name: "saturn", orbitPos: -34 }] },
  {
    name: "outer_system",
    planets: [
      { name: "uranus", orbitPos: -19 },
      { name: "neptune", orbitPos: -13 },
    ],
  },
];

function App() {
  const [hoverRegions, setHoverRegions] = useState<{
    [k in RegionName]?: boolean;
  }>({});

  return (
    <>
      <svg width="100vw" height="100vh" viewBox={`0, 0, ${width}, ${height}`}>
        <rect width="100%" height="100%" fill={background} />
        <circle cx={centreX} cy={centreY} r={100} fill={VANILLA} />
        {regions
          .map((r, i) => {
            const radius = 100 + 200 * (i + 1) ;
            return (
              <Region
                data={r}
                radius={radius}
                highlight={hoverRegions[r.name]}
                onMouseEnter={() => {
                  setHoverRegions((hO) => ({ ...hO, [r.name]: true }));
                }}
                onMouseLeave={() => {
                  setHoverRegions((hO) => ({ ...hO, [r.name]: false }));
                }}
              />
            );
          })
          // Reverse it so it gets rendered biggest to smallest to make hover work
          .reverse()}
      </svg>
    </>
  );
}

function Region({
  data,
  radius,
  highlight,
  onMouseEnter,
  onMouseLeave,
}: {
  data: Region;
  radius: number;
  highlight?: boolean;
  onMouseEnter?: React.MouseEventHandler<SVGGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGGElement>;
}) {
  return (
    <g
      key={`group-${data.name}`}
      transform={`translate(${centreX},${centreY})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {data.planets &&
        data.planets.map((p, j) => {
          const planetRadius =
            radius + scalePlanets(1 - (j + 1) / data.planets!.length);

          return (
            <Planet data={p} radius={planetRadius} highlight={highlight} />
          );
        })}

      {data.asteroids && (
        <g>
          {[...new Array(data.asteroids.clusters).keys()].map((j) => {
            return [...new Array(numAsteroidsPerCluster).keys()].map((i) => {
              console.log(i);

              const id = `asteroid-${data.name}-${i}`;
              const freq = 1.5;
              const amplitude = 0.8;
              const y = i * 0.5;
              const x = Math.sin(((y + random) / 2) * freq * Math.PI * 2) * amplitude;
              console.log(id, x, y);
              return (
                <path
                  d={getAsteroidDString(i, x, y)}
                  key={id}
                  id={id}
                  cx={0}
                  cy={0}
                  rx={highlight ? 50 : 20}
                  ry={highlight ? 50 : 20}
                  fill={"#848484"}
                  stroke={background}
                  strokeWidth={5}
                  transform={`
                  skewX(30)
                  rotate(${data.asteroids!.orbitPos + 10 * random})


                  translate(${radius - (j * 100) / 3}, ${j * 100})
                  rotate(${(i + 1) * (j + 1) * 10}, ${x * 100}, ${y * 100})
                                      scale(${0.8 + ((numAsteroidsPerCluster + data.asteroids!.clusters) - (1+i + j ))/ (numAsteroidsPerCluster + data.asteroids!.clusters) / 4})

                `}
                />
              );
            });
          })}
        </g>
      )}
    </g>
  );
}

function Planet({
  data,
  radius,
  highlight,
}: {
  data: Planet;
  radius: number;
  highlight?: boolean;
}) {
  return (
    <>
      <circle
        key={`orbit-${data.name}`}
        cx={0}
        cy={0}
        r={radius}
        stroke={LINEN}
        strokeWidth={highlight ? 10 : 5}
        fillOpacity={0}
        transform={"skewX(30)"}
      />
      <circle
        key={`planet-${data.name}`}
        cx={0}
        cy={0}
        r={highlight ? 50 : 20}
        fill={VERDIGRIS}
        transform={`
                    skewX(30)
                    rotate(${data.orbitPos - 10 * random})
                    translate(${radius})
                  `}
      />
    </>
  );
}

function getAsteroidDString(i: number, x: number, y: number) {
  return [
    `M ${x * 100}, ${y * 100}
      c -14.37321,0 -25.55691,-16.2359 -27.40937,-23.398236 
      -4.24311,-16.40557 -2.82817,-31.95398 9.3593,-41.782587 
      10.36207,-8.356518 29.43489,-5.457223 35.76588,4.011125 
      7.11801,10.645396 9.36518,20.244736 6.68522,31.754772 
      -3.58337,15.390048 -11.0306,27.743626 -24.40103,29.414926 z`,
      `M ${x * 100}, ${y * 100}
      c -14.37321,0 -25.55691,-16.2359 -27.40937,-23.398236 
      -4.24311,-16.40557 -2.82817,-31.95398 9.3593,-41.782587 
      10.36207,-8.356518 29.43489,-5.457223 35.76588,4.011125 
      7.11801,10.645396 9.36518,20.244736 6.68522,31.754772 
      -3.58337,15.390048 -11.0306,27.743626 -24.40103,29.414926 z`,
    `M ${x * 100}, ${y * 100}
      c -14.37321,0 -25.5569,-16.2359 -27.40936,-23.39824 
      -4.24311,-16.40557 11.87808,-16.66855 18.71859,-30.75198 
      5.68242,-11.69913 20.07559,-16.48783 26.40658,-7.01948 
      7.11801,10.6454 11.37074,32.94664 8.69078,44.45667 
      -3.58337,15.39005 -13.03616,15.04173 -26.40659,16.71303 z`,
    `M ${x * 100}, ${y * 100}
      c -14.373212,0 -23.885609,-3.86826 -25.738073,-11.0306 
      -4.24311,-16.40557 -8.350094,-40.03164 7.688001,-54.15022 
      13.487782,-11.873498 28.097852,5.57337 34.428842,15.04172 
      7.11801,10.6454 10.70222,9.21414 8.02226,20.72417 
      -3.58337,15.39006 -11.0306,27.74363 -24.40103,29.41493  z`,
    `M ${x * 100}, ${y * 100}
      c -14.37321,0 -20.326055,-15.03377 -20.389896,-33.09179 
      -0.03216,-9.09647 2.18574,-19.25208 14.37321,-29.08068 
      10.36207,-8.35652 35.99903,-20.756483 44.79092,-7.01948 
      10.15072,15.86012 4.68553,30.94108 -2.33982,42.78537 
      -8.06128,13.5908 -23.063984,24.73528 -36.434414,26.40658  z`,
    `M ${x * 100}, ${y * 100}
      c -24.73529,1.33705 -20.66031,-27.40141 -20.38989,-33.09179 
      0.4318,-9.08627 -1.82539,-26.60581 10.36208,-36.43441 
      10.36207,-8.3565196 26.97399,-8.3888396 35.76588,5.34816 
      10.15072,15.86012 17.67618,37.52818 7.688,58.49562 
      -4.07011,8.54408 -33.09181,19.05285 -33.42607,5.68242   z`,
  ][i];
}

export default App;
