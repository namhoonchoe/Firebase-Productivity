import { useKanbanStore } from "@/store/KanbanStore";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";

import { Button } from "@/components/ui/shadcn/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";

import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/shadcn/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@/components/svgIcons";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { useState } from "react";

export default function DraggableCard({
  cardId,
  sectionName,
}: {
  cardId: string;
  sectionName: string;
}) {
  const { taskList, updateTask } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
  const { task_id, ...payload } = task;
  const { task_title, start_date, due_date, description } = payload;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const FormSchema = z.object({
    task_title: z.string(),
    start_date: z.date().optional(),
    due_date: z.date().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      task_title: task_title,
      start_date: start_date,
      due_date: due_date,
      description: description,
    },
  });

  const submitHandler = (data: z.infer<typeof FormSchema>) => {
    updateTask({ ...payload, ...data }, task_id);
    console.log("summit successfully")
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger>
        <div className="flex w-64 items-start justify-start rounded-xl bg-zinc-700 px-6 py-4  ">
          <p className="max-w-full break-all text-xl font-bold text-white">
            {task_title}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[425px] flex-col items-start justify-start rounded-xl border-0 bg-zinc-700 p-6">
        <Form {...form}>
          <header className="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-between">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-white">
              {task_title} in {sectionName}
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
                name="task_title"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Task name</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Task name"
                        className="form-input space-y-0"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* start date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel>
                      <p className="form-label">Start date</p>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "my-0 w-full items-center justify-between rounded-md bg-black px-4 py-2 text-left text-sm font-normal text-white",
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
              {/* due date */}
              <FormField
                control={form.control}
                name="due_date"
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
              <div
                className="flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-md bg-red-500 px-4 py-2"
                onClick={() =>
                  updateTask({ ...payload, archived: true }, task_id)
                }
              >
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
                    d="M10.25 11C9.83579 11 9.5 11.3358 9.5 11.75C9.5 12.1642 9.83579 12.5 10.25 12.5H13.75C14.1642 12.5 14.5 12.1642 14.5 11.75C14.5 11.3358 14.1642 11 13.75 11H10.25ZM3 5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V6.75C21 7.5301 20.603 8.21748 20 8.62111V17.25C20 19.3211 18.3211 21 16.25 21H7.75C5.67893 21 4 19.3211 4 17.25V8.62111C3.39701 8.21748 3 7.5301 3 6.75V5.25ZM5.5 9V17.25C5.5 18.4926 6.50736 19.5 7.75 19.5H16.25C17.4926 19.5 18.5 18.4926 18.5 17.25V9H5.5ZM5.25 4.5C4.83579 4.5 4.5 4.83579 4.5 5.25V6.75C4.5 7.16421 4.83579 7.5 5.25 7.5H18.75C19.1642 7.5 19.5 7.16421 19.5 6.75V5.25C19.5 4.83579 19.1642 4.5 18.75 4.5H5.25Z"
                    fill="white"
                  />
                </svg>
                <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-white">
                  Archive
                </p>
              </div>
              <div className="flex w-[199.5px] flex-shrink-0 flex-grow-0 items-end justify-end gap-4">
                <DialogClose asChild>
                  <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-md border border-slate-200 bg-white px-4 py-2">
                    <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-slate-900">
                      Cancel
                    </p>
                  </div>
                </DialogClose>

                <button className="  flex flex-shrink-0 flex-grow-0 items-center justify-center rounded-md bg-black px-4 py-2" type="submit" onClick={() => toggleOpen()}>
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
