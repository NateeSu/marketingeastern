export function SkeletonFolderCard() {
  return (
    <div className="skeleton min-h-[110px] rounded-2xl" />
  )
}

export function SkeletonResultItem() {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
      <div className="skeleton w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded-lg" />
      </div>
      <div className="skeleton h-5 w-14 rounded-full flex-shrink-0" />
    </div>
  )
}
