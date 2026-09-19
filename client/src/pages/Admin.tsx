import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  RefreshCw,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  status: "new" | "in_progress" | "responded" | "closed";
  created_at: string;
};

type LivestockRequest = {
  id: string;
  selected_line: string | null;
  name: string;
  email: string;
  phone: string | null;
  species: "neocaridina" | "caridina" | "either" | "not_sure";
  quantity: number | null;
  shipping_location: string | null;
  notes: string | null;
  status: "new" | "reviewing" | "quoted" | "fulfilled" | "closed";
  created_at: string;
};

type Availability =
  | "available"
  | "limited"
  | "accepting_requests"
  | "out_of_stock"
  | "coming_soon";
type InventoryItem = {
  id: string;
  family: "neocaridina" | "caridina";
  name: string;
  availability: Availability;
  quantity: number;
  price: number;
  minimum_order: number;
};
type InventoryDraft = {
  availability: Availability;
  quantity: string;
  price: string;
  minimum_order: string;
};
type View = "inquiries" | "requests";

const availabilityOptions: Availability[] = [
  "available",
  "limited",
  "accepting_requests",
  "out_of_stock",
  "coming_soon",
];
const availabilityLabels: Record<Availability, string> = {
  available: "In stock",
  limited: "Limited availability",
  accepting_requests: "Accepting requests",
  out_of_stock: "Out of stock",
  coming_soon: "Coming soon",
};
const inquiryStatuses: Inquiry["status"][] = [
  "new",
  "in_progress",
  "responded",
  "closed",
];
const requestStatuses: LivestockRequest["status"][] = [
  "new",
  "reviewing",
  "quoted",
  "fulfilled",
  "closed",
];

function toDraft(item: InventoryItem): InventoryDraft {
  return {
    availability: item.availability,
    quantity: String(item.quantity),
    price: String(item.price),
    minimum_order: String(item.minimum_order),
  };
}

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryDrafts, setInventoryDrafts] = useState<
    Record<string, InventoryDraft>
  >({});
  const [savingInventoryId, setSavingInventoryId] = useState<string | null>(
    null
  );
  const [inventoryNotice, setInventoryNotice] = useState("");
  const [view, setView] = useState<View>("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [requests, setRequests] = useState<LivestockRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    setLoading(true);
    setError("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setAllowed(false);
      setLoading(false);
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (profileError || profile?.role !== "admin") {
      setAllowed(false);
      setLoading(false);
      return;
    }
    setAllowed(true);
    await loadData();
  }

  async function loadData() {
    setLoading(true);
    setError("");
    const [inquiryResult, requestResult, inventoryResult] = await Promise.all([
      supabase
        .from("inquiries")
        .select(
          "id, name, email, phone, inquiry_type, message, status, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("livestock_requests")
        .select(
          "id, selected_line, name, email, phone, species, quantity, shipping_location, notes, status, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("inventory_items")
        .select(
          "id, family, name, availability, quantity, price, minimum_order"
        )
        .order("family", { ascending: true })
        .order("sort_order", { ascending: true }),
    ]);

    const loadError =
      inquiryResult.error || requestResult.error || inventoryResult.error;
    if (loadError) {
      setError(loadError.message || "Unable to load admin data.");
    } else {
      const loadedInventory = (inventoryResult.data ?? []) as InventoryItem[];
      setInquiries((inquiryResult.data ?? []) as Inquiry[]);
      setRequests((requestResult.data ?? []) as LivestockRequest[]);
      setInventory(loadedInventory);
      setInventoryDrafts(
        Object.fromEntries(
          loadedInventory.map(item => [item.id, toDraft(item)])
        )
      );
    }
    setLoading(false);
  }

  async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (updateError) setError(updateError.message);
    else
      setInquiries(current =>
        current.map(item => (item.id === id ? { ...item, status } : item))
      );
  }

  async function updateRequestStatus(
    id: string,
    status: LivestockRequest["status"]
  ) {
    const { error: updateError } = await supabase
      .from("livestock_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (updateError) setError(updateError.message);
    else
      setRequests(current =>
        current.map(item => (item.id === id ? { ...item, status } : item))
      );
  }

  function updateInventoryDraft(
    id: string,
    field: keyof InventoryDraft,
    value: string
  ) {
    setInventoryNotice("");
    setError("");
    setInventoryDrafts(current => ({
      ...current,
      [id]: { ...current[id], [field]: value },
    }));
  }

  async function saveInventoryItem(item: InventoryItem) {
    const draft = inventoryDrafts[item.id];
    if (!draft || savingInventoryId) return;

    const price = Number(draft.price);
    const quantity = Number(draft.quantity);
    const minimumOrder = Number(draft.minimum_order);
    const numericValuesAreValid =
      Number.isFinite(price) &&
      Number.isInteger(quantity) &&
      Number.isInteger(minimumOrder) &&
      price >= 0 &&
      quantity >= 0 &&
      minimumOrder >= 0;

    if (!numericValuesAreValid) {
      setError(
        `${item.name}: enter non-negative values; quantity and minimum order must be whole numbers.`
      );
      return;
    }

    if (
      (draft.availability === "available" ||
        draft.availability === "limited") &&
      (price <= 0 ||
        quantity <= 0 ||
        minimumOrder <= 0 ||
        minimumOrder > quantity)
    ) {
      setError(
        `${item.name}: in-stock or limited lines need a positive price, quantity, and minimum order, and the minimum cannot exceed quantity.`
      );
      return;
    }

    setSavingInventoryId(item.id);
    setError("");
    setInventoryNotice("");

    const { data, error: updateError } = await supabase
      .from("inventory_items")
      .update({
        availability: draft.availability,
        price,
        quantity,
        minimum_order: minimumOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)
      .select("id, family, name, availability, quantity, price, minimum_order")
      .single();

    if (updateError || !data) {
      setError(updateError?.message || `Unable to save ${item.name}.`);
    } else {
      const saved = data as InventoryItem;
      setInventory(current =>
        current.map(entry => (entry.id === item.id ? saved : entry))
      );
      setInventoryDrafts(current => ({
        ...current,
        [item.id]: toDraft(saved),
      }));
      setInventoryNotice(
        `${item.name} was saved and the public catalog now uses these values.`
      );
    }
    setSavingInventoryId(null);
  }

  const visibleInquiries = useMemo(
    () =>
      filter === "all"
        ? inquiries
        : inquiries.filter(item => item.status === filter),
    [filter, inquiries]
  );
  const visibleRequests = useMemo(
    () =>
      filter === "all"
        ? requests
        : requests.filter(item => item.status === filter),
    [filter, requests]
  );
  const counts = (items: Array<{ status: string }>, status: string) =>
    items.filter(item => item.status === status).length;

  if (loading && allowed === null)
    return (
      <div className="admin-page">
        <div className="page-width admin-page__inner">
          <p className="admin-loading">Checking admin access...</p>
        </div>
      </div>
    );

  if (allowed === false) {
    return (
      <div className="admin-page">
        <div className="page-width admin-page__inner">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to Ebi Tsū
          </Link>
          <div className="admin-denied">
            <ShieldCheck size={28} />
            <span className="section-label">
              <span>06</span> Private area
            </span>
            <h1>
              Admin access
              <br />
              <em>required.</em>
            </h1>
            <p>
              This area is reserved for the Ebi Tsū admin account. Sign in with
              the authorized account and try again.
            </p>
            <Link href="/account" className="button button--dark">
              Go to account <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statuses = view === "inquiries" ? inquiryStatuses : requestStatuses;
  const items = view === "inquiries" ? visibleInquiries : visibleRequests;

  return (
    <div className="admin-page">
      <div className="page-width admin-page__inner">
        <div className="admin-topline">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to Ebi Tsū
          </Link>
          <button
            className="admin-refresh"
            type="button"
            onClick={() => void loadData()}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <div className="admin-heading">
          <div>
            <span className="section-label">
              <span>06</span> Private admin
            </span>
            <h1>
              {view === "inquiries" ? (
                <>
                  Inquiry
                  <br />
                  <em>inbox.</em>
                </>
              ) : (
                <>
                  Livestock
                  <br />
                  <em>requests.</em>
                </>
              )}
            </h1>
            <p>
              {view === "inquiries"
                ? "A private working view of every customer conversation saved through Ebi Tsū."
                : "A structured view of customers looking for future livestock availability."}
            </p>
          </div>
          <div className="admin-heading__mark">
            <ShieldCheck size={18} /> Admin access verified
          </div>
        </div>

        <section className="admin-inventory">
          <div className="profile-form__heading">
            <div>
              <span className="account-panel__eyebrow">Catalog control</span>
              <h2>Availability management</h2>
            </div>
            <span className="account-activity__count">
              {inventory.length} lines
            </span>
          </div>
          <p className="admin-inventory__intro">
            Edit a complete draft, then save once. In-stock and limited lines
            require a positive price, quantity, and minimum order.
          </p>
          {inventoryNotice && (
            <p className="admin-inventory__success">
              <Check size={14} /> {inventoryNotice}
            </p>
          )}
          {inventory.length === 0 ? (
            <p className="admin-loading">No catalog entries yet.</p>
          ) : (
            <div className="admin-inventory__list">
              {inventory.map(item => {
                const draft = inventoryDrafts[item.id] ?? toDraft(item);
                const isSaving = savingInventoryId === item.id;
                const isDirty =
                  draft.availability !== item.availability ||
                  Number(draft.quantity) !== item.quantity ||
                  Number(draft.price) !== Number(item.price) ||
                  Number(draft.minimum_order) !== item.minimum_order;
                return (
                  <div className="admin-inventory-row" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.family}</span>
                    </div>
                    <select
                      value={draft.availability}
                      onChange={event =>
                        updateInventoryDraft(
                          item.id,
                          "availability",
                          event.target.value
                        )
                      }
                      aria-label={`Availability for ${item.name}`}
                      disabled={isSaving}
                    >
                      {availabilityOptions.map(option => (
                        <option key={option} value={option}>
                          {availabilityLabels[option]}
                        </option>
                      ))}
                    </select>
                    <label>
                      <small>Qty</small>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draft.quantity}
                        onChange={event =>
                          updateInventoryDraft(
                            item.id,
                            "quantity",
                            event.target.value
                          )
                        }
                        disabled={isSaving}
                      />
                    </label>
                    <label>
                      <small>Price</small>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft.price}
                        onChange={event =>
                          updateInventoryDraft(
                            item.id,
                            "price",
                            event.target.value
                          )
                        }
                        disabled={isSaving}
                      />
                    </label>
                    <label>
                      <small>Min</small>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draft.minimum_order}
                        onChange={event =>
                          updateInventoryDraft(
                            item.id,
                            "minimum_order",
                            event.target.value
                          )
                        }
                        disabled={isSaving}
                      />
                    </label>
                    <button
                      className="admin-inventory-row__save"
                      type="button"
                      disabled={!isDirty || isSaving}
                      onClick={() => void saveInventoryItem(item)}
                    >
                      <Save size={13} /> {isSaving ? "Saving" : "Save"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="admin-view-switch">
          <button
            className={
              view === "inquiries"
                ? "admin-view-switch__button admin-view-switch__button--active"
                : "admin-view-switch__button"
            }
            onClick={() => {
              setView("inquiries");
              setFilter("all");
            }}
          >
            General inquiries <strong>{inquiries.length}</strong>
          </button>
          <button
            className={
              view === "requests"
                ? "admin-view-switch__button admin-view-switch__button--active"
                : "admin-view-switch__button"
            }
            onClick={() => {
              setView("requests");
              setFilter("all");
            }}
          >
            Livestock requests <strong>{requests.length}</strong>
          </button>
        </div>
        <div className="admin-stats">
          <button
            className={
              filter === "all" ? "admin-stat admin-stat--active" : "admin-stat"
            }
            onClick={() => setFilter("all")}
          >
            <span>Total</span>
            <strong>{items.length}</strong>
          </button>
          {statuses.map(status => (
            <button
              key={status}
              className={
                filter === status
                  ? "admin-stat admin-stat--active"
                  : "admin-stat"
              }
              onClick={() => setFilter(status)}
            >
              <span>{status.replace("_", " ")}</span>
              <strong>
                {counts(view === "inquiries" ? inquiries : requests, status)}
              </strong>
            </button>
          ))}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p className="admin-loading">Loading...</p>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <span>No records in this view.</span>
            <p>
              New{" "}
              {view === "inquiries" ? "conversations" : "livestock requests"}{" "}
              will appear here as they arrive.
            </p>
          </div>
        ) : view === "inquiries" ? (
          <div className="inquiry-list">
            {visibleInquiries.map(inquiry => (
              <details className="inquiry-card" key={inquiry.id}>
                <summary className="inquiry-card__summary">
                  <span>
                    {inquiry.name} · {inquiry.inquiry_type}
                  </span>
                  <b>View details</b>
                </summary>
                <div className="inquiry-card__meta">
                  <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                  <select
                    value={inquiry.status}
                    onChange={event =>
                      void updateInquiryStatus(
                        inquiry.id,
                        event.target.value as Inquiry["status"]
                      )
                    }
                    aria-label={`Status for ${inquiry.name}`}
                  >
                    {inquiryStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inquiry-card__body">
                  <div>
                    <span className="inquiry-card__type">
                      {inquiry.inquiry_type}
                    </span>
                    <h2>{inquiry.name}</h2>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    {inquiry.phone && (
                      <span className="inquiry-card__phone">
                        {inquiry.phone}
                      </span>
                    )}
                  </div>
                  <p>{inquiry.message}</p>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="inquiry-list">
            {visibleRequests.map(request => (
              <details
                className="inquiry-card livestock-request-card"
                key={request.id}
              >
                <summary className="inquiry-card__summary">
                  <span>
                    {request.name} ·{" "}
                    {request.selected_line || request.species.replace("_", " ")}
                  </span>
                  <b>View details</b>
                </summary>
                <div className="inquiry-card__meta">
                  <span>{new Date(request.created_at).toLocaleString()}</span>
                  <select
                    value={request.status}
                    onChange={event =>
                      void updateRequestStatus(
                        request.id,
                        event.target.value as LivestockRequest["status"]
                      )
                    }
                    aria-label={`Status for ${request.name}`}
                  >
                    {requestStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inquiry-card__body">
                  <div>
                    <span className="inquiry-card__type">
                      {request.selected_line ||
                        request.species.replace("_", " ")}
                    </span>
                    <h2>{request.name}</h2>
                    <a href={`mailto:${request.email}`}>{request.email}</a>
                    {request.phone && (
                      <span className="inquiry-card__phone">
                        {request.phone}
                      </span>
                    )}
                  </div>
                  <p>
                    <strong>Quantity:</strong>{" "}
                    {request.quantity ?? "Not specified"}
                    <br />
                    <strong>Shipping:</strong>{" "}
                    {request.shipping_location || "Not specified"}
                    <br />
                    <br />
                    {request.notes || "No additional notes."}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
