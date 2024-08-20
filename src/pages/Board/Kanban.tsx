import React from "react";
import AddSectionForm from "./AddSectionForm";
/* 
const getLists = async () => {};

const createList = async () => {};

const deleteList = async () => {};

const editListName = async () => {};

const updateLsit = async () => {}; */

/**
 * 칸반 보드는 ??????
 * @returns
 *
 *
 */

export default function Kanban() {
  return <section className="flex bg-transparent w-full h-full justify-start items-start gap-20 overflow-auto py-6 pl-5">
    <AddSectionForm/>
  </section>;
}
