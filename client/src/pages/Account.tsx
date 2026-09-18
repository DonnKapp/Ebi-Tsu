import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, LockKeyhole, LogOut, Mail, UserRound } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup" | "reset";

export default function Account() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` });
        if (resetError) throw resetError;
        setMessage("If an account exists for that email, a password-reset link is on its way.");
      } else if (mode === "signup") {
        const { data, error: signupError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (signupError) throw signupError;
        setUser(data.user);
        setMessage("Your account is created. Check your email if verification is required.");
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        setUser(data.user);
        setMessage("Welcome back to Ebi Tsū.");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setMessage("You have been signed out.");
  }

  if (user) {
    return <div className="account-page"><div className="page-width account-page__inner"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to Ebi Tsū</Link><div className="account-page__header"><span className="section-label"><span>04</span> Account</span><h1>Your place in<br /><em>the study.</em></h1><p>You’re signed in as <strong>{user.email}</strong>. Your conversations and future livestock requests will live here.</p></div><div className="account-panel"><div><span className="account-panel__eyebrow">Account ready</span><h2>Your Ebi Tsū record starts here.</h2><p>We’ll connect inquiry history, livestock requests, and customer details to this account as those features come online.</p></div><button className="button button--dark" type="button" onClick={signOut}><LogOut size={15} /> Sign out</button></div></div></div>;
  }

  const isReset = mode === "reset";
  return <div className="account-page"><div className="page-width account-page__inner"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to Ebi Tsū</Link><div className="account-layout"><div className="account-page__header"><span className="section-label"><span>04</span> Ebi Tsū account</span><h1>Keep the<br /><em>conversation.</em></h1><p>Create an account now so future inquiries, livestock requests, and availability conversations can stay connected to you.</p></div><div className="account-form-panel"><div className="account-form-panel__top"><span>{isReset ? "Reset access" : mode === "signup" ? "Create account" : "Welcome back"}</span><UserRound size={18} /></div><form onSubmit={handleSubmit}>{mode === "signup" && <label>Name *<div className="account-input"><UserRound size={16} /><input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div></label>}<label>Email address *<div className="account-input"><Mail size={16} /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div></label>{!isReset && <label>Password *<div className="account-input"><LockKeyhole size={16} /><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></div></label>}<button className="button button--dark account-form-panel__submit" disabled={busy} type="submit">{busy ? "Working..." : isReset ? "Send reset link" : mode === "signup" ? "Create account" : "Log in"}<ArrowUpRight size={15} /></button></form>{message && <p className="form-success">{message}</p>}{error && <p className="form-error">{error}</p>}<div className="account-form-panel__links">{mode === "login" && <><button type="button" onClick={() => setMode("reset")}>Forgot password?</button><button type="button" onClick={() => setMode("signup")}>Create an account</button></>}{mode === "signup" && <button type="button" onClick={() => setMode("login")}>Already have an account? Log in</button>}{mode === "reset" && <button type="button" onClick={() => setMode("login")}>Return to log in</button>}</div></div></div></div></div>;
}
