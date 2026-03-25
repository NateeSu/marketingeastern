const FILE_CONFIG = {
  folder:       { icon: '📁', label: 'Folder',  bg: '#fef3c7', color: '#b45309' },
  spreadsheet:  { icon: '📊', label: 'Sheet',   bg: '#dcfce7', color: '#15803d' },
  presentation: { icon: '📊', label: 'Slides',  bg: '#fff7ed', color: '#c2410c' },
  document:     { icon: '📄', label: 'Doc',     bg: '#eff6ff', color: '#1d4ed8' },
  pdf:          { icon: '📕', label: 'PDF',     bg: '#fee2e2', color: '#b91c1c' },
  image:        { icon: '🖼️', label: 'Image',  bg: '#fdf4ff', color: '#7e22ce' },
  video:        { icon: '🎬', label: 'Video',   bg: '#f0fdf4', color: '#166534' },
  default:      { icon: '📎', label: 'File',    bg: '#f9fafb', color: '#374151' },
}

function getConfig(mimeType = '', fileName = '') {
  const t = (mimeType + fileName).toLowerCase()
  if (t.includes('folder'))        return FILE_CONFIG.folder
  if (t.includes('spreadsheet') || t.includes('xlsx') || t.includes('xls')) return FILE_CONFIG.spreadsheet
  if (t.includes('presentation') || t.includes('pptx') || t.includes('ppt')) return FILE_CONFIG.presentation
  if (t.includes('document') || t.includes('docx') || t.includes('doc'))    return FILE_CONFIG.document
  if (t.includes('pdf'))           return FILE_CONFIG.pdf
  if (t.includes('image') || t.includes('jpg') || t.includes('png'))        return FILE_CONFIG.image
  if (t.includes('video') || t.includes('mp4'))                             return FILE_CONFIG.video
  return FILE_CONFIG.default
}

export default function SearchResultItem({ item, index }) {
  const cfg = getConfig(item.mimeType, item.name)

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border animate-slide-up group"
      style={{
        borderColor: '#fde68a',
        boxShadow: '0 2px 8px rgba(251,191,36,0.08)',
        animationDelay: `${index * 30}ms`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.18)'
        e.currentTarget.style.borderColor = '#fbbf24'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(251,191,36,0.08)'
        e.currentTarget.style.borderColor = '#fde68a'
      }}
    >
      {/* File icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: cfg.bg }}
      >
        {cfg.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        {item.folder && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">📁 {item.folder}</p>
        )}
      </div>

      {/* Badge + arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
        <svg className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}
