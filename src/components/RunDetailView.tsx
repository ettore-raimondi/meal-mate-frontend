import { MenuItem, Restaurant } from "./homeTypes";

type RunDetailViewProps = {
  runRestaurant?: Restaurant;
  menuItems: MenuItem[];
  activeRunId?: string;
  activeItemId: string | null;
  onSelectMenuItem: (itemId: string) => void;
};

function RunDetailView({
  runRestaurant,
  menuItems,
  activeRunId,
  activeItemId,
  onSelectMenuItem,
}: RunDetailViewProps) {
  return (
    <section className="menu-section">
      <div className="menu-section-head">
        <div>
          <h4>Menu</h4>
          <p className="muted-label">
            {runRestaurant
              ? `Favorites from ${runRestaurant.name}`
              : "Select a run to preview the menu"}
          </p>
        </div>
        <span className="muted-label">
          {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <article
              key={`${activeRunId ?? "run"}-${item.id}`}
              className={`menu-card list-card list-card--inline ${item.id === activeItemId ? "is-active" : ""}`}
              onClick={() => onSelectMenuItem(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectMenuItem(item.id);
                }
              }}
            >
              <div className="menu-card-info">
                <h4>{item.name}</h4>
                <p>{item.price}</p>
              </div>
              <button
                className="btn btn-ghost btn-icon"
                aria-label={`Add ${item.name} to order`}
                type="button"
              >
                +
              </button>
            </article>
          ))
        ) : (
          <p className="muted-label">Menu coming soon.</p>
        )}
      </div>
    </section>
  );
}

export default RunDetailView;
