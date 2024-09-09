import { useKanbanStore } from "@/store/KanbanStore";
import CardDialog from "./CardDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableCard({
  cardId,
  sectionName,
  disabled,
}: {
  cardId: string;
  sectionName: string;
  disabled:boolean
}) {
  const { taskList } = useKanbanStore();
  const [task] = taskList.filter((task) => task.task_id === cardId);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cardId, disabled:disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CardDialog sectionName={sectionName} cardId={cardId}>
      <div
        className="flex w-64 items-start justify-start rounded-md bg-zinc-700 px-6 py-4"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <p className="max-w-full break-all text-xl font-bold text-white">
          {task.task_title}
        </p>
      </div>
    </CardDialog>
  );
}
