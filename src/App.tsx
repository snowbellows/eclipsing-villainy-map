import { useState } from 'react';
import { scaleLinear } from '@visx/scale';
import './App.css';
const width =  2048;
const height =  2048;
const background = '#2B2D42';
const PERSIAN_RED = '#BB4430';
const VERDIGRIS = '#7EBDC2';
const VANILLA = '#F3DFA2';
const LINEN = '#EFE6DD';

const scalePlanets = scaleLinear({
  domain: [0, 1],
  range: [0, 200],
  round: true
})

const regionNames = [
  'inner_system',
  'earth_orbit',
  'mars',
  'the_belt',
  'jupiter',
  'titan',
  'outer_system',
] as const;

type RegionName = (typeof regionNames)[number];

const planetNames = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
] as const;

type PlanetName = (typeof planetNames)[number];

const planets = [
  { name: 'mercury' },
  { name: 'venus' },
  { name: 'earth' },
  { name: 'mars' },
  { name: 'jupiter' },
  { name: 'saturn' },
  { name: 'uranus' },
  { name: 'neptune' },
];

interface Region {
  name: RegionName;
  planets?: {
    name: PlanetName;
  }[];
  asteroids?: boolean;
}

const regions = [
  { name: 'inner_system', planets: [{ name: 'mercury' }, { name: 'venus' }] },
  { name: 'earth_orbit', planets: [{ name: 'earth' }] },
  { name: 'mars', planets: [{ name: 'mars' }] },
  { name: 'the_belt', asteroids: true },
  { name: 'jupiter', planets: [{ name: 'jupiter' }] },
  { name: 'titan', planets: [{ name: 'saturn' }] },
  { name: 'outer_system', planets: [{ name: 'uranus' }, { name: 'neptune' }] },
] as Region[];

function App() {
  const [hoverRegions, setHoverRegions] = useState<{
    [k in RegionName]?: boolean;
  }>({});

  return (
    <>
      <svg width="100vw" height="100vh" viewBox={`0, 0, ${width}, ${height}`} preserveAspectRatio='xMaxYMin' >
        <rect width="100%" height="100%" fill={background} />
        <circle cx={width} cy={0} r={500} fill={VANILLA} />
        {regions
          .map((r, i) => {
            const radius =
              500 + 300 * (i + 1);

            return (
              <g
                key={`group-${r.name}`}
                transform={`translate(${width},${0})`}
                onMouseEnter={() => {
                  setHoverRegions((hO) => ({ ...hO, [r.name]: true }));
                }}
                onMouseLeave={() => {
                  setHoverRegions((hO) => ({ ...hO, [r.name]: false }));
                }}
              >
                {r.planets &&
                  r.planets.map((p, j) => {
                    
                    const planetRadius = radius + scalePlanets( 1 - (j + 1) / r.planets!.length )
                    
                    return (
                    <>
                      <circle
                        key={`orbit-${p.name}`}
                        cx={0}
                        cy={0}
                        r={planetRadius}
                        stroke={LINEN}
                        strokeWidth={hoverRegions[r.name] ? 10 : 5}
                        fillOpacity={0}
                        // transform={"skewX(30)"}
                      />
                      <circle
                        key={`planet-${r.name}`}
                        cx={0}
                        cy={0}
                        r={hoverRegions[r.name] ? 50 : 20}
                        fill={VERDIGRIS}
                        // transform={"skewX(30)"}
                        transform={`
                                
                                rotate(${-250 + i * 8 + j * 2  })
                                translate(${planetRadius})
                              `}
                      />
                    </>
                  )})}
              </g>
            );
          })
          // Reverse it so it gets rendered biggest to smallest to make hover work
          .reverse()}
      </svg>
    </>
  );
}

export default App;
