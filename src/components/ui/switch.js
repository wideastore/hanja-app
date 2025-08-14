import React from 'react'
export function Switch({checked=false, onCheckedChange, id}){
  return <input id={id} type="checkbox" className="range" checked={checked} onChange={e=>onCheckedChange && onCheckedChange(e.target.checked)} />
}