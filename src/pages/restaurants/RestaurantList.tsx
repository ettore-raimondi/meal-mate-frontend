import type { RestaurantEnriched } from "../../services/restaurant";
import { RestaurantSelectionHandler } from "./types";

type RestaurantListProps = {
  restaurants: RestaurantEnriched[];
  onSelect?: RestaurantSelectionHandler;
  emptyMessage?: string;
};

function RestaurantList({
  restaurants,
  onSelect,
  emptyMessage,
}: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <div className="blank-state">
        <p className="muted-label">
          {emptyMessage ?? "No restaurants yet. Add one to begin."}
        </p>
      </div>
    );
  }

  return (
    <div className="runs-list">
      {restaurants.map((restaurant) => {
        const cardContent = (
          <>
            <div className="run-card-head">
              <h3>{restaurant.name}</h3>
            </div>
            <p>{restaurant.cuisine}</p>
            <div className="run-meta">
              <span>{restaurant.address}</span>
            </div>
          </>
        );

        if (!onSelect) {
          return (
            <div
              key={restaurant.id}
              className="list-card run-card list-card--static"
            >
              {cardContent}
            </div>
          );
        }

        return (
          <button
            key={restaurant.id}
            className="list-card run-card"
            type="button"
            onClick={() => onSelect(restaurant.id)}
          >
            {cardContent}
          </button>
        );
      })}
    </div>
  );
}

export default RestaurantList;
