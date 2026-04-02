type RestaurantMenuPlaceholderProps = {
  title?: string;
  subtitle?: string;
  helperText?: string;
};

function RestaurantMenuPlaceholder({
  title = "Menu Items",
  subtitle = "Menu editing unlocks after the restaurant is created.",
  helperText = "Save the restaurant to start adding dishes.",
}: RestaurantMenuPlaceholderProps) {
  return (
    <div className="restaurant-menu-layout">
      <div className="menu-section-head">
        <div>
          <h4>{title}</h4>
          <p className="muted-label">{subtitle}</p>
        </div>
        <button className="btn btn-ghost" type="button" disabled>
          Add item
        </button>
      </div>
      <p className="muted-label">{helperText}</p>
    </div>
  );
}

export default RestaurantMenuPlaceholder;
