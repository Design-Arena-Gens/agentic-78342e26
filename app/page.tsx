import { Fragment } from "react";

type Relation = "above" | "below" | "on";

type ProjectionView = {
  relation: Relation;
  distance: number; // millimetres
};

type ProjectionPoint = {
  id: string;
  label: string;
  description: string;
  quadrant: string;
  front: ProjectionView;
  top: ProjectionView;
};

const XY_LINE_Y = 300;
const SCALE = 4; // 1 mm = 4 px
const START_X = 90;
const X_STEP = 85;

const points: ProjectionPoint[] = [
  {
    id: "A",
    label: "First quadrant",
    description:
      "25 mm above HP and 45 mm in front of VP. Front view is above XY, top view is below XY.",
    quadrant: "First quadrant",
    front: { relation: "above", distance: 25 },
    top: { relation: "below", distance: 45 },
  },
  {
    id: "B",
    label: "Second quadrant",
    description:
      "35 mm above HP and 50 mm behind VP. Front view above XY, top view above XY.",
    quadrant: "Second quadrant",
    front: { relation: "above", distance: 35 },
    top: { relation: "above", distance: 50 },
  },
  {
    id: "C",
    label: "Third quadrant",
    description:
      "45 mm below HP and 30 mm behind VP. Front view below XY, top view above XY.",
    quadrant: "Third quadrant",
    front: { relation: "below", distance: 45 },
    top: { relation: "above", distance: 30 },
  },
  {
    id: "D",
    label: "Fourth quadrant",
    description:
      "30 mm below HP and 40 mm in front of VP. Front view below XY, top view below XY.",
    quadrant: "Fourth quadrant",
    front: { relation: "below", distance: 30 },
    top: { relation: "below", distance: 40 },
  },
  {
    id: "E",
    label: "On VP",
    description: "50 mm above HP and on VP. Top view lies on XY line.",
    quadrant: "On VP",
    front: { relation: "above", distance: 50 },
    top: { relation: "on", distance: 0 },
  },
  {
    id: "F",
    label: "On VP",
    description: "45 mm below HP and on VP. Top view lies on XY line.",
    quadrant: "On VP",
    front: { relation: "below", distance: 45 },
    top: { relation: "on", distance: 0 },
  },
  {
    id: "G",
    label: "On HP (in front of VP)",
    description: "On HP and 35 mm in front of VP. Front view lies on XY line.",
    quadrant: "On HP",
    front: { relation: "on", distance: 0 },
    top: { relation: "below", distance: 35 },
  },
  {
    id: "H",
    label: "On HP (behind VP)",
    description: "On HP and 25 mm behind VP. Front view lies on XY line.",
    quadrant: "On HP",
    front: { relation: "on", distance: 0 },
    top: { relation: "above", distance: 25 },
  },
  {
    id: "I",
    label: "On both HP and VP",
    description: "The point lies on both reference planes. Both views coincide on XY line.",
    quadrant: "On HP & VP",
    front: { relation: "on", distance: 0 },
    top: { relation: "on", distance: 0 },
  },
];

const relationToOffset = ({ relation, distance }: ProjectionView) => {
  if (relation === "above") return -distance * SCALE;
  if (relation === "below") return distance * SCALE;
  return 0;
};

const toY = (view: ProjectionView) => XY_LINE_Y + relationToOffset(view);

const quadrantZones = [
  {
    label: "Front views above HP",
    description: "Points located above the HP project above the XY line in the front view.",
    x: 18,
    y: 55,
  },
  {
    label: "Top views behind VP",
    description: "Behind VP projects above XY in the top view (2nd & 3rd quadrants).",
    x: 18,
    y: 220,
  },
  {
    label: "Front views below HP",
    description: "Points below HP appear below the XY line in the front view.",
    x: 18,
    y: 355,
  },
  {
    label: "Top views in front of VP",
    description: "In front of VP projects below XY in the top view (1st & 4th quadrants).",
    x: 18,
    y: 520,
  },
];

const legendItems = [
  {
    label: "Front view ( elevation )",
    color: "#2563eb",
  },
  {
    label: "Top view ( plan )",
    color: "#16a34a",
  },
  {
    label: "Projector",
    color: "rgba(15, 23, 42, 0.4)",
  },
];

export default function Page() {
  return (
    <main>
      <section>
        <h1>Orthographic Projection Explorer</h1>
        <p>
          Inspect how a point in space projects onto the principal reference planes. Each
          point is plotted with its front view (elevation) and top view (plan) relative to the
          XY reference line. Distances are preserved from the input data so you can see the
          exact layout for all quadrants and edge cases.
        </p>
      </section>

      <section className="chart-container">
        <div className="chart-card">
          <h2>XY Reference Diagram</h2>
          <p>
            The XY line separates elevations (front views) above from plans (top views)
            below. Points behind the VP plot above the XY line in plan, while points in front
            plot below.
          </p>
          <div className="diagram-wrapper">
            <svg
              className="diagram"
              viewBox="0 0 820 600"
              role="img"
              aria-labelledby="diagram-title"
            >
              <title id="diagram-title">
                Orthographic projections showing front and top views for labelled points.
              </title>
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="var(--grid-line)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect x="0" y="0" width="820" height="600" fill="url(#grid)" />

              {quadrantZones.map((zone) => (
                <Fragment key={zone.label}>
                  <text x={zone.x} y={zone.y} className="grid-label">
                    {zone.label}
                  </text>
                  <text x={zone.x} y={zone.y + 16} className="grid-label" style={{ fontSize: "0.75rem" }}>
                    {zone.description}
                  </text>
                </Fragment>
              ))}

              <line
                x1="0"
                y1={XY_LINE_Y}
                x2="820"
                y2={XY_LINE_Y}
                stroke="var(--foreground)"
                strokeWidth="2"
              />
              <text
                x="10"
                y={XY_LINE_Y - 10}
                className="annotation"
              >
                XY (Intersection of HP & VP)
              </text>

              {points.map((point, index) => {
                const x = START_X + index * X_STEP;
                const frontY = toY(point.front);
                const topY = toY(point.top);
                const isCoincident = Math.abs(frontY - topY) < 0.1;

                return (
                  <Fragment key={point.id}>
                    <line
                      x1={x}
                      y1={frontY}
                      x2={x}
                      y2={topY}
                      stroke="rgba(15, 23, 42, 0.35)"
                      strokeDasharray="6 6"
                    />

                    <g className="point-front">
                      <circle cx={x} cy={frontY} r={9} fill="var(--primary-light)" />
                      <text
                        x={x}
                        y={frontY - 15}
                        textAnchor="middle"
                        className="point-label"
                        fill="var(--primary)"
                      >
                        <tspan>{point.id}</tspan>
                        <tspan>&prime;</tspan>
                      </text>
                    </g>

                    <g className="point-top">
                      <circle cx={x} cy={topY} r={9} fill="rgba(134, 239, 172, 0.6)" />
                      <text
                        x={x}
                        y={topY + 24}
                        textAnchor="middle"
                        className="point-label"
                        fill="#15803d"
                      >
                        {point.id}
                      </text>
                    </g>

                    {isCoincident && (
                      <text
                        x={x + 14}
                        y={topY - 18}
                        className="annotation"
                      >
                        Coincident views
                      </text>
                    )}
                  </Fragment>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="chart-card">
          <h2>Legend</h2>
          <div className="legend">
            {legendItems.map((item) => (
              <div className="legend-row" key={item.label}>
                <span
                  className="legend-color"
                  style={{ background: item.color }}
                  aria-hidden
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p>
            Quadrant badges in the table highlight how each point relates to the horizontal
            plane (HP) and vertical plane (VP). Use the diagram to see the exact placement of
            elevation and plan for quick verification.
          </p>
        </div>
      </section>

      <section className="chart-card">
        <h2>Projection Data</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Point</th>
              <th>Quadrant / Condition</th>
              <th>Front view (a&prime;)</th>
              <th>Top view (a)</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td>
                  <span className="badge">{point.id}</span>
                </td>
                <td>{point.description}</td>
                <td>
                  {point.front.relation === "on"
                    ? "On XY"
                    : `${point.front.distance} mm ${point.front.relation} XY`}
                </td>
                <td>
                  {point.top.relation === "on"
                    ? "On XY"
                    : `${point.top.distance} mm ${point.top.relation} XY`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
