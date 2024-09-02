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
import { ToArchiveIcon, CalendarIcon, CloseIcon } from "@/components/svgIcons";
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

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const FormSchema = z.object({
    task_title: z.string(),
    start_date: z.date().or(z.string()).optional(),
    due_date: z.date().or(z.string()).optional(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      task_title: task.task_title,
      start_date: task.start_date,
      due_date: task.due_date,
      description: task.description,
    },
  });

  const submitHandler = (data: z.infer<typeof FormSchema>) => {
    const { task_id, ...payload } = task;
    updateTask({ ...payload, ...data }, task_id);
    console.log("summit successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger>
        <div className="flex w-64 items-start justify-start rounded-xl bg-zinc-700 px-6 py-4">
          <p className="max-w-full break-all text-xl font-bold text-white">
            {task.task_title}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[425px] flex-col items-start justify-start rounded-xl border-0 bg-zinc-700 p-6">
        <Form {...form}>
          <header className="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-between">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-white">
              {task.task_title} in {sectionName}
            </p>
            <DialogClose>
              <CloseIcon width={16} height={16} />
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
                      <p className="form-label">Task title</p>
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
                            {field.value instanceof Date ? (
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
                            {field.value instanceof Date ? (
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
                onClick={() => {
                  const { task_id, ...payload } = task;
                  updateTask({ ...payload, archived: true }, task_id);
                }}
              >
                <ToArchiveIcon />
                <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-white">
                  Archive
                </p>
              </div>
              <div className="flex w-[199.5px] flex-shrink-0 flex-grow-0 items-end justify-end gap-4">
                <DialogClose asChild>
                  <button className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-md border border-slate-200 bg-white px-4 py-2">
                    <p className="flex-shrink-0 flex-grow-0 text-left text-sm font-medium text-slate-900">
                      Cancel
                    </p>
                  </button>
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
