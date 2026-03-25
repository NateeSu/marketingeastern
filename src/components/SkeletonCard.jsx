export function SkeletonFolderCard() {
  return (
    <div
      className="min-h-[118px] rounded-3xl animate-pulse"
      style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', opacity: 0.6 }}
    />
  )
}

export function SkeletonResultItem() {
  return (
    <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-amber-100">
      <div className="w-11 h-11 rounded-2xl bg-amber-100 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 bg-amber-100 rounded-lg animate-pulse" />
        <div className="h-3   w-1/3 bg-amber-50  rounded-lg animate-pulse" />
      </div>
      <div className="w-14 h-6 bg-amber-100 rounded-full animate-pulse flex-shrink-0" />
    </div>
  )
}
