import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MenuDraftMode, MenuDraftState } from "../utils/index.ts";

type RestaurantMenuEditorProps = {
  mode: MenuDraftMode;
  draft: MenuDraftState;
  onChange: (field: keyof MenuDraftState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  onCancel: () => void;
};

function RestaurantMenuEditor({
  mode,
  draft,
  onChange,
  onSubmit,
  onDelete,
  onCancel,
}: RestaurantMenuEditorProps) {
  const isEditMode = mode.type === "edit";
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false);
  const previewUrl = useMemo(() => draft.imageUrl.trim(), [draft.imageUrl]);

  useEffect(() => {
    setPreviewLoadFailed(false);
  }, [previewUrl]);

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
              placeholder="€12.00"
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
        <div className="menu-editor-image-preview">
          <p className="section-label">Preview</p>
          {!previewUrl ? (
            <div className="menu-editor-image-fallback">
              Add an image URL to preview the menu item image.
            </div>
          ) : previewLoadFailed ? (
            <div className="menu-editor-image-fallback">
              Could not load image preview.
            </div>
          ) : (
            <img
              src={previewUrl}
              alt={draft.name || "Menu item preview"}
              className="menu-editor-image"
              loading="lazy"
              onError={() => setPreviewLoadFailed(true)}
            />
          )}
        </div>
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
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Back to restaurant
          </button>
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
