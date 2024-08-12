import HomeIcon from "@/components/svgIcons/HomeIcon";
import BoardsIcon from "@/components/svgIcons/BoardsIcon";
import MemoIcon from "@/components/svgIcons/MemoIcon";
import TimerIcon from "@/components/svgIcons/TimerIcon";
import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <section className="flex flex-col justify-start items-center w-56  gap-8 px-1.5 py-8 bg-zinc-900  sticky top-14 grid-side-bar  min-h-[calc(100vh-56px)] xl:h-[calc(100vh-56px)]  ">
      <Link to="/">
        <div className="nav-button  ">
          <HomeIcon />
          <p className=" subpixel-antialiased  font-medium">홈</p>
        </div>
      </Link>
      <Link to="/boards">
        <div className="nav-button   ">
          <BoardsIcon />
          <p className=" subpixel-antialiased  font-medium">프로젝트</p>
        </div>
      </Link>
      <Link to="/memo">
        <div className="nav-button  ">
          <MemoIcon />
          <p className=" subpixel-antialiased  font-medium">메모</p>
        </div>
      </Link>
      <Link to="/pomodoro">
        <div className="nav-button   ">
          <TimerIcon />
          <p className=" subpixel-antialiased  font-medium">집중 모드</p>
        </div>
      </Link>
    </section>
  );
}
