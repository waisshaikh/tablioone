import React from 'react'
export default function CategoryFilter({ categories, active, setActive }){
  return (
    <div className="flex gap-2 overflow-auto">
      <button onClick={()=>setActive('All')} className={`px-3 py-1 rounded ${active==='All' ? 'bg-sky-500 text-white' : 'bg-white/80'}`}>All</button>
      {categories.map(c=> (
        <button key={c} onClick={()=>setActive(c)} className={`px-3 py-1 rounded ${active===c ? 'bg-sky-500 text-white' : 'bg-white/80'}`}>{c}</button>
      ))}
    </div>
  )
}