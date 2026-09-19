import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://ebi-tsu.com",
  "https://www.ebi-tsu.com",
  "http://localhost:3000",
]);
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ownerEmail = "Ebi-Tsu@outlook.com";
const sender = "Ebi Tsū <hello@mail.ebi-tsu.com>";

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : "https://ebi-tsu.com",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function response(
  request: Request,
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST")
    return response(request, { error: "Method not allowed" }, 405);
  if (!resendApiKey || !supabaseUrl || !anonKey || !serviceRoleKey)
    return response(
      request,
      { error: "Email service is not configured." },
      503
    );

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer "))
    return response(request, { error: "Authentication required." }, 401);

  try {
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } =
      await authClient.auth.getUser();
    if (userError || !userData.user)
      return response(request, { error: "Authentication required." }, 401);

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const body = await request.json();
    let recordType = String(body.recordType ?? "");
    let recordId = String(body.recordId ?? "");
    if (
      !/^[0-9a-f-]{36}$/i.test(recordId) ||
      !["inquiry", "livestock_request"].includes(recordType)
    ) {
      const legacyName = String(body.name ?? "").trim();
      const legacyEmail = String(body.email ?? "").trim();
      const legacyInquiryType = String(body.inquiryType ?? "").trim();
      recordType =
        legacyInquiryType === "Livestock request"
          ? "livestock_request"
          : "inquiry";
      const legacyTable =
        recordType === "inquiry" ? "inquiries" : "livestock_requests";
      const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentRecord, error: recentRecordError } =
        await serviceClient
          .from(legacyTable)
          .select("id")
          .eq("user_id", userData.user.id)
          .eq("name", legacyName)
          .eq("email", legacyEmail)
          .gte("created_at", cutoff)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (recentRecordError) throw recentRecordError;
      if (!recentRecord)
        return response(request, { error: "Saved record not found." }, 404);
      recordId = recentRecord.id;
    }

    const table = recordType === "inquiry" ? "inquiries" : "livestock_requests";
    const selectFields =
      recordType === "inquiry"
        ? "id, user_id, name, email, phone, inquiry_type, message, owner_notified_at, customer_notified_at"
        : "id, user_id, name, email, phone, species, quantity, shipping_location, selected_line, notes, owner_notified_at, customer_notified_at";
    const { data: record, error: recordError } = await serviceClient
      .from(table)
      .select(selectFields)
      .eq("id", recordId)
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (recordError) throw recordError;
    if (!record)
      return response(request, { error: "Saved record not found." }, 404);

    if (record.owner_notified_at && record.customer_notified_at) {
      return response(request, {
        sent: true,
        confirmationSent: true,
        alreadySent: true,
      });
    }

    const name = String(record.name ?? "").trim();
    const email = String(record.email ?? "").trim();
    const phone = String(record.phone ?? "").trim();
    const inquiryType =
      recordType === "inquiry"
        ? String(record.inquiry_type ?? "Inquiry")
        : "Livestock request";
    const message =
      recordType === "inquiry"
        ? String(record.message ?? "")
        : [
            `Species: ${String(record.species ?? "Not specified")}`,
            `Selected line: ${String(record.selected_line ?? "Not specified")}`,
            `Quantity: ${record.quantity ?? "Not specified"}`,
            `Shipping location: ${String(record.shipping_location ?? "Not specified")}`,
            "",
            String(record.notes ?? ""),
          ].join("\n");

    if (!name || !email || !message)
      return response(request, { error: "Saved record is incomplete." }, 422);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeInquiryType = escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
    const plainText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Inquiry: ${inquiryType}`,
      "",
      message,
    ].join("\n");
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New Ebi Tsū inquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Inquiry:</strong> ${safeInquiryType}</p><hr><p>${safeMessage}</p></div>`;
    const confirmationHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>We received your message.</h2><p>Hi ${safeName},</p><p>Thank you for reaching out to Ebi Tsū. Your submission has been saved to your account and made available to our team.</p><p>We’ll review it and follow up as soon as we can.</p><p>— Ebi Tsū<br>The Shrimp Connoisseur</p></div>`;
    const resendHeaders = {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    };

    const [ownerResult, customerResult] = await Promise.all([
      record.owner_notified_at
        ? Promise.resolve(null)
        : fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: resendHeaders,
            body: JSON.stringify({
              from: sender,
              to: [ownerEmail],
              reply_to: email,
              subject: `${inquiryType} — ${name}`,
              text: plainText,
              html,
            }),
          }),
      record.customer_notified_at
        ? Promise.resolve(null)
        : fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: resendHeaders,
            body: JSON.stringify({
              from: sender,
              to: [email],
              subject: "We received your Ebi Tsū inquiry",
              text: `Hi ${name},\n\nThank you for reaching out to Ebi Tsū. Your submission has been saved to your account and made available to our team.\n\n— Ebi Tsū`,
              html: confirmationHtml,
            }),
          }),
    ]);

    const ownerSent =
      Boolean(record.owner_notified_at) || Boolean(ownerResult?.ok);
    const customerSent =
      Boolean(record.customer_notified_at) || Boolean(customerResult?.ok);
    const deliveredAt = new Date().toISOString();
    const deliveryUpdate: Record<string, string> = {};
    if (!record.owner_notified_at && ownerResult?.ok)
      deliveryUpdate.owner_notified_at = deliveredAt;
    if (!record.customer_notified_at && customerResult?.ok)
      deliveryUpdate.customer_notified_at = deliveredAt;
    if (Object.keys(deliveryUpdate).length > 0)
      await serviceClient.from(table).update(deliveryUpdate).eq("id", recordId);

    if (!ownerSent || !customerSent) {
      console.error("Resend delivery incomplete", {
        recordType,
        recordId,
        ownerStatus: ownerResult?.status,
        customerStatus: customerResult?.status,
      });
      return response(
        request,
        {
          error: "Email delivery incomplete.",
          sent: ownerSent,
          confirmationSent: customerSent,
        },
        502
      );
    }

    return response(request, { sent: true, confirmationSent: true });
  } catch (error) {
    console.error(error);
    return response(request, { error: "Unable to send inquiry emails." }, 500);
  }
});
