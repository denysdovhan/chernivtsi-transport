export default function renderSVG({
  speed,
  stroke = 'gray',
  fill = 'white',
  text = 'A',
  angle
}) {
  const arrow = `
    <polygon
        points="55 20 45 25 55 0 65 25"
        stroke="${stroke}" fill="${fill}" stroke-width="2"
        transform="rotate(${angle},55,40)"/>
    `;
  const svg = `
    <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
      ${speed > 0 ? arrow : ''}
      <circle cx="55" cy="40" r="15" stroke="${stroke}" fill="${fill}" stroke-width="2"/>
      <text x="55" y="45" text-anchor="middle" font-size="15px" stroke="black" fill="black">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
