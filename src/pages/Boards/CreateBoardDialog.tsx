import { doc, setDoc } from "firebase/firestore";

import { SubmitHandler, useForm } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";

import { CalendarIcon } from "@/components/svgIcons";

import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";

import { format } from "date-fns";

import { Textarea } from "@/components/ui/shadcn/textarea";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";
import { colors } from "@/utils/constants";
import { useState } from "react";
import { db } from "@/services/firebase";
import { Input } from "@/components/ui/shadcn/input";
import { BoardDocument } from "@/Types/FireStoreModels";
import { FirebaseError } from "firebase/app";

type BoardPayload = {
  boardName: string;
  backgroundColor: string;
  dueDate?: Date;
  description?: string;
};

export default function CreateBoardDialog({userId}:{userId:string}) {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const FormSchema = z.object({
    boardName: z.string(),
    backgroundColor: z.string(),
    description: z.string().optional(),
    dueDate: z.date().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>();

  const submitHandler: SubmitHandler<z.infer<typeof FormSchema>> = (
    data: z.infer<typeof FormSchema>,
  ) => {
    const { boardName, description, dueDate, backgroundColor } = data;
    createBoard({ boardName, description, dueDate, backgroundColor });
  };

  const createBoard = async ({
    boardName,
    dueDate,
    description,
    backgroundColor,
  }: BoardPayload) => {
    const boardId = crypto.randomUUID();
    try {
      await setDoc(doc(db, "boards", boardId), {
        user_id:userId,
        board_id: boardId,
        board_name: boardName,
        last_edited: format(Date.now(), "PPP"),
        board_description: `${description ? description : ""}`,
        board_due_date: `${dueDate ? dueDate : ""}`,
        board_status: "",
        board_bg_color: backgroundColor,
        taskList: "[]",
        sectionList: "[]",
        archived: false,
      } as BoardDocument);
      navigate(`/boards/${boardId}`);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger>
        <div className="flex aspect-[5] w-full items-center justify-center rounded-xl bg-zinc-700 text-white">
          <p>Create board</p>
        </div>
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[425px] flex-col items-start justify-start rounded-xl border-0 bg-zinc-700 p-6">
        <Form {...form}>
          <header className="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-between">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-white">
              Create a New board
            </p>
            <DialogClose asChild>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 flex-grow-0"
                preserveAspectRatio="none"
              >
                <path
                  d="M0.64705 0.553791L0.71967 0.46967C0.98594 0.2034 1.4026 0.1792 1.69621 0.39705L1.78033 0.46967L8.25 6.939L14.7197 0.46967C15.0126 0.17678 15.4874 0.17678 15.7803 0.46967C16.0732 0.76256 16.0732 1.23744 15.7803 1.53033L9.311 8L15.7803 14.4697C16.0466 14.7359 16.0708 15.1526 15.8529 15.4462L15.7803 15.5303C15.5141 15.7966 15.0974 15.8208 14.8038 15.6029L14.7197 15.5303L8.25 9.061L1.78033 15.5303C1.48744 15.8232 1.01256 15.8232 0.71967 15.5303C0.42678 15.2374 0.42678 14.7626 0.71967 14.4697L7.189 8L0.71967 1.53033C0.4534 1.26406 0.4292 0.847401 0.64705 0.553791Z"
                  fill="white"
                />
              </svg>
            </DialogClose>
          </header>
          <form className="w-full" onSubmit={form.handleSubmit(submitHandler)}>
            <div className="flex w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 py-8">
              <FormField
                control={form.control}
                name="boardName"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Board name</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="board name"
                        className="form-input space-y-0"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Due date</p>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full items-center justify-between rounded-md bg-black px-4 py-2 text-left text-sm font-normal text-white",
                              !field.value && "text-white",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        align="start"
                        sideOffset={12}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="bg-black text-white"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*background color */}
              <FormField
                control={form.control}
                name="backgroundColor"
                render={() => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Background color</p>
                    </FormLabel>
                    <section className="flex w-full flex-wrap justify-start gap-2">
                      {colors.map((color) => (
                        <div key={color} className="flex items-center">
                          <label
                            htmlFor={color}
                            className={`h-10 w-10 rounded-md ${color} flex cursor-pointer items-center justify-center`}
                          >
                            <Input
                              type="radio"
                              id={color}
                              value={color}
                              onChange={() =>
                                form.setValue("backgroundColor", color)
                              }
                              className="z-20 h-4 w-4 cursor-pointer focus:ring-sky-500"
                            />
                          </label>
                        </div>
                      ))}
                    </section>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* desctiption */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Description</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a description"
                        className="form-input"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <button
              className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-center rounded-md bg-black px-4 py-2"
              type="submit"
              onClick={() => toggleOpen()}
            >
              <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-white">
                Create
              </p>
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
