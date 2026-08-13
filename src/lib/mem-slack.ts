export const MEM_AWU_TX = "AWU-SEDE-NORTE-50";
export const MEM_HOSPITAL_ID = "001xx000003DGw2AAG";

export type SlackAlertResponse = {
  ok: boolean;
  tx: string;
  hospitalId?: string;
  approveUrl?: string;
  rejectUrl?: string;
  slack?: {
    ok?: boolean;
    posted?: boolean;
    channel?: string;
    ts?: string;
    error?: string;
    reason?: string;
  };
  error?: string;
};

export type AuthorizeResponse = {
  ok: boolean;
  tx: string;
  action: "APPROVE" | "REJECT";
  body?: string;
  proxied?: boolean;
  reason?: string;
  error?: string;
};

export async function sendEpidemiologicalAlert(tx = MEM_AWU_TX): Promise<SlackAlertResponse> {
  const response = await fetch("/api/mem/slack/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ tx, hospitalId: MEM_HOSPITAL_ID, beds: 50 }),
  });
  return (await response.json()) as SlackAlertResponse;
}

export async function authorizeAwu(
  action: "APPROVE" | "REJECT",
  tx = MEM_AWU_TX,
): Promise<AuthorizeResponse> {
  const response = await fetch(
    `/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=${action}`,
    { headers: { Accept: "application/json" } },
  );
  return (await response.json()) as AuthorizeResponse;
}
