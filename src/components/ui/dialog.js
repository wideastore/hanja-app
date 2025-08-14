import React from 'react'
export function Dialog({open, children}){ return <>{open && children}</> }
export function DialogContent({children, className=''}){
  return <div className="dialog-backdrop"><div className={'dialog-panel '+className}>{children}</div></div>
}
export function DialogHeader({children}){ return <div style={{marginBottom:8}}>{children}</div> }
export function DialogTitle({children}){ return <div className="text-xl" style={{fontWeight:600}}>{children}</div> }
export function DialogDescription({children}){ return <div className="text-sm text-muted">{children}</div> }