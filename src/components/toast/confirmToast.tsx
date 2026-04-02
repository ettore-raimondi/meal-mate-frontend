import { toast } from "sonner";

type ConfirmTone = "default" | "danger";

export type ConfirmToastOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
};

export const confirmToast = (
  options: ConfirmToastOptions = {},
): Promise<boolean> => {
  const {
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "default",
  } = options;

  return new Promise((resolve) => {
    toast.custom((t) => (
      <div
        className={`confirm-toast${tone === "danger" ? " confirm-toast-danger" : ""}`}
      >
        <div className="confirm-toast-body">
          <p className="confirm-toast-title">{title}</p>
          {description ? (
            <p className="confirm-toast-description">{description}</p>
          ) : null}
        </div>
        <div className="confirm-toast-actions">
          <button
            type="button"
            className="confirm-toast-button"
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-toast-button confirm"
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ));
  });
};
