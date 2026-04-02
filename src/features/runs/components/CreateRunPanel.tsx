import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { RestaurantEnriched } from "../../../services/restaurant";
import { useRestaurants } from "../../restaurants/hooks";
import CreateRunForm from "./CreateRunForm";
import type {
  RestaurantOption,
  RunFormData,
  RunInitialValues,
} from "../utils/index.ts";

type CreateRunPanelProps = {
  mode: "create" | "edit";
  initialValues?: RunInitialValues;
  isLocked?: boolean;
  onSubmit?: (payload: RunFormData) => Promise<void> | void;
  onClose?: () => void;
  actionSlot?: ReactNode;
};

function CreateRunPanel({
  mode,
  initialValues,
  isLocked = false,
  onSubmit,
  onClose,
  actionSlot,
}: CreateRunPanelProps) {
  const { restaurants: hookRestaurants, refetch } = useRestaurants();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mapToOptions = (items: RestaurantEnriched[]): RestaurantOption[] =>
    items.map((restaurant) => ({ id: restaurant.id, label: restaurant.name }));

  const restaurants = mapToOptions(hookRestaurants);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to load restaurants", error);
      setFetchError("Unable to load your restaurants right now.");
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  const panelTitle = mode === "create" ? "Create a run" : "Edit run";
  const panelSubtitle = useMemo(() => {
    if (mode === "create") {
      return "Pick a restaurant, set the cutoff, and we will notify teammates.";
    }
    return initialValues?.name
      ? `Update the details for ${initialValues.name}.`
      : "Update run details.";
  }, [initialValues, mode]);

  const handleSubmit = useCallback(
    async (payload: RunFormData) => {
      if (!onSubmit) {
        return;
      }
      await onSubmit(payload);
      onClose?.();
    },
    [onClose, onSubmit],
  );

  return (
    <section className="panel create-run-panel">
      <div className="panel-head">
        <div className="panel-head-main">
          <button type="button" className="back-link" onClick={onClose}>
            ← Back to runs
          </button>
          <div className="panel-title-stack">
            <div className="panel-title-row">
              <h2>{panelTitle}</h2>
            </div>
            <p className="panel-subtitle">{panelSubtitle}</p>
          </div>
        </div>
        {actionSlot ? <div className="panel-actions">{actionSlot}</div> : null}
      </div>

      {fetchError ? (
        <div className="field-error">
          {fetchError}{" "}
          <button type="button" onClick={handleRefresh}>
            Try again
          </button>
        </div>
      ) : null}

      <CreateRunForm
        mode={mode}
        restaurants={restaurants}
        isLoadingRestaurants={isLoading}
        isLocked={isLocked}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </section>
  );
}

export default CreateRunPanel;
