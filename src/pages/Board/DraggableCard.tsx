import { useKanbanStore } from "@/store/KanbanStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";

export default function DraggableCard({
  cardId,
  sectionName,
}: {
  cardId: string;
  sectionName: string;
}) {
  const { taskList, updateTask } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
   const { task_id: targetId, ...payload } = task;
   const { task_title } = payload;
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex w-64 items-start justify-start rounded-xl bg-zinc-700 px-6 py-4 mb-3">
          <p className="max-w-full break-all text-xl font-bold text-white">
            {task_title}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task_title}</DialogTitle>
          <DialogDescription>in {sectionName}</DialogDescription>
        </DialogHeader>
        <main className="flex w-full flex-col items-start justify-start gap-4 border border-slate-500">
          <p>start Date</p>
          <p>due Date</p>
          <p>description</p>
        </main>
        <DialogFooter className="w-full sm:justify-between">
          <Button
            type="button"
            className="bg-red-600"
            onClick={() => updateTask(
              { ...payload, archived: true },
              targetId,
            )}
          >
            Archive this task
          </Button>
          <DialogClose className="itmes-center flex gap-4">
            <Button type="button" variant="secondary">
              Close
            </Button>
            <Button type="button" className="bg-emerald-400">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
