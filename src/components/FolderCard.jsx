// Yellow-warm palette cards
const CARD_STYLES = [
  { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '#fcd34d', text: '#92400e' },
  { bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '#fde68a', text: '#b45309' },
  { bg: 'linear-gradient(135deg, #fde68a, #fbbf24)', border: '#f59e0b', text: '#78350f' },
  { bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '#fed7aa', text: '#9a3412' },
  { bg: 'linear-gradient(135deg, #fef9c3, #fef08a)', border: '#facc15', text: '#713f12' },
  { bg: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '#fde047', text: '#854d0e' },
  { bg: 'linear-gradient(135deg, #fff8f0, #fde8c8)', border: '#fdba74', text: '#c2410c' },
  { bg: 'linear-gradient(135deg, #fdf4e4, #fbe8b0)', border: '#fbbf24', text: '#92400e' },
]

export default function FolderCard({ folder, index }) {
  const s = CARD_STYLES[index % CARD_STYLES.length]

  return (
    <a
      href={folder.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center gap-2.5 p-4 min-h-[118px] rounded-3xl select-none animate-pop"
      style={{
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        boxShadow: '0 2px 10px rgba(251,191,36,0.12)',
        animationDelay: `${index * 45}ms`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(251,191,36,0.12)'
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)'
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Icon bubble */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }}
      >
        {folder.icon || '📁'}
      </div>

      <span
        className="text-center text-xs font-bold leading-snug line-clamp-2 px-1"
        style={{ color: s.text }}
      >
        {folder.name}
      </span>
    </a>
  )
}
