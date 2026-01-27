import fs from 'fs'
import path from 'path'

const replacements = [
  [/\btext-heading\b/g, 'text-foreground'],
  [/\btext-body\b/g, 'text-muted-foreground'],
  [/\btext-sub\b/g, 'text-muted-foreground'],
  [/\btext-greys-900\b/g, 'text-foreground'],
  [/\btext-greys-500\b/g, 'text-muted-foreground'],
  [/\bbg-greys-100\b/g, 'bg-muted'],
  [/\bbg-greys-50\b/g, 'bg-muted'],
  [/\bhover:bg-greys-100\b/g, 'hover:bg-muted'],
  [/\bhover:bg-greys-50\b/g, 'hover:bg-muted'],
  [/\bactive:bg-greys-200\b/g, 'active:bg-muted'],
  [/\btext-greys-700\b/g, 'text-foreground'],
  [/\bbg-base-muted\b/g, 'bg-muted'],
  [/\bbg-base-background\b/g, 'bg-background'],
  [/\bbg-surfaceSecondary\b/g, 'bg-muted'],
  [/\bborder-E5E7EB\b/g, 'border-border'],
  [/border-black\/5/g, 'border-border'],
  [/\brounded-card\b/g, 'rounded-lg'],
  [/\brounded-2xl\b/g, 'rounded-xl'],
  [/\btext-fluid-xs\b/g, 'text-xs'],
  [/\btext-fluid-sm\b/g, 'text-sm'],
  [/\btext-fluid-base\b/g, 'text-base'],
  [/\btext-fluid-lg\b/g, 'text-lg'],
  [/\btext-fluid-xl\b/g, 'text-xl'],
  [/\btext-fluid-2xl\b/g, 'text-2xl'],
  [/\bbg-\[#0470e9\]/g, 'bg-primary'],
  [/\bborder-\[#0470e9\]/g, 'border-primary'],
  [/hover:border-\[#0470e9\]\/30/g, 'hover:border-primary/30'],
  [/\bbg-\[#F8F8F8\]/g, 'bg-muted'],
  [/\bbg-\[#fef7ee\]/g, 'bg-amber-50'],
  [/\bmin-w-\[20px\]/g, 'min-w-5'],
  [/\btext-\[10px\]/g, 'text-xs'],
]

function walk(dir, cb) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory() && !f.startsWith('.')) walk(p, cb)
    else if (f.endsWith('.vue') || f.endsWith('.css')) cb(p)
  }
}

walk('src', (file) => {
  let s = fs.readFileSync(file, 'utf8')
  for (const [re, subst] of replacements) {
    s = s.replace(re, subst)
  }
  s = s.replace(/(class="[^"]*)\s*style="background-color: var\(--base-muted,\s*#f5f5f5\)"/g, (_, c) => c + ' bg-muted"')
  s = s.replace(/\s*style="background-color: var\(--base-muted,\s*#f5f5f5\)"/g, ' class="bg-muted"')
  s = s.replace(/data-\[state=on\]:border-\[1\.5px\]\s*data-\[state=on\]:border-\[#0470e9\]\s*data-\[state=on\]:bg-\[rgba\(4,112,233,0\.08\)\]\s*data-\[state=on\]:text-\[#0470e9\]/g, 'data-[state=on]:border-primary data-[state=on]:text-primary')
  s = s.replace(/data-\[state=on\]:border-\[#0470e9\]\s*data-\[state=on\]:bg-\[rgba\(4,112,233,0\.08\)\]\s*data-\[state=on\]:text-\[#0470e9\]/g, 'data-[state=on]:border-primary data-[state=on]:text-primary')
  s = s.replace(/\bh-\[2px\]\s*bg-\[#0470e9\]/g, 'h-0.5 bg-primary')
  s = s.replace(/(class="[^"]*)" class="bg-muted"/g, '$1 bg-muted"')
  fs.writeFileSync(file, s)
})

console.log('Token replacements done.')
