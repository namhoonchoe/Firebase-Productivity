import { CalendarIcon } from "@/components/svgIcons";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import { Textarea } from "@/components/ui/shadcn/textarea";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function DetailDialog({
  children,
  bsProp,
  ddProp,
  dsProp,
}: {
  children: ReactElement;
  bsProp: string;
  ddProp: string | Date;
  dsProp: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const { boardId } = useParams();

  enum BoardStatus {
    onSchedule = "계획대로 진행중",
    behindSchedule = "지연됨",
    offTrack = "위험함",
    completed = "완료",
  }

  const FormSchema = z.object({
    boardStatus: z.string(),
    dueDate: z.date().or(z.string()).optional(),
    description: z.string(),
  });

  type FormInput = z.infer<typeof FormSchema>;

  const form = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      boardStatus: `${bsProp}`,
      dueDate: ddProp,
      description: dsProp,
    },
  });

  const updateBoard = async ({
    boardStatus,
    dueDate,
    description,
  }: FormInput) => {
    await updateDoc(doc(db, "boards", `${boardId}`), {
      board_status: boardStatus,
      board_due_date: dueDate,
      board_description: description,
    });
  };

  const onSubmit: SubmitHandler<FormInput> = ({
    boardStatus,
    dueDate,
    description,
  }) => {
    updateBoard({ boardStatus, dueDate, description });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex w-full max-w-[425px] flex-col items-start justify-start rounded-xl border-0 bg-zinc-700 p-6">
        <Form {...form}>
          <header className="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-between">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-white">
              Edit board detail
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
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 py-8">
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
                            {  field.value instanceof Date ? 
                             ( format(field.value, "PPP")
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
                          selected={
                            typeof field.value === "string"
                              ? undefined
                              : field.value
                          }
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
              {/* board status */}
              <FormField
                control={form.control}
                name="boardStatus"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Status</p>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="Select board status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={`${BoardStatus.onSchedule}`}>
                          {BoardStatus.onSchedule}
                        </SelectItem>
                        <SelectItem value={`${BoardStatus.behindSchedule}`}>
                          {BoardStatus.behindSchedule}
                        </SelectItem>
                        <SelectItem value={`${BoardStatus.offTrack}`}>
                          {BoardStatus.offTrack}
                        </SelectItem>
                        <SelectItem value={`${BoardStatus.completed}`}>
                          {BoardStatus.completed}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
            <footer className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-between">
              <div className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-end gap-4">
                <DialogClose asChild>
                  <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-md border border-slate-200 bg-white px-4 py-2">
                    <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-slate-900">
                      Cancel
                    </p>
                  </div>
                </DialogClose>

                <button
                  className="flex flex-shrink-0 flex-grow-0 items-center justify-center rounded-md bg-black px-4 py-2"
                  type="submit"
                  onClick={() => toggleOpen()}
                >
                  <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-white">
                    Save
                  </p>
                </button>
              </div>
            </footer>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
