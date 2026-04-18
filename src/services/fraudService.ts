import { Contact } from "@/data/mockData";
import { PREDICT_ENDPOINT } from "@/config";

export const generateFeatures = (contact: Contact, amount: number): number[] => {
  const isRisky = contact.trust === "risky";
  const isNew = contact.trust === "new";
  const hour = new Date().getHours();

  // Raw base values (simulated)
  const recipientBlacklisted = isRisky ? 1 : 0;
  const amountAnomaly = isRisky ? 0.8 : 0.1;
  const locationMismatch = isRisky && Math.random() > 0.7 ? 1 : 0;
  const vpnDetected = isRisky && Math.random() > 0.5 ? 1 : 0;
  const deviceTrust = isRisky ? 0.3 : 0.95;
  const behavioralAnomaly = isRisky ? 0.7 : 0.15;
  const newRecipient = isNew ? 1 : 0;
  const velocityScore = isRisky ? 0.85 : 0.2;
  const ipReputation = isRisky ? 0.25 : 0.9;
  const riskScoreRaw = isRisky ? 85 : 15;

  // Features mapping (Index 0-21)
  const f: number[] = [];
  f[0] = recipientBlacklisted;
  f[1] = amountAnomaly;
  f[2] = locationMismatch;
  f[3] = vpnDetected;
  f[4] = deviceTrust;
  f[5] = behavioralAnomaly;
  f[6] = newRecipient;
  f[7] = hour / 23;
  f[8] = velocityScore;
  f[9] = ipReputation;
  f[10] = amount / 100000;
  f[11] = riskScoreRaw / 100;
  f[12] = amount > 10000 ? 1 : 0;
  f[13] = hour <= 5 ? 1 : 0;
  f[14] = deviceTrust < 0.4 ? 1 : 0;
  f[15] = behavioralAnomaly > 0.55 ? 1 : 0;
  f[16] = velocityScore > 0.6 ? 1 : 0;
  f[17] = ipReputation < 0.4 ? 1 : 0;
  f[18] = amountAnomaly * velocityScore;
  f[19] = (1 - deviceTrust) * behavioralAnomaly;
  f[20] = (1 - ipReputation) * amountAnomaly;
  f[21] = (locationMismatch || vpnDetected) ? 1 : 0;

  return f; // Array of exactly 22 numeric values
};

export const checkFraud = async (features: number[], upiId: string, amount: number) => {
  try {
    const response = await fetch(PREDICT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        features,
        upiId,
        amount,
        id: `txn_${Date.now()}`
      }),
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();
    
    // Accepts "prediction", "predictions", or "result" per dashboard spec
    const prediction = data.prediction ?? data.predictions ?? data.result;
    
    return {
      isFraud: prediction === 1,
      score: prediction === 1 ? 95 : 10,
    };
  } catch (error) {
    console.error(`CRITICAL: Fraud Engine unreachable at ${PREDICT_ENDPOINT}`);
    throw error;
  }
};
