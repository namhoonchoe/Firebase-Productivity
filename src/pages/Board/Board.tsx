import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { db } from "@/services/firebase";
import { Unsubscribe } from "firebase/auth";
import { BoardDocument } from "@/Types/FireStoreModels";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";

import CloseIcon from "@/components/svgIcons/CloseIcon";
import Kanban from "./Kanban";
import { ChevronDownIcon } from "@/components/svgIcons";

type FormInput = {
  boardName: string;
};

export default function Board() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [boardState, setBoardState] = useState<BoardDocument>({
    board_id: "",
    board_name: "",
    last_edited: "",
    section_ids: [],
  });

  const navigate = useNavigate();
  const toggleEdit = () => setIsEdit(!isEdit);
  const { boardId } = useParams();
  const { register, handleSubmit } = useForm<FormInput>();

  const editBoardName = async (boardName: string) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardState.board_id}`), {
      board_name: boardName,
    });
    toggleEdit();
  };

  const onSubmit: SubmitHandler<FormInput> = ({ boardName }) => {
    editBoardName(boardName);
  };

  const deleteBoard = async () => {
    await deleteDoc(doc(db, "boards", `${boardState.board_id}`));
    navigate("/boards");
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);
      /*       const boardQuery = query(boardRef, where("user_id", "==", userId));
       */
      unsubscribe = await onSnapshot(docRef, (doc) => {
        const board = doc.data() as BoardDocument;
        setBoardState(board);
      });
    };
    getBoard();

    return () => {
      /*       unsubscribe && unsubscribe();
       */
      unsubscribe && unsubscribe();
    };
  }, []);

  /**
   *  get the board form firestore
   *
   */

  /* get task list from firestore
  
  */
  if (!boardState) return <div>Loading...</div>;

  return (
    <section className="flex w-full flex-col items-start justify-start">
      <header className="flex h-16 w-full items-center justify-start overflow-hidden bg-white pl-5 shadow-sm">
        {isEdit ? (
          <div className="flex items-center justify-start gap-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="user"
                type="boardName"
                placeholder="your board name"
                {...register("boardName", { required: true })}
                required
              />
            </form>
            <button onClick={toggleEdit}>
              <CloseIcon fill={"#09090b"}  />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-start gap-2">
            <p onClick={toggleEdit}>{boardState.board_name}</p>
            <Popover>
              <PopoverTrigger>
             <ChevronDownIcon fill={"#000"}/>
              </PopoverTrigger>
              <PopoverContent
                className="flex w-60 flex-col justify-start"
                align="start"
              >
                <section className="flex w-full flex-col items-start justify-center gap-2">
                  <header className="flex w-full flex-row items-center justify-between">
                    <h1 onClick={deleteBoard}>delete board</h1>
                    <PopoverClose>
                      <CloseIcon fill={"#09090b"} />
                    </PopoverClose>
                  </header>
                 </section>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </header>
      <section className="h-[calc(100vh-120px)] w-full bg-emerald-400">
        <Kanban />
      </section>
    </section>
  );
}
