import { useKanbanStore } from "@/store/KanbanStore";

export default function DraggableCard({ cardId }: { cardId: string }) {
  const { taskList } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
  const { task_title } = task;
  return (
    <div className="flex w-64 items-start justify-start rounded-xl bg-zinc-700 px-6 py-4">
      <p className="max-w-full break-all text-xl font-bold text-white">
        {task_title}
      </p>
    </div>
  );
}
