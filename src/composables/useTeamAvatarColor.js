const TEAM_AVATAR_PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-orange-100 text-orange-700',
  'bg-slate-100 text-slate-700',
  'bg-teal-100 text-teal-700'
]

const KNOWN_TEAM_COLORS = {
  BDC: 'bg-blue-100 text-blue-700',
  'Call Center': 'bg-sky-100 text-sky-700',
  General: 'bg-slate-100 text-slate-700',
  Service: 'bg-emerald-100 text-emerald-700',
  'Sales (New)': 'bg-violet-100 text-violet-700',
  'Sales (Rent)': 'bg-amber-100 text-amber-700',
  'Sales (Used)': 'bg-orange-100 text-orange-700'
}

function hashString(str) {
  if (!str) return 0
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function getTeamAvatarClass(teamName) {
  if (!teamName) return 'bg-muted text-muted-foreground'
  const known = KNOWN_TEAM_COLORS[teamName]
  if (known) return known
  const index = hashString(teamName) % TEAM_AVATAR_PALETTE.length
  return TEAM_AVATAR_PALETTE[index]
}
