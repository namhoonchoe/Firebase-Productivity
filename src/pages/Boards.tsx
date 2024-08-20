import {
  doc,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";

import { db, auth } from "@/services/firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import { BoardDocument } from "@/Types/FireStoreModels";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import CloseIcon from "@/components/svgIcons/CloseIcon";
import { FirebaseError } from "firebase/app";

type FormInput = {
  boardName: string;
};

export default function Boards() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { register, handleSubmit } = useForm<FormInput>();

  const [boards, setBoards] = useState<BoardDocument[]>([]);

  const createBoard = async (boardName: string) => {
    const boardId = crypto.randomUUID();
    try {
      await setDoc(doc(db, "boards", boardId), {
        board_id: boardId,
        board_name: boardName,
        last_edited: Date.now().toString(),
        section_ids:[]
        } as BoardDocument);
      navigate(`/boards/${boardId}`);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const onSubmit: SubmitHandler<FormInput> = ({ boardName }) => {
    createBoard(boardName);
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const getBoards = async (userId: string) => {
      const boardRef = collection(db, "boards");
      const boardsQuery = query(boardRef, where("user_id", "==", userId));

      unsubscribe = await onSnapshot(boardsQuery, (snapshot) => {
        const boards = snapshot.docs.map((doc) => {
          const { board_id, board_name, last_edited, section_ids } =
            doc.data();
          return {
            board_id,
            board_name,
            last_edited,
            section_ids,
           };
        });
        setBoards(boards);
      });
    };
    if (user) {
      getBoards(user.uid);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-12 mt-12 px-5 ">
      <p>보드 목록</p>
      <section className="w-full min-h-[calc(100vh-56px)] grid grid-cols-4 gap-4 content-start ">
        {/* Create board */}
        <Popover>
          <PopoverTrigger>
            <div className="w-full aspect-[5] rounded-xl flex justify-center items-center bg-zinc-700 text-white">
              {/** on click popover  */}
              <p>Create board</p>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={"right"}
            className="w-60 flex flex-col justify-start"
          >
            <section className="flex flex-col gap-2 justify-center items-start w-full">
              <header className="flex flex-row justify-between items-center w-full">
                <h1>Create board</h1>
                <PopoverClose>
                  <CloseIcon />
                </PopoverClose>
              </header>

              <form
                className="w-full flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Label htmlFor="boardName">Board title</Label>
                <Input
                  id="boardName"
                  type="boardName"
                  placeholder="your board name"
                  {...register("boardName", { required: true })}
                  required
                />
              </form>
            </section>
          </PopoverContent>
        </Popover>

        {/* board list link to board */}

        {boards.map((board) => (
          <Link to={`/boards/${board.board_id}`}>
            <div className="w-full aspect-[5] rounded-xl flex justify-center items-center bg-zinc-700 text-white">
              {/** on click popover  */}
              <p>{board.board_name}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
