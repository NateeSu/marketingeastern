const FILE_ICONS = {
  // Docs
  document: '📄',
  doc: '📄',
  docx: '📄',
  // Spreadsheets
  spreadsheet: '📊',
  xls: '📊',
  xlsx: '📊',
  // Presentations
  presentation: '📊',
  ppt: '📊',
  pptx: '📊',
  // PDFs
  pdf: '📕',
  // Images
  image: '🖼️',
  jpg: '🖼️',
  png: '🖼️',
  // Videos
  video: '🎬',
  mp4: '🎬',
  // Audio
  audio: '🎵',
  mp3: '🎵',
  // Folders
  folder: '📁',
  // Default
  default: '📎',
}

function getFileIcon(mimeType = '', fileName = '') {
  const type = (mimeType + fileName).toLowerCase()
  if (type.includes('folder')) return FILE_ICONS.folder
  if (type.includes('spreadsheet') || type.includes('xlsx') || type.includes('xls')) return FILE_ICONS.spreadsheet
  if (type.includes('presentation') || type.includes('pptx') || type.includes('ppt')) return FILE_ICONS.presentation
  if (type.includes('document') || type.includes('docx') || type.includes('doc')) return FILE_ICONS.document
  if (type.includes('pdf')) return FILE_ICONS.pdf
  if (type.includes('image') || type.includes('jpg') || type.includes('png')) return FILE_ICONS.image
  if (type.includes('video') || type.includes('mp4')) return FILE_ICONS.video
  if (type.includes('audio') || type.includes('mp3')) return FILE_ICONS.audio
  return FILE_ICONS.default
}

function getFileTypeBadge(mimeType = '') {
  const type = mimeType.toLowerCase()
  if (type.includes('folder')) return { label: 'Folder', color: 'bg-blue-100 text-blue-700' }
  if (type.includes('spreadsheet')) return { label: 'Sheet', color: 'bg-green-100 text-green-700' }
  if (type.includes('presentation')) return { label: 'Slides', color: 'bg-orange-100 text-orange-700' }
  if (type.includes('document')) return { label: 'Doc', color: 'bg-indigo-100 text-indigo-700' }
  if (type.includes('pdf')) return { label: 'PDF', color: 'bg-red-100 text-red-700' }
  if (type.includes('image')) return { label: 'Image', color: 'bg-pink-100 text-pink-700' }
  return { label: 'File', color: 'bg-gray-100 text-gray-600' }
}

export default function SearchResultItem({ item, index }) {
  const icon = getFileIcon(item.mimeType, item.name)
  const badge = getFileTypeBadge(item.mimeType)

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-3 p-4
        bg-white rounded-2xl border border-gray-100
        shadow-sm active:shadow-none
        hover:border-indigo-200 hover:bg-indigo-50/30
        active:scale-[0.98]
        transition-all duration-150
        animate-slide-up
      "
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex-shrink-0 w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        {item.folder && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">📁 {item.folder}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}
