import React from 'react'
export function Card({children, className='', ...props}){
  return <div className={'card'+(className?' '+className:'')} {...props}>{children}</div>
}
export function CardHeader({children, className='', ...props}){
  return <div className={'card-header'+(className?' '+className:'')} {...props}>{children}</div>
}
export function CardTitle({children, className='', ...props}){
  return <div className={'card-title'+(className?' '+className:'')} {...props}>{children}</div>
}
export function CardContent({children, className='', ...props}){
  return <div className={'card-content'+(className?' '+className:'')} {...props}>{children}</div>
}