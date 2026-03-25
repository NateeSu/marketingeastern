export default function SearchBar({ value, onChange, isLoading }) {
  return (
    <div className="relative w-full">
      {/* Icon left */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" style={{ color: '#f59e0b' }}
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหาเอกสาร, โฟลเดอร์..."
        className="
          w-full pl-12 pr-10 py-3.5
          rounded-2xl text-sm font-medium
          text-gray-900 placeholder-gray-400
          border-0 outline-none
          transition-all duration-200
        "
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 0 0 1.5px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.15)',
          color: '#fff',
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = 'inset 0 0 0 2px rgba(251,191,36,0.9), 0 4px 20px rgba(0,0,0,0.2)'
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'inset 0 0 0 1.5px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.15)'
        }}
      />

      {/* Placeholder color hack via style tag */}
      <style>{`
        input[type="search"]::placeholder { color: rgba(253,230,138,0.6); }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
      `}</style>

      {/* Clear */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center px-1 text-amber-300 hover:text-amber-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
