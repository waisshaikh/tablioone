import React from 'react'

export default function FactBox({ fact }){
  return (
    <div className="p-4 bg-white/80 backdrop-blur rounded shadow">
      <p className="font-semibold">Daily Seafood Fact</p>
      <p className="mt-2">{fact.en}</p>
      <p className="mt-1 text-sm text-slate-600">{fact.mr}</p>
    </div>
  )
}