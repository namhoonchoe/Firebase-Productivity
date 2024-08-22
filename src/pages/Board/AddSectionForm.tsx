import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import { useKanbanStore } from "@/store/KanbanStore";
import CloseIcon from "@/components/svgIcons/CloseIcon";
import { AddIcon } from "@/components/svgIcons";

export default function AddSectionForm() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const { createSection } = useKanbanStore();

  type FormInput = {
    sectionName: string;
  };

  const handleValid = ({ sectionName }: FormInput) => {
    createSection(sectionName);
    setValue("sectionName", "");
    setIsAdding(false);
  };

  return (
    <>
      {isAdding ? (
        <section className="flex w-72 flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden rounded-xl bg-zinc-900">
          <form
            onSubmit={handleSubmit(handleValid)}
            className="flex w-full flex-col items-start justify-start gap-3 px-3 py-4"
          >
            <Label
              className="text-lg font-semibold text-white"
              htmlFor="section name"
            >
              Section Name
            </Label>
            <Input
              id="section name"
              className="rounde-xl h-12 w-full border-slate-400 bg-gray-900 pl-2 capitalize text-white"
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
            <div className="flex items-center justify-start gap-2">
              <Button className="flex flex-shrink-0 flex-grow-0 items-center justify-start rounded-lg bg-emerald-600 capitalize text-white hover:bg-emerald-400">
                <p>add section </p>
              </Button>
              <Button
                className="hover:bg-zinc-600"
                onClick={() => setIsAdding(!isAdding)}
              >
                <CloseIcon />
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <Button
          className="flex min-h-12 w-72 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-xl bg-zinc-900 capitalize text-white"
          onClick={() => setIsAdding(!isAdding)}
        >
          <AddIcon />
          <p>add section </p>
        </Button>
      )}
    </>
  );
}
