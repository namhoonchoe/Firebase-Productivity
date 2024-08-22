import { useState, useEffect, useRef } from "react";
import {  useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
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
import { useOutsideClick } from "@/hooks/useOutsideClick";
import CloseIcon from "@/components/svgIcons/CloseIcon";
import Kanban from "./Kanban";
import { ChevronDownIcon } from "@/components/svgIcons";
import { iconColorDark } from "@/utils/constants";

type FormInput = {
  boardName: string;
};

export default function Board() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [boardState, setBoardState] = useState<BoardDocument>({
    board_id: "",
    board_name: "",
    board_description: null,
    board_due_date: null,
    board_status: null,
    board_bg_color: "",
    last_edited: "",
    section_ids: [],
  });

   const toggleEdit = () => setIsEdit(!isEdit);
  const { boardId } = useParams();
  const { register, handleSubmit } = useForm<FormInput>();
  const boardNameRef = useRef<HTMLFormElement | null>(null)
 
  useOutsideClick({ ref: boardNameRef, handler: toggleEdit});


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

/*   const deleteBoard = async () => {
    await deleteDoc(doc(db, "boards", `${boardState.board_id}`));
    navigate("/boards");
  }; */

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
            <form onSubmit={handleSubmit(onSubmit)} ref={boardNameRef}>
              <Input
                id="user"
                type="boardName"
                placeholder="your board name"
                {...register("boardName", { required: true })}
                required
              />
            </form>
           
          </div>
        ) : (
          <div className="flex items-center justify-start gap-2">
            <p onClick={toggleEdit} className="capitalize  text-xl">{boardState.board_name}</p>
            <Popover>
              <PopoverTrigger>
                <ChevronDownIcon fill={iconColorDark} width={16} height={16} />
              </PopoverTrigger>
              <PopoverContent
                className="flex w-[272px] flex-col justify-start rounded-xl border border-black bg-zinc-700 p-0"
                align="start"
              >
                <section className="flex w-full flex-col items-start justify-center gap-2 pb-2">
                  <header className="flex w-full flex-row items-center justify-between border-0 border-b border-zinc-500 p-3">
                    <div className="relative h-4 w-[19px] flex-shrink-0 flex-grow-0 overflow-hidden" />
                    <p className="popover-text capitalize">
                      actions
                    </p>
                    <PopoverClose>
                      <CloseIcon width={16} height={16} />
                    </PopoverClose>
                  </header>
                  <div className="flex w-full flex-col items-center justify-center">
                    <ul className="popover-ul border-0 border-b border-zinc-500">
                      <li className="popover-item">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
                            fill="white"
                          />
                          <path
                            d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">edit board detail</p>
                      </li>
                      <li className="popover-item">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M17.75 3C19.5449 3 21 4.45507 21 6.25V12.0218C20.5368 11.7253 20.0335 11.4858 19.5 11.3135V8.5H4.5V17.75C4.5 18.7165 5.2835 19.5 6.25 19.5H11.3135C11.4858 20.0335 11.7253 20.5368 12.0218 21H6.25C4.45507 21 3 19.5449 3 17.75V6.25C3 4.45507 4.45507 3 6.25 3H17.75ZM17.75 4.5H6.25C5.2835 4.5 4.5 5.2835 4.5 6.25V7H19.5V6.25C19.5 5.2835 18.7165 4.5 17.75 4.5ZM23 17.5C23 14.4624 20.5376 12 17.5 12C14.4624 12 12 14.4624 12 17.5C12 20.5376 14.4624 23 17.5 23C20.5376 23 23 20.5376 23 17.5ZM17.5 14C17.7761 14 18 14.2239 18 14.5V17H20C20.2761 17 20.5 17.2239 20.5 17.5C20.5 17.7761 20.2761 18 20 18H17.5C17.2239 18 17 17.7761 17 17.5V14.5C17 14.2239 17.2239 14 17.5 14Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">change background color</p>
                      </li>
                      <li className="popover-item">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M3.5 6.25V8H8.12868C8.32759 8 8.51836 7.92098 8.65901 7.78033L10.1893 6.25L8.65901 4.71967C8.51836 4.57902 8.32759 4.5 8.12868 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25ZM2 6.25C2 4.45507 3.45507 3 5.25 3H8.12868C8.72542 3 9.29771 3.23705 9.71967 3.65901L11.5607 5.5H18.75C20.5449 5.5 22 6.95507 22 8.75V12.8096C21.5557 12.3832 21.051 12.0194 20.5 11.7322V8.75C20.5 7.7835 19.7165 7 18.75 7H11.5607L9.71967 8.84099C9.29771 9.26295 8.72542 9.5 8.12868 9.5H3.5V17.75C3.5 18.7165 4.2835 19.5 5.25 19.5H11.3135C11.4858 20.0335 11.7253 20.5368 12.0218 21H5.25C3.45507 21 2 19.5449 2 17.75V6.25ZM17.5 12C20.5376 12 23 14.4624 23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12ZM14.5 17C14.2239 17 14 17.2239 14 17.5C14 17.7761 14.2239 18 14.5 18H19.2929L17.6464 19.6464C17.4512 19.8417 17.4512 20.1583 17.6464 20.3536C17.8417 20.5488 18.1583 20.5488 18.3536 20.3536L20.8536 17.8536C21.0488 17.6583 21.0488 17.3417 20.8536 17.1464L18.3536 14.6464C18.1583 14.4512 17.8417 14.4512 17.6464 14.6464C17.4512 14.8417 17.4512 15.1583 17.6464 15.3536L19.2929 17H14.5Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">export to csv</p>
                      </li>
                    </ul>
                    <ul className="popover-ul">
                      <li className="popover-item">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M10.5911 2.51301C11.4947 2.14671 12.5053 2.14671 13.4089 2.51301L20.9075 5.55298C21.5679 5.82071 22 6.46216 22 7.17477V16.8275C22 17.5401 21.5679 18.1815 20.9075 18.4493L13.4089 21.4892C12.5053 21.8555 11.4947 21.8555 10.5911 21.4892L3.09252 18.4493C2.43211 18.1815 2 17.5401 2 16.8275V7.17477C2 6.46216 2.43211 5.82071 3.09252 5.55298L10.5911 2.51301ZM12.8453 3.90312C12.3032 3.68334 11.6968 3.68334 11.1547 3.90312L9.24097 4.67894L16.7678 7.60604L19.437 6.57542L12.8453 3.90312ZM14.6911 8.40787L7.21472 5.50039L4.59029 6.56435L12.0013 9.44642L14.6911 8.40787ZM3.5 16.8275C3.5 16.9293 3.56173 17.0209 3.65607 17.0592L11.1547 20.0991C11.1863 20.112 11.2183 20.1241 11.2503 20.1354V10.7638L3.5 7.74979V16.8275ZM12.8453 20.0991L20.3439 17.0592C20.4383 17.0209 20.5 16.9293 20.5 16.8275V7.77292L12.7503 10.7651V20.1352C12.7822 20.1239 12.8139 20.1119 12.8453 20.0991Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">archive this board</p>
                      </li>
                      <li className="popover-item">
                        <svg
                          width={22}
                          height={21}
                          viewBox="0 0 22 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M13.4089 0.274725C12.5053 -0.091575 11.4947 -0.091575 10.5911 0.274725L3.09252 3.3147C2.43211 3.58243 2 4.22388 2 4.9365V9.3624C2.46553 9.1244 2.96945 8.9508 3.5 8.8534V5.51151L11.2503 8.5255L11.25 18.5378L11.4874 18.7753C11.7038 18.9916 11.8517 19.2505 11.931 19.5251C12.4325 19.5343 12.9354 19.4429 13.4089 19.251L20.9075 16.211C21.5679 15.9433 22 15.3018 22 14.5892V4.9365C22 4.22388 21.5679 3.58243 20.9075 3.3147L13.4089 0.274725ZM11.1547 1.66483C11.6968 1.44506 12.3032 1.44506 12.8453 1.66483L19.437 4.33714L16.7678 5.36776L9.24097 2.44065L11.1547 1.66483ZM7.21472 3.26211L14.6911 6.16959L12.0013 7.20815L4.59029 4.32608L7.21472 3.26211ZM20.3439 14.8209L12.8453 17.8609C12.8139 17.8736 12.7822 17.8856 12.7503 17.8969V8.5269L20.5 5.53464V14.5892C20.5 14.691 20.4383 14.7826 20.3439 14.8209ZM4.5 18.7627C5.47187 18.7627 6.37179 18.4546 7.1074 17.9308L9.71967 20.543C10.0126 20.8359 10.4874 20.8359 10.7803 20.543C11.0732 20.2501 11.0732 19.7753 10.7803 19.4824L8.16806 16.8701C8.69191 16.1345 9 15.2346 9 14.2627C9 11.7774 6.98528 9.7627 4.5 9.7627C2.01472 9.7627 0 11.7774 0 14.2627C0 16.748 2.01472 18.7627 4.5 18.7627ZM4.5 17.2627C2.84315 17.2627 1.5 15.9196 1.5 14.2627C1.5 12.6058 2.84315 11.2627 4.5 11.2627C6.15685 11.2627 7.5 12.6058 7.5 14.2627C7.5 15.9196 6.15685 17.2627 4.5 17.2627Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">see archived items</p>
                      </li>
                    </ul>
                  </div>
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