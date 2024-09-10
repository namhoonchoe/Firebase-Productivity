import { useKanbanStore } from "@/store/KanbanStore";
import CardDialog from "./CardDialog";
 

export default function DraggableCard({
  cardId,
  sectionName,
 }: {
  cardId: string;
  sectionName: string;
 }) {
  const { taskList } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
  

  return (
    <CardDialog sectionName={sectionName} cardId={cardId}>
      <div
        className="flex w-64 items-start justify-start rounded-md bg-zinc-700 px-6 py-4"
         
      >
        <p className="max-w-full break-all text-xl font-bold text-white">
          {task.task_title}
        </p>
      </div>
    </CardDialog>
  );
}
