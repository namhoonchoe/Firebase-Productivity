import { HomeIcon } from "@/components/svgIcons";
import { BoardsIcon } from "@/components/svgIcons";
import { MemoIcon } from "@/components/svgIcons";
import { TimerIcon } from "@/components/svgIcons";
import { Link } from "react-router-dom";
export default function Navigation() {
  return (
    <section className="absolute bottom-6 flex h-20 w-[496px] items-center justify-between overflow-hidden rounded-2xl bg-zinc-900 px-6 py-3 z-10">
      <Link to="/">
        <div className="nav-button">
          <HomeIcon />
        </div>
      </Link>
      <Link to="/boards">
        <div className="nav-button">
          <BoardsIcon />
        </div>
      </Link>
      <Link to="/memo">
        <div className="nav-button">
          <MemoIcon />
        </div>
      </Link>
      <Link to="/pomodoro">
        <div className="nav-button">
          <TimerIcon />
        </div>
      </Link>
    </section>
  );
}
