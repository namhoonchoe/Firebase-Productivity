 
type BoardCardProps = {
    bgColor:string,
    boardName:string,
    boardStatus: string
}

export default function BoardCard({bgColor,boardName,boardStatus}:BoardCardProps) {
  return (
    <section className="flex w-full items-start justify-start rounded-xl p-4 gap-3 shadow-sm border border-zinc-200 bg-white">
    <div
      className={`aspect-square w-16 rounded-md ${bgColor}`}
    />
    <div className="flex flex-col justify-start items-start gap-3">
      <p className="capitalize font-semibold">{boardName}</p>
      {boardStatus !== "" && <p className="text-zinc-600">{boardStatus}</p>}
    </div>
  </section>
  )
}
