import re

with open('src/components/pages/DLPAPage.tsx', 'r') as f:
    content = f.read()

# 1. Update ScoreRing font size
score_ring_find = """        <text x="48" y="48" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: '16px', fontWeight: 800, fill: stroke }}>"""
score_ring_replace = """        <text x="48" y="48" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: '24px', fontWeight: 800, fill: stroke }}>"""
content = content.replace(score_ring_find, score_ring_replace)

# 2. Update Governance Radar layout and styling
# We want to change `<div className="space-y-3 flex-1 relative z-10">`
# to `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">`
content = content.replace(
    '<div className="space-y-3 flex-1 relative z-10">',
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">'
)

# And map badgeColor properly in the render loop.
item_find = """                ].map(({ label, value, badge, badgeColor, icon: Icon, formula }) => (
                  <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-white/10 transition-colors backdrop-blur-sm">"""
item_replace = """                ].map(({ label, value, badge, badgeColor, icon: Icon, formula }) => {
                  const darkBadgeColor = badgeColor.replace('700', '400').replace('600', '400').replace(/bg-[a-z]+-50/g, 'bg-white/5').replace(/border-[a-z]+-200/g, 'border-white/10').replace(/border-[a-z]+-100/g, 'border-white/10');
                  return (
                  <div key={label} className="p-5 bg-white/[0.03] rounded-2xl border border-white/10 flex flex-col gap-3 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md shadow-lg group">"""
content = content.replace(item_find, item_replace)

# End the map properly (change `))} ` to `})}` since we added `{ return ... }`)
# Let's find the end of the map.
# It ends with:
end_map_find = """                    )}
                  </div>
                ))}"""
end_map_replace = """                    )}
                  </div>
                  );
                })}"""
content = content.replace(end_map_find, end_map_replace)

# Replace the inner item content styling
inner_item_find = """                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                          <Icon size={14} className="text-white/70" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                          <p className={cn('text-xs font-bold mt-0.5', badgeColor)}>{badge}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-white">{value}</p>
                    </div>
                    {formula && (
                      <p className="text-[9px] font-mono text-white/55 bg-white/5 p-2 rounded border border-white/10 leading-normal whitespace-pre-wrap">
                        {formula}
                      </p>
                    )}"""
inner_item_replace = """                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                          <Icon size={18} className="text-white/80" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em] mb-0.5">{label}</p>
                          <p className={cn('text-xs font-bold px-2 py-0.5 rounded border inline-block mt-1', darkBadgeColor)}>{badge}</p>
                        </div>
                      </div>
                      <p className="text-xl font-black text-white tracking-tight">{value}</p>
                    </div>
                    {formula && (
                      <p className="text-[10px] font-mono text-white/40 bg-black/20 p-2.5 rounded-lg border border-white/5 leading-relaxed whitespace-pre-wrap mt-1">
                        {formula}
                      </p>
                    )}"""
content = content.replace(inner_item_find, inner_item_replace)

# 3. Remove Semantic Source ELSA rendering
semantic_find = """                {semanticSource && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Fonte Semântica: {semanticSource}
                    </span>
                  </div>
                )}"""
content = content.replace(semantic_find, "")

with open('src/components/pages/DLPAPage.tsx', 'w') as f:
    f.write(content)

print("Modifications done!")
