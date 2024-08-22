import { AddIcon, CloseIcon } from "@/components/svgIcons";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { useKanbanStore } from "@/store/KanbanStore";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Label } from "@/components/ui/shadcn/label";

type FormInput = {
  cardName: string;
};

type AddCardFormProps = {
  sectionId: string;
};

export default function AddCardForm({ sectionId }: AddCardFormProps) {
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const { createTask } = useKanbanStore();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const toggleFormOpen = () => setIsFormOpen(!isFormOpen);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleValid = ({ cardName }: FormInput) => {
    createTask({
      sectionId: sectionId,
      title: cardName,
      description: "",
      startDate: null,
      dueDate: null,
      archived: false,
    });
    setValue("cardName", "");
    setIsFormOpen(false);
  };

  return (
    <>
      {isFormOpen ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit(handleValid)}
          className="flex w-full flex-col items-start justify-start gap-3 px-3 py-4"
        >
           
          <Input
            id="cardName"
            className="rounde-xl h-12 w-full border-slate-400 bg-gray-900 pl-2 capitalize text-white"
            placeholder="Please write a card name"
            {...register("cardName", {
              required: "Please write a card name",
            })}
          />
          <div className="flex items-center justify-start gap-2">
            <Button className="flex flex-shrink-0 flex-grow-0 items-center justify-start rounded-lg bg-emerald-600 capitalize text-white hover:bg-emerald-400">
              <p>add card </p>
            </Button>
            <Button
              className="hover:bg-zinc-600"
              onClick={() => toggleFormOpen()}
            >
              <CloseIcon />
            </Button>
          </div>
        </form>
      ) : (
        <Button
          className="flex min-h-12 w-72 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-xl bg-zinc-900 capitalize text-white"
          onClick={() => toggleFormOpen()}
        >
          <AddIcon width={20} height={20} />
          <p>add task here....</p>
        </Button>
      )}
    </>
  );
}
