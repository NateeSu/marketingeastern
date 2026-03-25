import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import FolderCard from './components/FolderCard'
import SearchResultItem from './components/SearchResultItem'
import { SkeletonResultItem } from './components/SkeletonCard'

const API_URL =
  'https://script.google.com/macros/s/AKfycbyaP9NKXQmMvH90rzLzoZI6KEW-d67Kvfm-QWW20iHg9Em31TaM2W6SYBTlelzSVp0xtA/exec'

const DEBOUNCE_MS = 400

const FOLDER_GROUPS = [
  {
    group: 'เอกสารประชุม',
    groupIcon: '🗓️',
    folders: [
      { name: 'ประชุม ตลอป.', link: 'https://drive.google.com/drive/folders/1fGQ2f_cRZMDtgud4tzqiNLGh9pmyapXI?usp=drive_link', icon: '📋' },
    ],
  },
  {
    group: 'ข้อมูลแต่ละศูนย์',
    groupIcon: '🏢',
    folders: [
      { name: 'นตลอป.', link: 'https://drive.google.com/drive/folders/1dYdCvLrzBkXKIaJ_WJvsCBrOiTQiA_ZU?usp=drive_link', icon: '📊' },
      { name: 'อตลอป.', link: 'https://drive.google.com/drive/folders/1GYATTzfuTRG42pVuWmNr9Bsmx1LAUcYr?usp=drive_link', icon: '🏗️' },
      { name: 'ทตลอป.', link: 'https://drive.google.com/drive/folders/1qMcn9AjIBNz0gWOH4gH2onHSbouSEKgs?usp=drive_link', icon: '📣' },
    ],
  },
  {
    group: 'ข้อมูลแต่ละงาน/โครงการ',
    groupIcon: '📁',
    folders: [
      { name: 'NetAdd',           link: 'https://drive.google.com/drive/folders/1bSW5wwFWwXYpMYXHgujkX0y8L_pDzooL?usp=drive_link', icon: '📡' },
      { name: 'รายได้',           link: 'https://drive.google.com/drive/folders/1X_i4dAGYvX-eBuLDrMlNbehOnMGyMitI?usp=drive_link', icon: '💰' },
      { name: 'นิคมฯอุตสาหกรรม', link: 'https://drive.google.com/drive/folders/1tBFZbOMIzPmSkSJyS0P__96GxHDHSdEg?usp=drive_link', icon: '🏭' },
      { name: 'e-Office',         link: 'https://drive.google.com/drive/folders/1h-6kzvux3JbGLr874sJGXcETiFFeQMG1?usp=drive_link', icon: '💻' },
      { name: 'สพฐ.',             link: 'https://drive.google.com/drive/folders/1zGfTncyKq7c7r9EvHdmoa9Y7ymSzfZQa?usp=drive_link', icon: '🏫' },
    ],
  },
]

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const abortRef = useRef(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setSearchLoading(true)
    setSearchError(null)

    fetch(`${API_URL}?search=${encodeURIComponent(debouncedQuery.trim())}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setSearchResults(data.searchResults || [])
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setSearchError('ค้นหาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      })
      .finally(() => setSearchLoading(false))

    return () => controller.abort()
  }, [debouncedQuery])

  const isSearchMode = query.trim().length > 0
  const showSearchSpinner = searchLoading || (query !== debouncedQuery && query.trim().length > 0)

  // colorIndex across all groups for consistent card coloring
  let globalIdx = 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #fef9ee 100%)' }}>

      {/* ── HERO HEADER ── */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c1008 0%, #3d2007 55%, #78350f 100%)' }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #fcd34d, transparent 70%)' }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
              📁
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight tracking-tight">Marketing Eastern</h1>
              <p className="text-xs font-medium" style={{ color: '#fcd34d' }}>ระบบจัดการข้อมูลการตลาด</p>
            </div>
          </div>
          <SearchBar value={query} onChange={setQuery} isLoading={showSearchSpinner} />
        </div>

        <svg viewBox="0 0 390 24" className="w-full block -mb-px" preserveAspectRatio="none" height="24">
          <path d="M0,12 C80,24 160,0 260,16 C320,24 360,8 390,12 L390,24 L0,24 Z" fill="#fffbeb" />
        </svg>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-6">

        {/* SEARCH MODE */}
        {isSearchMode && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">ผลการค้นหา</span>
              {!showSearchSpinner && searchResults.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {searchResults.length} รายการ
                </span>
              )}
            </div>

            {showSearchSpinner && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <SkeletonResultItem key={i} />)}
              </div>
            )}

            {searchError && !searchLoading && (
              <div className="flex flex-col items-center py-14 text-center">
                <span className="text-5xl mb-3">⚠️</span>
                <p className="text-gray-500 text-sm">{searchError}</p>
              </div>
            )}

            {!showSearchSpinner && !searchError && searchResults.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-4 shadow-inner">🔍</div>
                <p className="text-gray-800 font-bold text-lg mb-1">ไม่พบผลลัพธ์</p>
                <p className="text-gray-400 text-sm">ลองค้นหาด้วยคำอื่น หรือตรวจสอบตัวสะกด</p>
              </div>
            )}

            {!showSearchSpinner && searchResults.length > 0 && (
              <div className="space-y-2.5">
                {searchResults.map((item, i) => (
                  <SearchResultItem key={item.id || i} item={item} index={i} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* FOLDER GROUPS MODE */}
        {!isSearchMode && FOLDER_GROUPS.map((group) => (
          <section key={group.group} className="animate-fade-in">
            {/* Group Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{group.groupIcon}</span>
              <h2 className="text-sm font-bold text-amber-800 tracking-tight">{group.group}</h2>
              <div className="flex-1 h-px bg-amber-200 ml-1" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                {group.folders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.folders.map((folder) => {
                const idx = globalIdx++
                return <FolderCard key={folder.link} folder={folder} index={idx} />
              })}
            </div>
          </section>
        ))}
      </main>

      <footer className="text-center py-5 text-xs font-medium text-amber-400">
        Marketing Eastern © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
