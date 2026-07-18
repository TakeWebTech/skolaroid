const ERPNEXT_URL = process.env.ERPNEXT_URL;
const ERPNEXT_API_KEY = process.env.ERPNEXT_API_KEY;
const ERPNEXT_API_SECRET = process.env.ERPNEXT_API_SECRET;

export function isErpNextConfigured() {
  return Boolean(ERPNEXT_URL && ERPNEXT_API_KEY && ERPNEXT_API_SECRET);
}

export async function createErpNextLead(payload: Record<string, unknown>) {
  if (!isErpNextConfigured()) {
    console.info('ERPNext is not configured. Captured lead payload locally:', payload);
    return { mode: 'development', created: true };
  }

  const response = await fetch(`${ERPNEXT_URL}/api/resource/Lead`, {
    method: 'POST',
    headers: {
      Authorization: `token ${ERPNEXT_API_KEY}:${ERPNEXT_API_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ERPNext lead creation failed: ${response.status} ${body}`);
  }

  return response.json();
}
