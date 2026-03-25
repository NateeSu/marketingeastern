import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import FolderCard from './components/FolderCard'
import SearchResultItem from './components/SearchResultItem'
import { SkeletonFolderCard, SkeletonResultItem } from './components/SkeletonCard'

const API_URL =
  'https://script.google.com/macros/s/AKfycbyaP9NKXQmMvH90rzLzoZI6KEW-d67Kvfm-QWW20iHg9Em31TaM2W6SYBTlelzSVp0xtA/exec'

const DEBOUNCE_MS = 400

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function App() {
  const STATIC_FOLDERS = [
    { name: 'ศูนย์บริหารข้อมูลลูกค้าและหนี้ (นตลอป.)', link: 'https://drive.google.com/drive/folders/1dYdCvLrzBkXKIaJ_WJvsCBrOiTQiA_ZU?usp=sharing', icon: '📈', status: 'show' },
    { name: 'ศููนย์บริหารโครงการและลูกค้าองค์กร (อตลอป.)', link: 'https://drive.google.com/drive/folders/1GYATTzfuTRG42pVuWmNr9Bsmx1LAUcYr?usp=sharing', icon: '📈', status: 'show' },
    { name: 'ศูนย์์บริหารงานลูกค้าทั่วไปและประชาสัมพันธ์ (ทตลอป.)', link: 'https://drive.google.com/drive/folders/1qMcn9AjIBNz0gWOH4gH2onHSbouSEKgs?usp=sharing', icon: '📈', status: 'show' },
  ]
  const [folders] = useState(STATIC_FOLDERS.filter((f) => f.status === 'show'))
  const foldersLoading = false
  const foldersError = null

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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #fef9ee 100%)' }}>

      {/* ── HERO HEADER ── */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c1008 0%, #3d2007 55%, #78350f 100%)' }}>
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #fcd34d, transparent 70%)' }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-8 pb-6">
          {/* Brand row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
              📁
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
                Marketing Eastern
              </h1>
              <p className="text-xs font-medium" style={{ color: '#fcd34d' }}>
                ระบบจัดการข้อมูลการตลาด
              </p>
            </div>
          </div>

          {/* Search */}
          <SearchBar value={query} onChange={setQuery} isLoading={showSearchSpinner} />
        </div>

        {/* bottom wave */}
        <svg viewBox="0 0 390 24" className="w-full block -mb-px" preserveAspectRatio="none" height="24">
          <path d="M0,12 C80,24 160,0 260,16 C320,24 360,8 390,12 L390,24 L0,24 Z"
                fill="#fffbeb" />
        </svg>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">

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
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-4 shadow-inner">
                  🔍
                </div>
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

        {/* FOLDER MODE */}
        {!isSearchMode && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">โฟลเดอร์ทั้งหมด</span>
              {!foldersLoading && folders.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {folders.length}
                </span>
              )}
            </div>

            {foldersLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => <SkeletonFolderCard key={i} />)}
              </div>
            )}

            {foldersError && !foldersLoading && (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-4">
                  😕
                </div>
                <p className="text-gray-800 font-bold mb-1">โหลดข้อมูลไม่สำเร็จ</p>
                <p className="text-gray-400 text-sm mb-5">{foldersError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 text-sm font-bold text-white rounded-2xl shadow-lg active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {!foldersLoading && !foldersError && folders.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-4">
                  📭
                </div>
                <p className="text-gray-700 font-semibold">ยังไม่มีโฟลเดอร์</p>
              </div>
            )}

            {!foldersLoading && folders.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {folders.map((folder, i) => (
                  <FolderCard key={folder.link || i} folder={folder} index={i} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs font-medium text-amber-400">
        Marketing Eastern © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
