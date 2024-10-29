import { Link } from "react-router-dom";
import { PersonIcon } from "@/components/svgIcons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import useAuth from "@/hooks/useAuth";

export default function MenuPopover() {
  const { handleSignOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PersonIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 flex flex-col justify-center  items-stretch ">
        <DropdownMenuCheckboxItem onClick={handleSignOut}>
          로그아웃
        </DropdownMenuCheckboxItem>
        <Link to="/profile">
          <DropdownMenuCheckboxItem>개인 설정</DropdownMenuCheckboxItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
