import React from 'react'
export function Button({children, className='', variant, ...props}){
  const v = variant==='secondary' ? 'btn btn-secondary' : variant==='outline' ? 'btn btn-outline' : 'btn'
  return <button className={v + (className?' '+className:'')} {...props}>{children}</button>
}