import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ItemGroup from "../components/ItemGroup";
import Items from "../components/Items";
import Cart from "../components/Cart";
import OpeningEntryModal from "../components/Opening/OpeningEntryModal";
import useBarcodeScanner from "../hooks/useBarcodeScanner";
import { BarcodeScannerModal } from "../components/common";
import useCartStore from "../store/cartStore";

const POSTerminalPage = () => {
  const { setTopbar } = useOutletContext();
  const [activeItemGroup, setActiveItemGroup] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [activePane, setActivePane] = useState("products");
  const cartItemCount = useCartStore((state) => state.items.length);

  const handleCameraDetected = useCallback((code) => {
    setShowCameraScanner(false);
    setSearchText(code);
  }, []);

  useEffect(() => {
    setTopbar({
      title: "POS Terminal",
      searchValue: searchText,
      onSearchChange: setSearchText,
      searchPlaceholder: "Scan barcode/serial/batch or search items",
      onScanClick: () => setShowCameraScanner(true),
    });
  }, [searchText, setTopbar]);

  // Lets a cashier scan straight into the item grid without clicking the
  // search box first — feeds the scanned code through the same searchText
  // state the box uses, so it goes through Items' existing debounce/auto-add
  // flow (see AUTO_ADD_MATCH_TYPES in components/Items) with no duplicated logic.
  useBarcodeScanner({ onScan: setSearchText, enabled: !showCameraScanner });

  return (
    <>
      <div className="pos-terminal-tabs" role="tablist" aria-label="POS Terminal sections">
        <button
          type="button"
          role="tab"
          aria-selected={activePane === "products"}
          className={activePane === "products" ? "active" : ""}
          onClick={() => setActivePane("products")}
        >
          <i className="bi bi-grid-3x3-gap" /> Products
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activePane === "cart"}
          className={activePane === "cart" ? "active" : ""}
          onClick={() => setActivePane("cart")}
        >
          <i className="bi bi-cart3" /> Shopping Cart
          {cartItemCount > 0 && <span className="pos-terminal-tab-count">{cartItemCount}</span>}
        </button>
      </div>

      <div className="pos-terminal-panels" style={{ flex: 1, display: "flex", padding: "12px 16px 16px", gap: 16, minHeight: 0 }}>
        <div className={`pos-terminal-pane pos-terminal-products-pane ${activePane === "products" ? "" : "mobile-hidden"}`}>
          <ItemGroup selectedGroup={activeItemGroup} onChangeGroup={setActiveItemGroup} />
          <Items
            selectedGroup={activeItemGroup}
            searchText={searchText}
            onSearchResolved={() => setSearchText("")}
          />
        </div>
        <div className={`pos-terminal-pane pos-terminal-cart-pane ${activePane === "cart" ? "" : "mobile-hidden"}`}>
          <Cart />
        </div>
      </div>

      <OpeningEntryModal />

      <BarcodeScannerModal
        open={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onDetected={handleCameraDetected}
        subtitle="Populates the item search field, same as a hardware scanner"
      />
    </>
  );
};

export default POSTerminalPage;
