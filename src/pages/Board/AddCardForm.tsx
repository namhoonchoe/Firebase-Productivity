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
    createTask({
      section_id: sectionId,
      task_title: cardName,
      description: "",
      start_date: null,
      due_date: null,
      archived: false,
    });
    setValue("cardName", "");
    toggleFormOpen();
  };

  return (
    <form
      id="cardName"
      ref={taskFormRef}
      onSubmit={handleSubmit(handleValid)}
      className="my-2 p-2 flex w-64 flex-shrink-0 flex-grow-0 flex-col items-start gap-3 overflow-hidden rounded-xl bg-zinc-900"
    >
      <Input
        className="flex aspect-[3]  w-60 flex-shrink-0 flex-grow-0 items-center   rounded-xl border-slate-400 bg-zinc-700 pl-2 capitalize text-white"
        placeholder="Please write a card name"
        {...register("cardName", {
          required: "Please write a card name",
        })}
      />
      <Button className="flex flex-shrink-0 flex-grow-0 items-center justify-start rounded-lg bg-emerald-600 capitalize text-white hover:bg-emerald-400">
        <p>add card </p>
      </Button>
    </form>
  );
}
