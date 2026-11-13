// Placeholder illustrations in brand colours.
// Replace with real product photos once you have them (Phase 3: uploaded from the dashboard).

const LEAF = "M0 0 C 26 -34 28 -86 0 -128 C -28 -86 -26 -34 0 0 Z";
const ROUND = "M0 0 C 30 -10 34 -50 0 -64 C -34 -50 -30 -10 0 0 Z";

function Leaf({ x = 200, y = 280, angle = 0, scale = 1, fill, d = LEAF, delay = 0, grow = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <g className={grow ? "leaf-grow" : undefined} style={grow ? { animationDelay: `${delay}ms` } : undefined}>
        <path d={d} fill={fill} />
        <path d="M0 -4 L0 -100" stroke="#fff" strokeOpacity=".28" strokeWidth="2" fill="none" />
      </g>
    </g>
  );
}

function Pot({ x = 200, y = 280, w = 120, color = "#FAF9F6" }) {
  const h = w * 0.82;
  return (
    <g>
      <path d={`M${x - w / 2} ${y} H${x + w / 2} L${x + w / 2 - 14} ${y + h} H${x - w / 2 + 14} Z`} fill={color} />
      <rect x={x - w / 2 - 6} y={y - 12} width={w + 12} height="22" rx="8" fill={color} />
      <rect x={x - w / 2 - 6} y={y + 4} width={w + 12} height="6" fill="#26332C" opacity=".08" />
    </g>
  );
}

export default function PlantArt({ kind = "artificial", tint = "#EFEBDD", className = "", grow = false }) {
  const g1 = "#0B5D3B", g2 = "#2E7D32", g3 = "#A7D129";
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Product illustration" preserveAspectRatio="xMidYMid slice">
      {kind === "hero" ? (
        <>
          <rect width="400" height="400" fill={g1} />
          <circle cx="200" cy="225" r="140" fill="#fff" opacity=".06" />
          {[
            [-62, 1.05, g2, 0], [62, 1.05, g2, 120], [-38, 1.25, g3, 240], [38, 1.2, g3, 360],
            [-16, 1.4, "#3F9A47", 480], [16, 1.32, "#3F9A47", 600], [0, 1.1, g3, 720],
          ].map(([a, s, f, d], i) => (
            <Leaf key={i} x={200} y={238} angle={a} scale={s * 0.92} fill={f} delay={d} grow={grow} />
          ))}
          <Pot x={200} y={234} w={130} />
        </>
      ) : (
        <>
          <rect width="400" height="400" fill={tint} />
          <circle cx="200" cy="210" r="135" fill="#fff" opacity=".5" />
          {kind === "artificial" && (
            <>
              {[[-55, .9, g3], [55, .9, g3], [-28, 1.1, g2], [28, 1.1, g2], [0, 1.2, g1]].map(([a, s, f], i) => (
                <Leaf key={i} y={262} angle={a} scale={s} fill={f} d={ROUND} />
              ))}
              <Pot y={256} w={116} color="#FFFFFF" />
              <rect x="140" y="288" width="120" height="3" fill="#A7D129" />
            </>
          )}
          {kind === "pot" && (
            <>
              <Leaf y={210} angle={-20} scale={.55} fill={g2} />
              <Leaf y={210} angle={22} scale={.5} fill={g3} />
              <Pot y={206} w={170} color="#FFFFFF" />
            </>
          )}
          {kind === "tool" && (
            <g>
              <path d="M130 170 H250 L262 300 H118 Z" fill={g1} />
              <path d="M250 200 L322 150 L332 162 L258 236 Z" fill={g1} />
              <rect x="316" y="140" width="28" height="12" rx="5" fill={g2} transform="rotate(-28 330 146)" />
              <path d="M130 188 C 70 180 70 270 126 262" fill="none" stroke={g2} strokeWidth="14" strokeLinecap="round" />
              <rect x="124" y="160" width="132" height="14" rx="7" fill={g2} />
              <path d="M130 215 H252" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
            </g>
          )}
        </>
      )}
    </svg>
  );
}
