import React from 'react'
export default function Footer(){
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 py-8">
      <div className="container mx-auto text-center text-sm">© {new Date().getFullYear()} TablioOne — All rights reserved</div>
    </footer>
  )
}