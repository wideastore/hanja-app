import React from 'react'
export function Tabs({defaultValue, children}){
  const [v, setV] = React.useState(defaultValue||'browse')
  return <div>{React.Children.map(children, child=>React.cloneElement(child, {value:v, setValue:setV}))}</div>
}
export function TabsList({children, value, setValue}){
  return <div className="tabs-triggers">{React.Children.map(children, ch=>React.cloneElement(ch, {value, setValue}))}</div>
}
export function TabsTrigger({children, tab, value, setValue}){
  const active = value===tab
  return <button className={'tabs-trigger'+(active?' active':'')} onClick={()=>setValue(tab)}>{children}</button>
}
export function TabsContent({children, when, value}){
  if (value!==when) return null
  return <div>{children}</div>
}