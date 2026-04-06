import { useCallback, useState } from "react";
import type { RestaurantEnriched } from "../../../services/restaurant";
import { useRestaurants } from "../../restaurants/hooks";
import CreateRunForm from "./CreateRunForm";
import type {
  RestaurantOption,
  RunFormData,
  RunInitialValues,
} from "../utils/index.ts";

type RunDetailFormTabProps = {
  mode: "create" | "edit";
  initialValues?: RunInitialValues;
  isLocked?: boolean;
  onSubmit?: (payload: RunFormData) => Promise<void> | void;
  onCancel?: () => void;
};

function RunDetailFormTab({
  mode,
  initialValues,
  isLocked = false,
  onSubmit,
  onCancel,
}: RunDetailFormTabProps) {
  const { restaurants: hookRestaurants, refetch } = useRestaurants();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mapToOptions = (items: RestaurantEnriched[]): RestaurantOption[] =>
    items.map((r) => ({ id: r.id, label: r.name }));

  const restaurants = mapToOptions(hookRestaurants);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      await refetch();
    } catch {
      setFetchError("Unable to load your restaurants right now.");
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  return (
    <>
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
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </>
  );
}

export default RunDetailFormTab;
