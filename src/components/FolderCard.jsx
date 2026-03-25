const CARD_COLORS = [
  'from-indigo-50 to-indigo-100 border-indigo-200',
  'from-violet-50 to-violet-100 border-violet-200',
  'from-sky-50 to-sky-100 border-sky-200',
  'from-emerald-50 to-emerald-100 border-emerald-200',
  'from-amber-50 to-amber-100 border-amber-200',
  'from-rose-50 to-rose-100 border-rose-200',
  'from-teal-50 to-teal-100 border-teal-200',
  'from-orange-50 to-orange-100 border-orange-200',
]

export default function FolderCard({ folder, index }) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <a
      href={folder.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex flex-col items-center justify-center gap-2
        p-4 min-h-[110px]
        bg-gradient-to-br ${colorClass}
        border rounded-2xl
        shadow-sm active:shadow-none
        transition-all duration-150
        active:scale-95 hover:scale-[1.02] hover:shadow-md
        cursor-pointer select-none
        animate-fade-in
      `}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className="text-3xl leading-none" role="img" aria-label={folder.name}>
        {folder.icon || '📁'}
      </span>
      <span className="text-center text-sm font-600 font-semibold text-gray-700 leading-tight line-clamp-2">
        {folder.name}
      </span>
    </a>
  )
}
