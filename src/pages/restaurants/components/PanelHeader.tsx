type PanelHeaderProps = {
  viewingDetail: boolean;
  isEditingMenu: boolean;
  isShowingMenuView: boolean;
  panelTitle: string;
  panelSubtitle: string;
  activeRestaurantName?: string;
  onBack: () => void;
  onBeginCreate: () => void;
};

function PanelHeader({
  viewingDetail,
  isEditingMenu,
  isShowingMenuView,
  panelTitle,
  panelSubtitle,
  activeRestaurantName,
  onBack,
  onBeginCreate,
}: PanelHeaderProps) {
  return (
    <div className="panel-head">
      <div className="panel-head-main">
        {viewingDetail && (
          <button className="back-link" onClick={onBack} type="button">
            <span className="back-link-icon" aria-hidden="true">
              ←
            </span>
            <span>
              {isEditingMenu
                ? `Back to ${activeRestaurantName ?? "details"}`
                : isShowingMenuView
                  ? "Back to details"
                  : "Back to restaurants"}
            </span>
          </button>
        )}
        {!isEditingMenu && (
          <div className="panel-title-stack">
            <div className="panel-title-row">
              <h2>{panelTitle}</h2>
            </div>
            <p className="panel-subtitle">{panelSubtitle}</p>
          </div>
        )}
      </div>
      {!viewingDetail && (
        <div className="panel-head-actions">
          <button className="btn" type="button" onClick={onBeginCreate}>
            New restaurant
          </button>
        </div>
      )}
    </div>
  );
}

export default PanelHeader;
