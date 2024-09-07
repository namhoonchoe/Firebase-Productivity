import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/shadcn/hover-card";

import {
  CloseIcon,
  MoreIcon,
  EsIcon,
  MoveIcon,
  ArchiveIcon,
} from "@/components/svgIcons";

import { PopoverClose } from "@radix-ui/react-popover";
import EraseIcon from "@/components/svgIcons/EraseIcon";
import { useKanbanStore } from "@/store/KanbanStore";
import { Task } from "@/Types/FireStoreModels";
 
type SectionPopoverProps = {
  filteredList: Task[];
  sectionId: string;
  sectionName: string;
  toggleEditMode: () => void;
};

export default function SectionPopover({
  filteredList,
  sectionId,
  sectionName,
  toggleEditMode,
}: SectionPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const toggleIsPopoverOpen = () => setIsPopoverOpen(!isPopoverOpen);

  const { sections, updateTask, updateSection, swapSection } = useKanbanStore();

  return (
    <Popover open={isPopoverOpen} onOpenChange={() => toggleIsPopoverOpen()}>
      <PopoverTrigger>
        <MoreIcon />
      </PopoverTrigger>
      <PopoverContent className="popover-content" align="start">
        <section className="flex w-full flex-col items-start justify-center gap-2 pb-2">
          <header className="flex w-full flex-row items-center justify-between border-0 border-b border-zinc-500 p-3">
            <div className="relative h-4 w-[19px] flex-shrink-0 flex-grow-0 overflow-hidden" />
            <p className="popover-text normal-case">Actions</p>
            <PopoverClose>
              <CloseIcon width={16} height={16} />
            </PopoverClose>
          </header>
          <div className="flex w-full flex-col items-center justify-center">
            <ul className="popover-ul border-0 border-b border-zinc-500">
              <li className="popover-item">
                <EsIcon width={16} height={16} />
                <p
                  className="popover-text"
                  onClick={() => {
                    toggleEditMode();
                    toggleIsPopoverOpen();
                  }}
                >
                  edit section name
                </p>
              </li>
              {/* move section */}
              <HoverCard>
                <HoverCardTrigger>
                  <li className="popover-item">
                    <MoveIcon width={16} height={16} />
                    <p className="popover-text">move setion</p>
                  </li>
                </HoverCardTrigger>
                <HoverCardContent
                  side="right"
                  align="start"
                  sideOffset={20}
                  className="relative flex w-60 flex-col items-center justify-center gap-4 overflow-hidden rounded-md border-0 bg-zinc-700 p-4"
                >
                  <label
                    htmlFor="color"
                    className="mt-1 text-base text-slate-200"
                  >
                    position
                  </label>

                  <section className="flex w-full flex-col items-start justify-start gap-2">
                    {sections.map((section) => {
                      const [currentSection] = sections.filter(
                        (section) => section.section_id === sectionId,
                      );
                      const currentIndex = sections.indexOf(currentSection);

                      return (
                        <div
                          className="flex w-full items-center justify-between rounded-md p-2 text-white hover:bg-zinc-900"
                          onClick={() =>
                            swapSection(currentIndex, sections.indexOf(section))
                          }
                        >
                          <p>{sections.indexOf(section) + 1}</p>
                          {section.section_id === sectionId && <p>current</p>}
                        </div>
                      );
                    })}
                  </section>
                </HoverCardContent>
              </HoverCard>
            </ul>
            <ul className="popover-ul">
              <li
                className="popover-item"
                onClick={() => {
                  updateSection(sectionId, {
                    section_name: sectionName,
                    archived: true,
                  });
                  toggleIsPopoverOpen();
                }}
              >
                <ArchiveIcon />
                <p className="popover-text">archive this section</p>
              </li>
              <li className="popover-item">
                <EraseIcon />
                <p
                  className="popover-text"
                  onClick={() => {
                    filteredList.map((task) => {
                      const { task_id, ...payload } = task;
                      updateTask({ ...payload, archived: true }, task_id);
                    });
                    toggleIsPopoverOpen();
                  }}
                >
                  archive all tasks in section
                </p>
              </li>
            </ul>
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
}
