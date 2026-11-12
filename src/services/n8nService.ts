import { LakeItem, DiagnosisResult } from '../types/lake';

const DIRECT_N8N_WEBHOOK = "https://supermanxo777.app.n8n.cloud/webhook/india-lake-monitor-ai";
const PROXY_ENDPOINT = "/api/diagnose";

export async function requestLakeDiagnosis(lake: LakeItem): Promise<DiagnosisResult> {
  const payload = {
    lake: lake.name,
    location: lake.location,
    source: lake.source,
    sample_id: lake.sampleId,
    ph: lake.readings.ph,
    temperature: lake.readings.temperature,
    tds: lake.readings.tds,
    turbidity: lake.readings.turbidity,
    do_mgl: lake.readings.do_mgl
  };

  // Try proxy first (if Express server is running), fallback to direct webhook
  let response: Response;
  try {
    response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok && response.status === 404) {
      // Proxy not running, call direct n8n webhook
      throw new Error("Proxy endpoint unavailable");
    }
  } catch (_e) {
    // Direct call to n8n webhook
    response = await fetch(DIRECT_N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok) {
    throw new Error(`n8n workflow error: HTTP ${response.status}`);
  }

  const data: DiagnosisResult = await response.json();
  return data;
}
