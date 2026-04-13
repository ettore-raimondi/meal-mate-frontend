import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import type { MenuItem } from "../../../services/menu-item";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "../../../services/restaurant/restaurant.service";
import type {
  RestaurantEnriched,
  RestaurantFormData,
} from "../../../services/restaurant";
import {
  NEW_RESTAURANT_SLUG,
  useNearbyRestaurants,
  useRestaurants,
  useRestaurantSelection,
} from "../hooks/index.ts";
import {
  deleteMenuItem,
  getMenuItemsForRestaurant,
  saveMenuItems,
  scrapeMenuItems,
  updateMenuItems as updateMenuItemsService,
} from "../../../services/menu-item";
import { confirmToast } from "../../../components/toast/confirmToast";
import { toast } from "sonner";
import PanelHeader from "../components/PanelHeader";
import RestaurantDirectoryPanel from "../components/RestaurantDirectoryPanel";
import RestaurantDetailPanel, {
  type RestaurantDetailActions,
  type RestaurantDetailState,
} from "../components/RestaurantDetailPanel";
import {
  emptyMenuDraft,
  emptyRestaurantForm,
  type MenuDraftMode,
  type MenuDraftState,
  type RestaurantFormState,
} from "../utils/index.ts";

let nextTempMenuItemId = -1;
const generateMenuItemTempId = () => nextTempMenuItemId--;

const toRestaurantFormState = (
  restaurant?: Partial<RestaurantEnriched> | null,
): RestaurantFormState => ({
  name: restaurant?.name ?? "",
  address: restaurant?.address ?? "",
  phoneNumber: restaurant?.phoneNumber ?? "",
  websiteUrl: restaurant?.websiteUrl ?? "",
  description: restaurant?.description ?? "",
});

function Restaurants() {
  const navigate = useNavigate();
  const { restaurantNumber } = useParams<{ restaurantNumber?: string }>();
  const { restaurants, refetch } = useRestaurants();
  const { restaurants: restaurantsNearMe, refetch: refetchNearby } =
    useNearbyRestaurants();
  const [menuEditorMode, setMenuEditorMode] = useState<MenuDraftMode | null>(
    null,
  );
  const [menuEditor, setMenuEditor] = useState<MenuDraftState>(emptyMenuDraft);
  const [restaurantForm, setRestaurantForm] =
    useState<RestaurantFormState>(emptyRestaurantForm);
  const [newRestaurantMenu, setNewRestaurantMenu] = useState<MenuItem[]>([]);
  const [editableRestaurant, setEditableRestaurant] = useState<
    RestaurantEnriched | undefined
  >(undefined);
  const [isSavingNearby, setIsSavingNearby] = useState(false);
  const [showingMenuView, setShowingMenuView] = useState(false);

  const {
    isCreatingRestaurant,
    viewingDetail,
    restaurantRouteId,
    activeRestaurant,
    activeRestaurantSource,
  } = useRestaurantSelection(restaurantNumber, restaurants, restaurantsNearMe);

  const selectedRestaurant =
    editableRestaurant &&
    activeRestaurant &&
    editableRestaurant.id === activeRestaurant.id
      ? editableRestaurant
      : activeRestaurant;

  const currentMenuItems = isCreatingRestaurant
    ? newRestaurantMenu
    : (selectedRestaurant?.menuItems ?? []);
  const isNearbyRestaurantDetail =
    activeRestaurantSource === "nearby" &&
    viewingDetail &&
    !isCreatingRestaurant;
  const isEditingMenu = Boolean(menuEditorMode);
  const isShowingMenuView =
    showingMenuView && viewingDetail && !isCreatingRestaurant && !isEditingMenu;

  useEffect(() => {
    if (!restaurantRouteId) {
      return;
    }
    if (
      !activeRestaurant &&
      (restaurants.length > 0 || restaurantsNearMe.length > 0)
    ) {
      navigate("/restaurants", { replace: true });
    }
  }, [
    restaurantRouteId,
    activeRestaurant,
    restaurants.length,
    restaurantsNearMe.length,
    navigate,
  ]);

  useEffect(() => {
    if (isCreatingRestaurant) {
      setEditableRestaurant(undefined);
      setRestaurantForm(emptyRestaurantForm);
      setNewRestaurantMenu([]);
      return;
    }
    if (activeRestaurant) {
      setEditableRestaurant(activeRestaurant);
      setRestaurantForm(toRestaurantFormState(activeRestaurant));
    } else {
      setEditableRestaurant(undefined);
      setRestaurantForm(emptyRestaurantForm);
    }
  }, [activeRestaurant, isCreatingRestaurant]);

  useEffect(() => {
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
  }, [restaurantNumber]);

  useEffect(() => {
    if (!viewingDetail) {
      setMenuEditorMode(null);
      setMenuEditor(emptyMenuDraft);
    }
  }, [viewingDetail]);

  const panelTitle = isCreatingRestaurant
    ? "Add Restaurant"
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? activeRestaurant.name
      : "Restaurants";

  const panelSubtitle = isCreatingRestaurant
    ? "List a new kitchen and get it ready for runs."
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? isNearbyRestaurantDetail
        ? `${activeRestaurant.address} · Suggested nearby kitchen`
        : `${activeRestaurant.address} · ${activeRestaurant.cuisine}`
      : "Browse all partner kitchens.";

  const handleSelectRestaurant = async (restaurantId: number) => {
    setShowingMenuView(false);
    try {
      const menuItems = await getMenuItemsForRestaurant(restaurantId);
      const restaurant = restaurants.find((entry) => entry.id === restaurantId);
      if (restaurant) {
        setEditableRestaurant({
          ...restaurant,
          menuItems,
        });
      }
    } catch (error) {
      console.error("Failed to load menu items:", error);
      toast.error("Couldn't load the latest menu items.");
    } finally {
      navigate(`/restaurants/${restaurantId}`);
    }
  };

  const handleSelectNearbyRestaurant = (restaurantId: number) => {
    setShowingMenuView(false);
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleBackToRestaurants = () => {
    setShowingMenuView(false);
    navigate("/restaurants");
  };

  const handleBeginCreateRestaurant = () => {
    setShowingMenuView(false);
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
    navigate(`/restaurants/${NEW_RESTAURANT_SLUG}`);
  };

  const validateRequiredFields = (
    context: "create" | "saveNearby",
  ): boolean => {
    const missingField =
      (!restaurantForm.name && "name") ||
      (!restaurantForm.address && "address") ||
      (!restaurantForm.phoneNumber && "phone number");

    if (missingField) {
      const intent =
        context === "create"
          ? "creating a restaurant"
          : "saving to My Restaurants";
      toast.error(`Add a ${missingField} before ${intent}.`);
      return false;
    }
    return true;
  };

  const requestRestaurantDeletion = async () => {
    if (!activeRestaurant) {
      return;
    }
    const confirmed = await confirmToast({
      title: isNearbyRestaurantDetail
        ? "Remove suggestion?"
        : "Delete restaurant?",
      description: isNearbyRestaurantDetail
        ? `This only removes ${activeRestaurant.name} from nearby suggestions.`
        : `This permanently deletes ${activeRestaurant.name} and its menu items.`,
      confirmLabel: isNearbyRestaurantDetail ? "Remove" : "Delete",
      cancelLabel: "Cancel",
      tone: "danger",
    });
    if (!confirmed) {
      return;
    }
    await handleDeleteRestaurant(activeRestaurant.id);
  };

  const handleDeleteRestaurant = async (restaurantId: number) => {
    try {
      await deleteRestaurant(restaurantId);
      await refetch();
      navigate("/restaurants");
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
    }
  };

  const handleScrapeMenuItems = async (websiteUrl: string) => {
    if (!websiteUrl) {
      toast.error("Enter the restaurant's website URL to scrape menu items.");
      return;
    }

    try {
      const menuItems = await scrapeMenuItems(websiteUrl);
      if (!menuItems.length) {
        toast.error(
          "Couldn't find any menu items on the website for this restaurant.",
        );
        return;
      }

      updateMenuItems((prev) => [
        ...menuItems.map((item) => ({ ...item, clientState: "new" as const })),
        ...prev,
      ]);

      setShowingMenuView(true);
      toast.success("Scraped menu items added. Review and save your changes.");
    } catch (error) {
      console.error("Failed to scrape menu items:", error);
      toast.error("Menu scraping failed. Please try again.");
    }
  };

  const handleRestaurantFormChange = (
    field: keyof RestaurantFormState,
    value: string,
  ) => {
    setRestaurantForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMenuItems = (updater: (previous: MenuItem[]) => MenuItem[]) => {
    if (isCreatingRestaurant) {
      setNewRestaurantMenu((prev) => updater(prev));
      return;
    }
    if (!selectedRestaurant) {
      return;
    }
    setEditableRestaurant((prev) => {
      const restaurant = prev ?? selectedRestaurant;
      return {
        ...restaurant,
        menuItems: updater(restaurant.menuItems ?? []),
      };
    });
  };

  const beginAddMenuItem = () => {
    setMenuEditor(emptyMenuDraft);
    setMenuEditorMode({ type: "add" });
  };

  const beginEditMenuItem = (item: MenuItem) => {
    setMenuEditor({
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      description: item.description,
    });
    setMenuEditorMode({ type: "edit", itemId: item.id });
  };

  const cancelMenuEditor = () => {
    setMenuEditor(emptyMenuDraft);
    setMenuEditorMode(null);
  };

  const handleMenuEditorChange = (
    field: keyof MenuDraftState,
    value: string,
  ) => {
    setMenuEditor((prev) => ({ ...prev, [field]: value }));
  };

  const handleMenuEditorSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!menuEditor.name || !menuEditor.price || !menuEditorMode) {
      return;
    }

    if (menuEditorMode.type === "edit") {
      const targetId = menuEditorMode.itemId;
      updateMenuItems((prevMenu) =>
        prevMenu.map((item) => {
          if (item.id !== targetId) {
            return item;
          }
          const nextClientState =
            item.clientState === "new" ? "new" : "toUpdate";
          return { ...item, ...menuEditor, clientState: nextClientState };
        }),
      );
      cancelMenuEditor();
      return;
    }

    const newItem: MenuItem = {
      id: generateMenuItemTempId(),
      name: menuEditor.name,
      price: menuEditor.price,
      description: menuEditor.description,
      imageUrl: menuEditor.imageUrl,
      clientState: "new",
    };
    updateMenuItems((prevMenu) => [newItem, ...prevMenu]);
    cancelMenuEditor();
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    const sourceMenu = isCreatingRestaurant
      ? newRestaurantMenu
      : (selectedRestaurant?.menuItems ?? []);
    const targetItem = sourceMenu.find((item) => item.id === itemId);

    const confirmed = await confirmToast({
      title: "Delete menu item?",
      description: targetItem
        ? `This removes ${targetItem.name} from the menu.`
        : "This removes the item from the menu.",
      confirmLabel: "Delete item",
      cancelLabel: "Cancel",
      tone: "danger",
    });

    if (!confirmed) {
      return;
    }

    if (itemId > 0) {
      await deleteMenuItem(itemId);
    }

    updateMenuItems((prevMenu) =>
      prevMenu.filter((item) => item.id !== itemId),
    );
    if (menuEditorMode?.type === "edit" && menuEditorMode.itemId === itemId) {
      cancelMenuEditor();
    }
  };

  const handleCreateRestaurant = async (restaurantForm: RestaurantFormData) => {
    if (!validateRequiredFields("create")) {
      return;
    }

    const createdRestaurant = await createRestaurant(restaurantForm);
    if (newRestaurantMenu.length > 0) {
      await saveMenuItems(createdRestaurant.id, newRestaurantMenu);
    }
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh restaurants", error);
    }
    setNewRestaurantMenu([]);
    navigate(`/restaurants/${createdRestaurant.id}`);
    toast.success(`${createdRestaurant.name} has been created.`);
  };

  const handleUpdateRestaurant = async (restaurantForm: RestaurantFormData) => {
    if (!selectedRestaurant) {
      return undefined;
    }

    const updatedRestaurant = await updateRestaurant(
      selectedRestaurant.id,
      restaurantForm,
    );

    await updateMenuItemsService(
      selectedRestaurant.id,
      selectedRestaurant.menuItems ?? [],
    );

    await refetch();
    const refreshedMenuItems = await getMenuItemsForRestaurant(
      selectedRestaurant.id,
    );
    setEditableRestaurant((prev) =>
      prev
        ? {
            ...prev,
            ...updatedRestaurant,
            menuItems: refreshedMenuItems,
          }
        : prev,
    );
    return updatedRestaurant.name;
  };

  const handleRestaurantFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isCreatingRestaurant) {
      await handleCreateRestaurant(restaurantForm);
      return;
    }
    await handleUpdateRestaurant(restaurantForm);
  };

  const handleSaveRestaurantDetails = async () => {
    return handleUpdateRestaurant(restaurantForm);
  };

  const handleSaveNearbyRestaurant = async () => {
    if (
      !activeRestaurant ||
      activeRestaurantSource !== "nearby" ||
      isSavingNearby
    ) {
      return;
    }
    if (!validateRequiredFields("saveNearby")) {
      return;
    }
    setIsSavingNearby(true);
    try {
      const payload: RestaurantFormData = {
        name: restaurantForm.name,
        address: restaurantForm.address,
        phoneNumber: restaurantForm.phoneNumber,
        websiteUrl: restaurantForm.websiteUrl,
        description: restaurantForm.description,
        ...(activeRestaurant.googlePlacesId
          ? { googlePlacesId: activeRestaurant.googlePlacesId }
          : {}),
      };
      const createdRestaurant = await createRestaurant(payload);
      await refetch();
      await refetchNearby();
      navigate(`/restaurants/${createdRestaurant.id}`);
      toast.success(`${createdRestaurant.name} saved to My Restaurants.`);
    } catch (error) {
      console.error("Failed to save nearby restaurant", error);
      toast.error("Could not save that restaurant. Please try again.");
    } finally {
      setIsSavingNearby(false);
    }
  };

  const detailState: RestaurantDetailState = {
    viewingDetail,
    isCreatingRestaurant,
    menuEditorMode,
    menuEditor,
    restaurantForm,
    currentMenuItems,
    activeRestaurant: selectedRestaurant,
    isNearbyRestaurantDetail,
    isSavingNearby,
    showingMenuView,
  };

  const detailActions: RestaurantDetailActions = {
    onMenuEditorChange: handleMenuEditorChange,
    onMenuEditorSubmit: handleMenuEditorSubmit,
    onMenuEditorDelete:
      menuEditorMode?.type === "edit"
        ? () => {
            void handleDeleteMenuItem(menuEditorMode.itemId);
          }
        : undefined,
    onCancelMenuEditor: cancelMenuEditor,
    onRestaurantFormChange: handleRestaurantFormChange,
    onRestaurantFormSubmit: handleRestaurantFormSubmit,
    beginAddMenuItem,
    beginEditMenuItem,
    onDeleteMenuItem: (item) => {
      void handleDeleteMenuItem(item.id);
    },
    onSaveRestaurantDetails: handleSaveRestaurantDetails,
    onSaveNearbyRestaurant: handleSaveNearbyRestaurant,
    onDeleteRestaurant: selectedRestaurant
      ? requestRestaurantDeletion
      : undefined,
    onScrapeMenuItems: handleScrapeMenuItems,
    setShowingMenuView,
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem="restaurants" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <PanelHeader
            viewingDetail={viewingDetail}
            isEditingMenu={isEditingMenu}
            isShowingMenuView={isShowingMenuView}
            panelTitle={panelTitle}
            panelSubtitle={panelSubtitle}
            activeRestaurantName={selectedRestaurant?.name}
            onBack={
              isEditingMenu
                ? cancelMenuEditor
                : isShowingMenuView
                  ? () => setShowingMenuView(false)
                  : handleBackToRestaurants
            }
            onBeginCreate={handleBeginCreateRestaurant}
          />

          <div className="runs-grid">
            {viewingDetail ? (
              <RestaurantDetailPanel
                state={detailState}
                actions={detailActions}
              />
            ) : (
              <RestaurantDirectoryPanel
                owned={restaurants}
                nearby={restaurantsNearMe}
                onSelectOwned={handleSelectRestaurant}
                onSelectNearby={handleSelectNearbyRestaurant}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Restaurants;
