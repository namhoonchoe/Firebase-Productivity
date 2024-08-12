import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@/components/svgIcons/PersonIcon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";

export default function MenuPopover() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth/signin");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PersonIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 flex flex-col justify-center items-start items-stretch ">
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
