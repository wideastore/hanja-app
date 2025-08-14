import React from 'react'
import './index.css'

import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { Switch } from './components/ui/switch'
import { Label } from './components/ui/label'

const SAMPLE_RADICALS = [
  { id: 1, char: '一', strokes: 1, meaning_ko: '한', meaning_en: 'one', pinyin: 'yī', examples: ['三','天','正'] },
  { id: 2, char: '丨', strokes: 1, meaning_en: 'line', pinyin: 'gǔn' },
  { id: 3, char: '丶', strokes: 1, meaning_ko: '점', meaning_en: 'dot', pinyin: 'zhǔ' },
  { id: 4, char: '丿', strokes: 1, meaning_en: 'slash', pinyin: 'piě' },
  { id: 5, char: '乙', strokes: 1, meaning_en: 'second', pinyin: 'yǐ', examples: ['乞','九'] },
  { id: 6, char: '亅', strokes: 1, meaning_en: 'hook', pinyin: 'jué' },
  { id: 7, char: '二', strokes: 2, meaning_en: 'two', pinyin: 'èr' },
  { id: 8, char: '亠', strokes: 2, meaning_en: 'lid', pinyin: 'tóu', examples: ['京','高','交'] },
  { id: 9, char: '人', strokes: 2, meaning_ko: '사람', meaning_en: 'person', pinyin: 'rén', variants: ['亻'], examples: ['你','他','仁'] },
  { char: '亻', strokes: 2, meaning_en: 'person (side)', pinyin: 'rén' },
  { id: 40, char: '口', strokes: 3, meaning_ko: '입', meaning_en: 'mouth', pinyin: 'kǒu', examples: ['品','唱','和'] },
  { id: 42, char: '土', strokes: 3, meaning_ko: '흙', meaning_en: 'earth', pinyin: 'tǔ', examples: ['在','地','城'] },
  { id: 47, char: '大', strokes: 3, meaning_ko: '큰', meaning_en: 'big', pinyin: 'dà', examples: ['天','太','因'] },
  { id: 48, char: '女', strokes: 3, meaning_ko: '여자', meaning_en: 'woman', pinyin: 'nǚ', examples: ['好','妈','姓'] },
  { id: 78, char: '心', strokes: 4, meaning_ko: '마음', meaning_en: 'heart', pinyin: 'xīn', variants: ['忄'], examples: ['想','您','情'] },
  { char: '忄', strokes: 3, meaning_en: 'heart (side)', pinyin: 'xīn' },
  { id: 81, char: '手', strokes: 4, meaning_ko: '손', meaning_en: 'hand', pinyin: 'shǒu', variants: ['扌'], examples: ['打','提','拿'] },
  { char: '扌', strokes: 3, meaning_en: 'hand (side)', pinyin: 'shǒu' },
  { id: 92, char: '日', strokes: 4, meaning_ko: '해', meaning_en: 'sun', pinyin: 'rì', examples: ['明','時','早'] },
  { id: 94, char: '月', strokes: 4, meaning_ko: '달', meaning_en: 'moon; flesh', pinyin: 'yuè', examples: ['期','服','腦'] },
  { id: 95, char: '木', strokes: 4, meaning_ko: '나무', meaning_en: 'wood', pinyin: 'mù', examples: ['林','想','校'] },
  { id: 104, char: '水', strokes: 4, meaning_ko: '물', meaning_en: 'water', pinyin: 'shuǐ', variants: ['氵'], examples: ['河','海','酒'] },
  { char: '氵', strokes: 3, meaning_en: 'water (side)', pinyin: 'shuǐ' },
  { id: 213, char: '金', strokes: 8, meaning_ko: '쇠', meaning_en: 'metal', pinyin: 'jīn', variants: ['钅'], examples: ['錢','銀','鐵'] },
  { id: 219, char: '雨', strokes: 8, meaning_ko: '비', meaning_en: 'rain', pinyin: 'yǔ' },
  { id: 233, char: '馬', strokes: 10, meaning_ko: '말', meaning_en: 'horse', pinyin: 'mǎ', variants: ['马'] },
]

function includesInsensitive(hay, needle){ return (hay||'').toLowerCase().includes((needle||'').toLowerCase()) }

function useBookmarks(){
  const [bookmarks, setBookmarks] = React.useState([])
  React.useEffect(()=>{ try{ const raw=localStorage.getItem('hanja-radicals-bookmarks-v1'); if(raw) setBookmarks(JSON.parse(raw)) }catch{} },[])
  React.useEffect(()=>{ try{ localStorage.setItem('hanja-radicals-bookmarks-v1', JSON.stringify(bookmarks)) }catch{} },[bookmarks])
  const toggle = (ch)=> setBookmarks(prev => prev.includes(ch) ? prev.filter(x=>x!==ch) : [...prev, ch])
  const isMarked = (ch)=> bookmarks.includes(ch)
  return { bookmarks, toggle, isMarked }
}

function useRadicals(){
  const [radicals, setRadicals] = React.useState(SAMPLE_RADICALS)
  const [sourceName, setSourceName] = React.useState('내장 샘플')
  return { radicals, setRadicals, sourceName, setSourceName }
}

async function readFileAsJSON(file){
  const text = await file.text()
  const data = JSON.parse(text)
  if (!Array.isArray(data)) throw new Error('JSON 배열 형식이어야 합니다.')
  return data
}
function parseCSV(text){
  const lines = text.replace(/\r/g,'').split('\n').filter(Boolean)
  const header = lines[0].split(',').map(s=>s.trim())
  const idx = (k)=> header.indexOf(k)
  const out = []
  for (let i=1;i<lines.length;i++){
    const cols = lines[i].split(',').map(s=>s.trim())
    const item = {
      char: cols[idx('char')],
      strokes: Number(cols[idx('strokes')]||'') || undefined,
      meaning_ko: cols[idx('meaning_ko')] || undefined,
      meaning_en: cols[idx('meaning_en')] || undefined,
      pinyin: cols[idx('pinyin')] || undefined,
      id: Number(cols[idx('id')]||'') || undefined,
    }
    const v = cols[idx('variants')]
    const e = cols[idx('examples')]
    if (v) item.variants = v.split(';').map(s=>s.trim()).filter(Boolean)
    if (e) item.examples = e.split(';').map(s=>s.trim()).filter(Boolean)
    if (item.char) out.push(item)
  }
  return out
}

export default function App(){
  const { radicals, setRadicals, sourceName, setSourceName } = useRadicals()
  const { bookmarks, toggle, isMarked } = useBookmarks()

  const [filters, setFilters] = React.useState({
    q: '', strokeMin: 1, strokeMax: 20, sortBy: 'kangxi', lang: 'ko', showVariants: true, onlyBookmarked: false
  })
  const [detail, setDetail] = React.useState(undefined)
  const [open, setOpen] = React.useState(false)

  const list = React.useMemo(()=>{
    const q = (filters.q||'').trim()
    let base = radicals
    if (filters.onlyBookmarked) base = base.filter(r => bookmarks.includes(r.char))
    if (q){
      base = base.filter(r => (
        includesInsensitive(r.char, q) ||
        includesInsensitive(r.meaning_ko, q) ||
        includesInsensitive(r.meaning_en, q) ||
        String(r.id||'').startsWith(q)
      ))
    }
    base = base.filter(r => {
      const s = r.strokes || 0
      return s===0 || (s >= filters.strokeMin && s <= filters.strokeMax)
    })
    // uniq by char
    const seen = new Set()
    base = base.filter(r => { if (seen.has(r.char)) return false; seen.add(r.char); return true })
    // sort
    if (filters.sortBy==='kangxi') base.sort((a,b)=>(a.id||9999)-(b.id||9999) || a.char.localeCompare(b.char))
    else if (filters.sortBy==='strokes') base.sort((a,b)=>(a.strokes||999)-(b.strokes||999) || a.char.localeCompare(b.char))
    else base.sort((a,b)=>a.char.codePointAt(0)-b.char.codePointAt(0))
    return base
  }, [radicals, filters, bookmarks])

  async function handleFile(e){
    const f = e.target.files?.[0]; if (!f) return;
    try{
      const ext = f.name.split('.').pop()?.toLowerCase()
      let data = []
      if (ext==='json') data = await readFileAsJSON(f)
      else if (ext==='csv') data = parseCSV(await f.text())
      else throw new Error('.json 또는 .csv 파일을 올려주세요.')
      setRadicals(data); setSourceName(f.name)
    }catch(err){ alert((err&&err.message)||'파일을 불러오지 못했습니다.') }
    finally{ e.currentTarget.value = '' }
  }
  function resetToSample(){ setRadicals(SAMPLE_RADICALS); setSourceName('내장 샘플') }
  function openDetail(item){ setDetail(item); setOpen(true) }

  return (
    <div>
      <div className="container">
        <div className="header">
          <div className="title">한자 부수 탐색기</div>
          <div className="subtitle">검색, 필터, 즐겨찾기, 퀴즈까지 한 화면에서 이용하실 수 있습니다.</div>
        </div>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger tab="browse">찾아보기</TabsTrigger>
            <TabsTrigger tab="quiz">퀴즈</TabsTrigger>
            <TabsTrigger tab="import">데이터 불러오기</TabsTrigger>
          </TabsList>

          <TabsContent when="browse" className="space-y-4 mt-4">
            <Card>
              <CardContent>
                <div className="grid" style={{gridTemplateColumns:'1fr 200px 200px', gap:12, marginTop:16}}>
                  <Input placeholder="부수, 뜻, 번호 검색" value={filters.q} onChange={e=>setFilters({...filters, q: e.target.value})} />
                  <select className="select"
                    value={filters.sortBy} onChange={e=>setFilters({...filters, sortBy: e.target.value})}>
                    <option value="kangxi">부수 번호</option>
                    <option value="strokes">획수</option>
                    <option value="unicode">유니코드</option>
                  </select>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Switch id="onlybm" checked={filters.onlyBookmarked} onCheckedChange={(v)=>setFilters({...filters, onlyBookmarked: v})} />
                    <Label htmlFor="onlybm">즐겨찾기만</Label>
                  </div>
                </div>

                <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, marginTop:12}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Label>획수 범위</Label>
                    <input className="range" type="range" min={1} max={20} value={filters.strokeMin} onChange={e=>setFilters({...filters, strokeMin: Number(e.target.value)})} />
                    <span>{filters.strokeMin}</span>
                    <span style={{padding:'0 8px'}}>~</span>
                    <input className="range" type="range" min={1} max={20} value={filters.strokeMax} onChange={e=>setFilters({...filters, strokeMax: Number(e.target.value)})} />
                    <span>{filters.strokeMax}</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Label>표시 언어</Label>
                    <select className="select" value={filters.lang} onChange={e=>setFilters({...filters, lang: e.target.value})}>
                      <option value="ko">한국어 우선</option>
                      <option value="en">영어 우선</option>
                    </select>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <input id="variants" type="checkbox" checked={filters.showVariants} onChange={e=>setFilters({...filters, showVariants: e.target.checked})} />
                    <Label htmlFor="variants">변형 함께 표시</Label>
                  </div>
                  <div style={{marginLeft:'auto', display:'flex', gap:8}}>
                    <Button className="btn-outline" onClick={()=>{
                      const blob = new Blob([JSON.stringify(list, null, 2)], {type:'application/json'})
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url; a.download = 'radicals-filtered.json'; a.click()
                      setTimeout(()=>URL.revokeObjectURL(url), 1000)
                    }}>필터 결과 저장</Button>
                    <Button className="btn-secondary" onClick={resetToSample}>샘플로 초기화</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-2 grid-3 grid-4 grid-6" style={{gap:12, marginTop:12}}>
              {list.map(r => (
                <button key={r.char} onClick={()=>openDetail(r)} style={{textAlign:'left', background:'transparent', border:0}}>
                  <Card className="hover">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-3xl" style={{fontWeight:400}}>{r.char}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                        {typeof r.id!=='undefined' && <Badge variant="secondary">#{r.id}</Badge>}
                        {typeof r.strokes!=='undefined' && <Badge variant="outline">{r.strokes}획</Badge>}
                        {isMarked(r.char) && <Badge>즐겨찾기</Badge>}
                      </div>
                      <div className="text-muted" style={{marginTop:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                        {filters.lang==='ko' ? (r.meaning_ko || r.meaning_en || '') : (r.meaning_en || r.meaning_ko || '')}
                      </div>
                      {filters.showVariants && r.variants?.length ? (
                        <div style={{display:'flex', flexWrap:'wrap', gap:4, marginTop:4}}>
                          {r.variants.map(v => <Badge key={v} variant="outline" className="text-base">{v}</Badge>)}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>

            <Dialog open={open}>
              {detail && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{detail.char} 부수 정보</DialogTitle>
                    <DialogDescription>필요하신 경우 즐겨찾기로 보관하실 수 있습니다.</DialogDescription>
                  </DialogHeader>
                  <div className="grid" style={{gridTemplateColumns:'1fr 2fr', gap:12}}>
                    <div className="card" style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, padding:16, background:'#f3f4f6'}}> {detail.char} </div>
                    <div>
                      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8, fontSize:14}}>
                        <div>
                          <div className="text-muted">뜻(한국어)</div>
                          <div>{detail.meaning_ko || '정보 없음'}</div>
                        </div>
                        <div>
                          <div className="text-muted">뜻(영어)</div>
                          <div>{detail.meaning_en || '정보 없음'}</div>
                        </div>
                        <div>
                          <div className="text-muted">획수</div>
                          <div>{detail.strokes || '정보 없음'}</div>
                        </div>
                        <div>
                          <div className="text-muted">부수 번호</div>
                          <div>{detail.id || '정보 없음'}</div>
                        </div>
                        <div>
                          <div className="text-muted">유니코드</div>
                          <div>{'U+' + detail.char.codePointAt(0).toString(16).toUpperCase()}</div>
                        </div>
                        <div>
                          <div className="text-muted">병음</div>
                          <div>{detail.pinyin || '정보 없음'}</div>
                        </div>
                      </div>
                      <div style={{marginTop:8}}>
                        <div className="text-muted" style={{fontSize:14}}>변형·대체자</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                          {(detail.variants && detail.variants.length ? detail.variants : ['정보 없음']).map((v,i)=>(
                            <Badge key={i} variant="secondary">{v}</Badge>
                          ))}
                        </div>
                      </div>
                      <div style={{marginTop:8}}>
                        <div className="text-muted" style={{fontSize:14}}>예시 한자</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                          {(detail.examples && detail.examples.length ? detail.examples : ['정보 없음']).map((v,i)=>(
                            <Badge key={i} variant="outline">{v}</Badge>
                          ))}
                        </div>
                      </div>
                      <div style={{display:'flex', gap:8, marginTop:8}}>
                        <Button onClick={()=>navigator.clipboard.writeText(detail.char)}>부수 복사</Button>
                        <Button className="btn-outline" onClick={()=>toggle(detail.char)}>{isMarked(detail.char)?'즐겨찾기 해제':'즐겨찾기 추가'}</Button>
                        <Button onClick={()=>{ setOpen(false); }}>닫기</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </TabsContent>

          <TabsContent when="quiz" className="mt-4">
            <Card>
              <CardHeader><CardTitle>퀴즈</CardTitle></CardHeader>
              <CardContent>
                {/* simple quiz */}
                <Quiz pool={list.length ? list : radicals} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent when="import" className="mt-4">
            <Card>
              <CardHeader><CardTitle>데이터 파일 불러오기</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted">.json 또는 .csv 파일을 불러올 수 있습니다. JSON은 배열이어야 하며, CSV 헤더는 char,strokes,meaning_ko,meaning_en,pinyin,variants,examples,id 순서를 권장합니다. variants와 examples는 세미콜론으로 구분합니다.</p>
                <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                  <input type="file" accept=".json,.csv" onChange={handleFile} />
                  <div className="text-sm text-muted">현재 데이터: {sourceName}</div>
                </div>
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <Button onClick={()=>{
                    const blob = new Blob([JSON.stringify(SAMPLE_RADICALS, null, 2)], {type:'application/json'})
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url; a.download = 'radicals-sample.json'; a.click()
                    setTimeout(()=>URL.revokeObjectURL(url), 1000)
                  }}>샘플 JSON 저장</Button>
                  <Button className="btn-outline" onClick={resetToSample}>샘플 불러오기</Button>
                </div>
                <div style={{marginTop:12}}>
                  <div className="card" style={{padding:12}}>
                    <div className="text-sm text-muted">CSV 예시</div>
                    <pre style={{whiteSpace:'pre-wrap', fontSize:12}}>{`char,strokes,meaning_ko,meaning_en,pinyin,variants,examples,id
一,1,한,one,yi,,,
亻,2,,person (side),ren,,仁;他;
口,3,입,mouth,kou,,唱;品;和,40
金,8,쇠,metal,jin,钅,錢;銀;鐵,213
辶,3,,walk (movement),chuo,,近;這;過,
`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="footer">
          데이터 출처가 혼재할 수 있으므로 학습·연구용으로 사용해 주십시오. 필요 시 사용자 파일로 정확한 표기를 교체하실 수 있습니다.
        </div>
      </div>
    </div>
  )
}

function Quiz({ pool }){
  const [index, setIndex] = React.useState(0)
  const [show, setShow] = React.useState(false)
  const [mode, setMode] = React.useState('meaning')
  const q = pool[(index % pool.length) || 0]
  function next(){ setIndex(i => (i+1) % pool.length); setShow(false) }
  return (
    <div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <Label>형식</Label>
        <select className="select" value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="meaning">뜻 맞히기</option>
          <option value="strokes">획수 맞히기</option>
        </select>
        <Button className="btn-outline" onClick={next}>다음</Button>
        <Button onClick={()=>setShow(s=>!s)}>{show?'가리기':'정답 보기'}</Button>
      </div>
      <div style={{display:'flex', justifyContent:'center', fontSize:72, padding:'24px 0'}}>{q && q.char}</div>
      <div className="text-lg" style={{textAlign:'center'}}>
        {mode==='meaning' ? (
          show ? <div><div>한국어: {q.meaning_ko || '정보 없음'}</div><div>영어: {q.meaning_en || '정보 없음'}</div></div> : '뜻을 생각해 보세요.'
        ) : (
          show ? <div>획수: {q.strokes || '정보 없음'}</div> : '획수를 생각해 보세요.'
        )}
      </div>
    </div>
  )
}