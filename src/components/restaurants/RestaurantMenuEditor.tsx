import { FormEvent } from "react";
import { MenuDraftMode, MenuDraftState } from "./types";

type RestaurantMenuEditorProps = {
  mode: MenuDraftMode;
  draft: MenuDraftState;
  onChange: (field: keyof MenuDraftState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
};

function RestaurantMenuEditor({
  mode,
  draft,
  onChange,
  onSubmit,
  onDelete,
}: RestaurantMenuEditorProps) {
  const isEditMode = mode.type === "edit";
  return (
    <div className="restaurant-menu-editor">
      <div className="menu-editor-header">
        <h3>{isEditMode ? "Edit menu item" : "Add menu item"}</h3>
        <p className="muted-label">
          {isEditMode
            ? "Update the details and save your changes."
            : "Create a new dish for this restaurant."}
        </p>
      </div>
      <form className="menu-editor-card" onSubmit={onSubmit}>
        <div className="menu-inline-row">
          <label>
            Name
            <input
              value={draft.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="Menu item name"
              required
            />
          </label>
          <label>
            Price
            <input
              value={draft.price}
              onChange={(event) => onChange("price", event.target.value)}
              placeholder="$12.00"
              required
            />
          </label>
        </div>
        <label>
          Image URL
          <input
            value={draft.imageUrl}
            onChange={(event) => onChange("imageUrl", event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </label>
        <label>
          Description
          <textarea
            value={draft.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={3}
            placeholder="Describe the dish"
          />
        </label>
        <div className="menu-inline-actions">
          <div className="menu-inline-actions-primary">
            <button className="btn" type="submit">
              {isEditMode ? "Save item" : "Create item"}
            </button>
          </div>
          {isEditMode && onDelete && (
            <div className="menu-inline-actions-danger">
              <button
                className="btn btn-outline btn-danger"
                type="button"
                onClick={onDelete}
              >
                Delete item
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default RestaurantMenuEditor;
