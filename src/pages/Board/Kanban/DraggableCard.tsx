import { useKanbanStore } from "@/store/KanbanStore";
import CardDialog from "./CardDialog";
import { Draggable } from "@hello-pangea/dnd";

export default function DraggableCard({
  cardId,
  sectionName,
  sectionId,
}: {
  cardId: string;
  sectionName: string;
  sectionId: string;
}) {
  const { getTaskList } = useKanbanStore();
  const [task] =
    getTaskList(sectionId) !== undefined
      ? getTaskList(sectionId).filter((task) => task?.task_id === cardId)
      : [];

  if (getTaskList(sectionId))
    return (
      <Draggable
        key={task.task_id}
        draggableId={task.task_id}
        index={getTaskList(sectionId).indexOf(task)}
      >
        {(provided) => (
          <CardDialog
            sectionName={sectionName}
            cardId={cardId}
            sectionId={sectionId}
          >
            <div
              className="flex w-64 items-start justify-start rounded-md bg-zinc-700 px-6 py-4"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <p className="max-w-full break-all text-xl font-bold text-white">
                {task.task_title}
              </p>
            </div>
          </CardDialog>
        )}
      </Draggable>
    );
}
