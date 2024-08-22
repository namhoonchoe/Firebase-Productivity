import { useKanbanStore } from "@/store/KanbanStore";

export default function DraggableCard({ cardId }: { cardId: string }) {
  const { taskList } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
  const { task_title } = task;
  return (
    <div className="flex aspect-[3] w-64 flex-shrink-0 flex-grow-0 items-start justify-start gap-2.5 rounded-xl bg-zinc-700 px-6 py-4">
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2">
        <p className="flex-shrink-0 flex-grow-0 text-left text-xl font-bold text-white">
          {task_title}
        </p>
      </div>
    </div>
  );
}
