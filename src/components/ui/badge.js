import React from 'react'
export function Badge({children, className='', variant='secondary'}){
  const v = variant==='outline' ? 'badge badge-outline' : 'badge badge-secondary'
  return <span className={v + (className?' '+className:'')}>{children}</span>
}