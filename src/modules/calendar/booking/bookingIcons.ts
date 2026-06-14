export function bookingIconsScript(): string {
  return `
function iconCalendar(size = 24) {
  return \`
    <svg
      width="\${size}"
      height="\${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  \`;
}

function iconCheck(size = 24) {
  return \`
    <svg
      width="\${size}"
      height="\${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  \`;
}

function iconBolt(size = 24) {
  return \`
    <svg
      width="\${size}"
      height="\${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  \`;
}

function iconClock(size = 24) {
  return \`
    <svg
      width="\${size}"
      height="\${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  \`;
}

function iconArrowLeft(size = 24) {
  return \`
    <svg
      width="\${size}"
      height="\${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  \`;
}
`;
}