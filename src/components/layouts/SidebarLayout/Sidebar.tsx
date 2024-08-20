import { HomeIcon } from "@/components/svgIcons";
import { BoardsIcon } from "@/components/svgIcons";
import { MemoIcon } from "@/components/svgIcons";
import { TimerIcon } from "@/components/svgIcons";
import { Link } from "react-router-dom";
export default function Sidebar({ isShrinked }: { isShrinked: boolean }) {
  return (
    <>
      {isShrinked ? (
        <section className="grid-side-bar sticky top-14 flex min-h-[calc(100vh-56px)] w-16 flex-col items-center justify-start gap-8 bg-zinc-900 py-8">
          <Link to="/">
            <div className="nav-button-shrinked">
              <HomeIcon />
            </div>
          </Link>
          <Link to="/boards">
            <div className="nav-button-shrinked">
              <BoardsIcon />
            </div>
          </Link>
          <Link to="/memo">
            <div className="nav-button-shrinked">
              <MemoIcon />
            </div>
          </Link>
          <Link to="/pomodoro">
            <div className="nav-button-shrinked">
              <TimerIcon />
            </div>
          </Link>
        </section>
      ) : (
        <section className="grid-side-bar sticky top-14 flex min-h-[calc(100vh-56px)] w-56 flex-col items-center justify-start gap-8 bg-zinc-900 px-1.5 py-8">
          <Link to="/">
            <div className="nav-button">
              <HomeIcon />
              <p className="font-medium subpixel-antialiased">홈</p>
            </div>
          </Link>
          <Link to="/boards">
            <div className="nav-button">
              <BoardsIcon />
              <p className="font-medium subpixel-antialiased">프로젝트</p>
            </div>
          </Link>
          <Link to="/memo">
            <div className="nav-button">
              <MemoIcon />
              <p className="font-medium subpixel-antialiased">메모</p>
            </div>
          </Link>
          <Link to="/pomodoro">
            <div className="nav-button">
              <TimerIcon />
              <p className="font-medium subpixel-antialiased">집중 모드</p>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
