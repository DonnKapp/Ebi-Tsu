import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type Inquiry = { id: string; name: string; email: string; phone: string | null; inquiry_type: string; message: string; status: "new" | "in_progress" | "responded" | "closed"; created_at: string; };
const statuses: Inquiry["status"][] = ["new", "in_progress", "responded", "closed"];

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | Inquiry["status"]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { void initialize(); }, []);

  async function initialize() {
    setLoading(true); setError("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setAllowed(false); setLoading(false); return; }
    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") { setAllowed(false); setLoading(false); return; }
    setAllowed(true);
    await loadInquiries();
  }

  async function loadInquiries() {
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("inquiries").select("id, name, email, phone, inquiry_type, message, status, created_at").order("created_at", { ascending: false });
    if (queryError) setError(queryError.message); else setInquiries((data ?? []) as Inquiry[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Inquiry["status"]) {
    const { error: updateError } = await supabase.from("inquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (updateError) { setError(updateError.message); return; }
    setInquiries((current) => current.map((inquiry) => inquiry.id === id ? { ...inquiry, status } : inquiry));
  }

  const visibleInquiries = useMemo(() => filter === "all" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter), [filter, inquiries]);
  const countFor = (status: Inquiry["status"]) => inquiries.filter((inquiry) => inquiry.status === status).length;

  if (loading && allowed === null) return <div className="admin-page"><div className="page-width admin-page__inner"><p className="admin-loading">Checking admin access...</p></div></div>;
  if (allowed === false) return <div className="admin-page"><div className="page-width admin-page__inner"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to Ebi Tsū</Link><div className="admin-denied"><ShieldCheck size={28} /><span className="section-label"><span>06</span> Private area</span><h1>Admin access<br /><em>required.</em></h1><p>This area is reserved for the Ebi Tsū admin account. Sign in with the authorized account and try again.</p><Link href="/account" className="button button--dark">Go to account <ExternalLink size={15} /></Link></div></div></div>;

  return <div className="admin-page"><div className="page-width admin-page__inner"><div className="admin-topline"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to Ebi Tsū</Link><button className="admin-refresh" type="button" onClick={() => void loadInquiries()}><RefreshCw size={14} /> Refresh</button></div><div className="admin-heading"><div><span className="section-label"><span>06</span> Private admin</span><h1>Inquiry<br /><em>inbox.</em></h1><p>A private working view of every customer conversation saved through Ebi Tsū.</p></div><div className="admin-heading__mark"><ShieldCheck size={18} /> Admin access verified</div></div><div className="admin-stats"><button className={filter === "all" ? "admin-stat admin-stat--active" : "admin-stat"} onClick={() => setFilter("all")}><span>Total</span><strong>{inquiries.length}</strong></button>{statuses.map((status) => <button key={status} className={filter === status ? "admin-stat admin-stat--active" : "admin-stat"} onClick={() => setFilter(status)}><span>{status.replace("_", " ")}</span><strong>{countFor(status)}</strong></button>)}</div>{error && <p className="form-error" role="alert">{error}</p>}{loading ? <p className="admin-loading">Loading inquiries...</p> : visibleInquiries.length === 0 ? <div className="admin-empty"><span>No inquiries in this view.</span><p>New customer conversations will appear here as they arrive.</p></div> : <div className="inquiry-list">{visibleInquiries.map((inquiry) => <article className="inquiry-card" key={inquiry.id}><div className="inquiry-card__meta"><span>{new Date(inquiry.created_at).toLocaleString()}</span><select value={inquiry.status} onChange={(event) => void updateStatus(inquiry.id, event.target.value as Inquiry["status"])} aria-label={`Status for ${inquiry.name}`}>{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></div><div className="inquiry-card__body"><div><span className="inquiry-card__type">{inquiry.inquiry_type}</span><h2>{inquiry.name}</h2><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>{inquiry.phone && <span className="inquiry-card__phone">{inquiry.phone}</span>}</div><p>{inquiry.message}</p></div></article>)}</div>}</div></div>;
}
