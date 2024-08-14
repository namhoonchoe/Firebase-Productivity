 

export default function Boards() {
 
  return (
    <div className="flex flex-col w-full gap-12 mt-12  px-5 ">
      <p>보드 목록</p>
      <section className="w-full min-h-[calc(100vh-56px)] grid grid-cols-4 gap-4 content-start ">
        {/* board list */}
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
        <div className="w-full aspect-[4] rounded-xl flex justify-center items-center bg-cyan-500">
          <p>create board</p>
        </div>
      </section>
    </div>
  );
}
