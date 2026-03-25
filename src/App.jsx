import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [folders, setFolders] = useState([])
  const [foldersLoading, setFoldersLoading] = useState(true)
  const [foldersError, setFoldersError] = useState(null)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const abortRef = useRef(null)

  // Fetch folders on mount
  useEffect(() => {
    const controller = new AbortController()
    setFoldersLoading(true)
    setFoldersError(null)

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const visible = (data.folders || []).filter((f) => f.status === 'show')
        setFolders(visible)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setFoldersError('โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      })
      .finally(() => setFoldersLoading(false))

    return () => controller.abort()
  }, [])

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    // Cancel previous request
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
        if (err.name !== 'AbortError') {
          setSearchError('ค้นหาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        }
      })
      .finally(() => setSearchLoading(false))

    return () => controller.abort()
  }, [debouncedQuery])

  const isSearchMode = query.trim().length > 0
  const showSearchSpinner = searchLoading || (query !== debouncedQuery && query.trim().length > 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg shadow-md">
              📁
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Marketing Eastern</h1>
              <p className="text-xs text-gray-400 leading-none">ระบบจัดการเอกสาร</p>
            </div>
          </div>

          {/* Search */}
          <SearchBar
            value={query}
            onChange={setQuery}
            isLoading={showSearchSpinner}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">

        {/* ── SEARCH MODE ── */}
        {isSearchMode && (
          <section className="animate-fade-in">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              ผลการค้นหา
              {!searchLoading && searchResults.length > 0 && (
                <span className="ml-2 text-indigo-500">{searchResults.length} รายการ</span>
              )}
            </h2>

            {/* Loading skeletons */}
            {showSearchSpinner && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <SkeletonResultItem key={i} />)}
              </div>
            )}

            {/* Error */}
            {searchError && !searchLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl mb-3">⚠️</span>
                <p className="text-gray-500 text-sm">{searchError}</p>
              </div>
            )}

            {/* No results */}
            {!showSearchSpinner && !searchError && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-gray-700 font-semibold text-base mb-1">ไม่พบผลลัพธ์</p>
                <p className="text-gray-400 text-sm">ลองค้นหาด้วยคำอื่น หรือตรวจสอบตัวสะกด</p>
              </div>
            )}

            {/* Results list */}
            {!showSearchSpinner && searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((item, i) => (
                  <SearchResultItem key={item.id || i} item={item} index={i} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── FOLDER MODE ── */}
        {!isSearchMode && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              โฟลเดอร์ทั้งหมด
            </h2>

            {/* Loading skeletons */}
            {foldersLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => <SkeletonFolderCard key={i} />)}
              </div>
            )}

            {/* Error */}
            {foldersError && !foldersLoading && (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <span className="text-5xl mb-4">😕</span>
                <p className="text-gray-700 font-semibold mb-1">โหลดข้อมูลไม่สำเร็จ</p>
                <p className="text-gray-400 text-sm">{foldersError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {/* Empty */}
            {!foldersLoading && !foldersError && folders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
                <span className="text-5xl mb-4">📭</span>
                <p className="text-gray-700 font-semibold">ยังไม่มีโฟลเดอร์</p>
              </div>
            )}

            {/* Folder Grid */}
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
      <footer className="text-center py-4 text-xs text-gray-300">
        Marketing Eastern © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
