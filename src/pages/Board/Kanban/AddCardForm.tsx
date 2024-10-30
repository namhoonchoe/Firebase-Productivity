import { useForm } from "react-hook-form";
import { useKanbanStore } from "@/store/KanbanStore";
import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
 
type FormInput = {
  cardName: string;
};

type AddCardFormProps = {
  sectionId: string;
   toggleFormOpen: () => void;
};

export default function AddCardForm({
  sectionId,
   toggleFormOpen,
}: AddCardFormProps) {
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const { createTask } = useKanbanStore();
 
  const taskFormRef = useRef<HTMLFormElement | null>(null);

  // Close form when clicking outside
  useOutsideClick({ ref: taskFormRef, handler: () => toggleFormOpen() });

  const handleValid = ({ cardName }: FormInput) => {
    createTask(
      {
        section_id: sectionId,
         task_title: cardName,
        description: "",
        start_date: "",
        due_date: "",
        archived: false,
      } 
    );
    setValue("cardName", "");
    toggleFormOpen();
  };

  return (
    <form
      id="cardName"
      ref={taskFormRef}
      onSubmit={handleSubmit(handleValid)}
      className="flex w-64 flex-col gap-3 rounded-md bg-zinc-900 p-2"
    >
      <Input
        className="flex aspect-[3] w-60 flex-shrink-0 flex-grow-0 items-center rounded-md border-slate-400 bg-zinc-700 normal-case text-white"
        placeholder="Please write a card name"
        {...register("cardName", {
          required: "Please write a card name",
        })}
      />
      <Button className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-center rounded-md bg-emerald-600 normal-case text-white hover:bg-emerald-400">
        <p>create task </p>
      </Button>
    </form>
  );
}
