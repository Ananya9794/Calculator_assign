import React, { useState } from "react";
import { create } from "zustand";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import "bootstrap/dist/css/bootstrap.min.css";

const useCalculatorStore = create((set) => ({
  components: ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "+", "-", "*", "/", "="],
  setComponents: (components) => set({ components }),
}));

export default function CalculatorBuilder() {
  const { components, setComponents } = useCalculatorStore();
  const [expression, setExpression] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = components.indexOf(active.id);
    const newIndex = components.indexOf(over.id);
    setComponents(arrayMove(components, oldIndex, newIndex));
  };

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        setExpression(eval(expression).toString());
      } catch {
        setExpression("Error");
      }
    } else {
      setExpression(expression + value);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center p-4 bg-light min-vh-100">
      <div className="w-50 bg-white p-4 rounded shadow-sm">
        <input value={expression} readOnly className="form-control mb-2 text-end fs-4" />
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={components} strategy={verticalListSortingStrategy}>
            <div className="row g-2">
              {components.map((item) => (
                <div key={item} className="col-3">
                  <SortableItem id={item}>
                    <button
                      className="btn btn-primary w-100 py-2 fs-5"
                      onClick={() => handleButtonClick(item)}
                    >
                      {item}
                    </button>
                  </SortableItem>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
