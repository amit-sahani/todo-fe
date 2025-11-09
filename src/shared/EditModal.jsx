import React from "react";
import TodoForm from "./TodoForm";
import Modal from "../components/Modal";

export default function EditModal({ todo, onClose, onSave }) {
  function save(updated) {
    onSave({ ...todo, ...updated });
  }

  return (
    <Modal onClose={onClose} title="Edit Todo">
      <TodoForm initial={todo} onSave={save} onCancel={onClose} />
    </Modal>
  );
}
