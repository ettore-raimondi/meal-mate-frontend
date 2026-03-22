import type { Restaurant } from "../../../components/homeTypes";
import RestaurantList from "../RestaurantList";

type RestaurantDirectoryPanelProps = {
  owned: Restaurant[];
  nearby: Restaurant[];
  onSelectOwned: (restaurantId: string) => void;
  onSelectNearby: (restaurantId: string) => void;
};

function RestaurantDirectoryPanel({
  owned,
  nearby,
  onSelectOwned,
  onSelectNearby,
}: RestaurantDirectoryPanelProps) {
  return (
    <div className="restaurant-directory scrollable">
      <section className="restaurant-directory-section">
        <div className="restaurant-list-head">
          <div>
            <h3>My Restaurants</h3>
            <p className="muted-label">
              Manage kitchens you already partner with.
            </p>
          </div>
          <span className="count-pill">{owned.length}</span>
        </div>
        <RestaurantList
          restaurants={owned}
          onSelect={onSelectOwned}
          emptyMessage="No restaurants yet. Add one to begin."
        />
      </section>

      <section className="restaurant-directory-section">
        <div className="restaurant-list-head">
          <div>
            <h3>Restaurants Near Me</h3>
            <p className="muted-label">
              Suggestions pulled from your current location.
            </p>
          </div>
        </div>
        <RestaurantList
          restaurants={nearby}
          onSelect={onSelectNearby}
          emptyMessage="No nearby suggestions yet."
        />
      </section>
    </div>
  );
}

export default RestaurantDirectoryPanel;
