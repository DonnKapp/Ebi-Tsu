import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://ebi-tsu.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const ownerEmail = "Ebi-Tsu@outlook.com";
const sender = "Ebi Tsū <onboarding@resend.dev>";

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405);
  if (!resendApiKey) return response({ error: "Email service is not configured yet." }, 503);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return response({ error: "Authentication required." }, 401);

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const inquiryType = String(body.inquiryType ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!name || !email || !inquiryType || !message) return response({ error: "Missing required inquiry fields." }, 400);

    const plainText = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Inquiry: ${inquiryType}`, "", message].join("\n");
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New Ebi Tsū inquiry</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || "Not provided"}</p><p><strong>Inquiry:</strong> ${inquiryType}</p><hr><p>${message.replaceAll("\n", "<br>")}</p></div>`;
    const confirmationHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>We received your message.</h2><p>Hi ${name},</p><p>Thank you for reaching out to Ebi Tsū. Your inquiry has been saved to your account and delivered to our team.</p><p>We’ll review your message and follow up as soon as we can.</p><p>— Ebi Tsū<br>The Shrimp Connoisseur</p></div>`;

    const [ownerResult, customerResult] = await Promise.all([
      fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: sender, to: [ownerEmail], reply_to: email, subject: `${inquiryType} — ${name}`, text: plainText, html }) }),
      fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: sender, to: [email], subject: "We received your Ebi Tsū inquiry", text: `Hi ${name},\n\nThank you for reaching out to Ebi Tsū. Your inquiry has been saved to your account and delivered to our team.\n\n— Ebi Tsū`, html: confirmationHtml }) }),
    ]);

    if (!ownerResult.ok || !customerResult.ok) {
      const detail = await ownerResult.text();
      console.error("Resend delivery failed", detail);
      return response({ error: "The inquiry was saved, but email delivery could not be completed." }, 502);
    }
    return response({ sent: true });
  } catch (error) {
    console.error(error);
    return response({ error: "Unable to send inquiry emails." }, 500);
  }
});
