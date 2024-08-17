import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { db } from "@/services/firebase";
import { Unsubscribe } from "firebase/auth";
import { BoardDocument } from "@/Types/FireStoreModels";
import { Button } from "@/components/ui/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";

import CloseIcon from "@/components/svgIcons/CloseIcon";

type FormInput = {
  boardName: string;
};

export default function Board() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [boardState, setBoardState] = useState<BoardDocument>({
    board_id: "",
    board_name: "",
    last_edited: "",
    list_ids: [],
    user_id: "",
  });
 

  const navigate = useNavigate();
  const toggleEdit = () => setIsEdit(!isEdit);
  const { boardId } = useParams();
  const { register, handleSubmit } = useForm<FormInput>();

  const editBoardName = async (boardName: string) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardState.board_id}`), { board_name: boardName });
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
  if(!boardState) 
    return (
      <div>Loading...</div>
    )

  return (
    <section className="w-full flex flex-col justify-start items-start ">
      <header className="w-full h-16 overflow-hidden flex pl-5 items-center justify-start shadow-sm bg-white">
        {isEdit ? (
          <div className="flex justify-start items-center gap-2">
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
              <CloseIcon />
            </button>
          </div>
        ) : (
          <div className="flex justify-start items-center gap-2">
            <p onClick={toggleEdit}>{boardState.board_name}</p>
            <Popover>
              <PopoverTrigger>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.21967 8.46967C4.51256 8.17678 4.98744 8.17678 5.28033 8.46967L12 15.1893L18.7197 8.46967C19.0126 8.17678 19.4874 8.17678 19.7803 8.46967C20.0732 8.76256 20.0732 9.23744 19.7803 9.53033L12.5303 16.7803C12.2374 17.0732 11.7626 17.0732 11.4697 16.7803L4.21967 9.53033C3.92678 9.23744 3.92678 8.76256 4.21967 8.46967Z"
                    fill="#212121"
                  />
                </svg>
              </PopoverTrigger>
              <PopoverContent className="w-60 flex flex-col justify-start">
                <section className="flex flex-col gap-2 justify-center items-start w-full">
                  <header className="flex flex-row justify-between items-center w-full">
                    <h1 onClick={deleteBoard}>delete board</h1>
                    <PopoverClose>
                      <CloseIcon />
                    </PopoverClose>
                  </header>
                  <div></div>
                </section>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </header>
      <section className="bg-emerald-400 w-full h-[calc(100vh-120px)]"></section>
    </section>
  );
}
