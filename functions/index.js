const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { GoogleGenAI } = require("@google/genai");

if (!admin.apps.length) {
  admin.initializeApp();
}

function buildPrompt(req) {
  return `
Você é um CFO Estratégico e Consultor Sênior de uma Big 4 (como Deloitte ou McKinsey).
Sua tarefa é gerar um "Parecer Executivo" para o cliente ${req.clientName}, do setor ${req.industry}, referente a ${req.month}/${req.year}.

DADOS FINANCEIROS DO PERÍODO:
${JSON.stringify(req.metrics || {}, null, 2)}

PADRÕES DETECTADOS PELO SISTEMA:
${(req.patterns || []).map((p) => `- ${p.name}: ${p.description}`).join("\n")}

CONTEXTO ESTRATÉGICO (DIRETRIZES MVV):
- Missão: ${req.mvv?.missao || "Não informada"}
- Visão: ${req.mvv?.visao || "Não informada"}
- Valores: ${req.mvv?.valores?.join(", ") || "Não informados"}

PRINCIPAIS RISCOS/PROBLEMAS (DIAGNÓSTICO):
${(req.topDiagnostico || []).map((d) => `- ${d}`).join("\n") || "Nenhum item crítico."}

OKRs EM RISCO:
${(req.okrsEmRisco || []).map((o) => `- ${o}`).join("\n") || "Nenhum OKR em risco crítico."}

DIRETRIZES DO RELATÓRIO:
1. Integre os números financeiros com o propósito da empresa (Missão/Visão). O parecer deve mostrar como o financeiro está ajudando ou atrapalhando a atingir a Visão.
2. Seja direto, técnico mas acessível, e altamente propositivo.
3. Explique a "Implicação Estratégica" dos números.
4. Considere os itens do Diagnóstico e OKRs em risco para fundamentar as recomendações.
5. Termine com 3 recomendações claras de curto prazo (Quick Wins).
6. O tom deve ser de "Advisor de Confiança".
7. Use Português do Brasil.
8. Formate em Markdown (mas não use # de título, use apenas negrito e listas).

GERAR PARECER:
`.trim();
}

exports.generateAdvisoryParecer = onRequest({ cors: true, invoker: "public", secrets: ["GEMINI_API_KEY"] }, async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const authHeader = request.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    response.status(401).json({ error: "unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    await admin.auth().verifyIdToken(token);
  } catch (_err) {
    response.status(401).json({ error: "invalid_token" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(500).json({ error: "missing_gemini_api_key" });
    return;
  }

  const payload = request.body || {};
  const ai = new GoogleGenAI({ apiKey });

  try {
    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: buildPrompt(payload),
    });
    response.status(200).json({ text: result.text || "" });
  } catch (err) {
    console.error("generateAdvisoryParecer error", err);
    response.status(500).json({ error: "generation_failed" });
  }
});

// RBAC: Manage Roles
exports.manageRole = onRequest({ cors: true, invoker: "public" }, async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const authHeader = request.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    response.status(401).json({ error: "unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (_err) {
    response.status(401).json({ error: "invalid_token" });
    return;
  }

  // RBAC Hierarchy Validation
  const requesterRole = decodedToken.role || "NONE";
  
  if (!["SUPER_ADMIN", "GOVERNANCE_ADMIN"].includes(requesterRole)) {
    response.status(403).json({ error: "forbidden", message: "You do not have permission to manage roles." });
    return;
  }

  const payload = request.body || {};
  const { targetUid, newRole } = payload;

  if (!targetUid || !newRole) {
    response.status(400).json({ error: "missing_parameters", message: "targetUid and newRole are required." });
    return;
  }

  const validRoles = ["SUPER_ADMIN", "GOVERNANCE_ADMIN", "ADVISOR", "CLIENT_ADMIN", "CLIENT_USER", "AUDITOR", "NONE"];
  if (!validRoles.includes(newRole)) {
    response.status(400).json({ error: "invalid_role", message: "The provided role is not valid." });
    return;
  }

  // Prevent horizontal/vertical escalation
  if (requesterRole === "GOVERNANCE_ADMIN") {
    const allowedForGovernance = ["CLIENT_ADMIN", "CLIENT_USER", "AUDITOR", "NONE"];
    if (!allowedForGovernance.includes(newRole)) {
      response.status(403).json({ 
        error: "forbidden_escalation", 
        message: "GOVERNANCE_ADMIN can only assign CLIENT_ADMIN, CLIENT_USER, or AUDITOR." 
      });
      return;
    }
  }

  try {
    const targetUser = await admin.auth().getUser(targetUid);
    const oldRole = targetUser.customClaims?.role || "NONE";
    
    // Additional safeguard: GOVERNANCE_ADMIN cannot downgrade/change a SUPER_ADMIN
    if (requesterRole === "GOVERNANCE_ADMIN" && oldRole === "SUPER_ADMIN") {
      response.status(403).json({ 
        error: "forbidden_escalation", 
        message: "GOVERNANCE_ADMIN cannot alter a SUPER_ADMIN." 
      });
      return;
    }

    // Set or remove the role
    const updatedClaims = { ...(targetUser.customClaims || {}) };
    if (newRole === "NONE") {
      delete updatedClaims.role;
    } else {
      updatedClaims.role = newRole;
    }
    await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

    // Audit Log
    const db = admin.firestore();
    await db.collection("security_audit_logs").add({
      targetUid: targetUid,
      targetEmail: targetUser.email || "unknown",
      oldRole: oldRole,
      newRole: newRole,
      updatedBy: decodedToken.uid,
      updatedByEmail: decodedToken.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    response.status(200).json({ success: true, message: \`Role \${newRole} assigned to \${targetUid} successfully.\` });
  } catch (err) {
    console.error("manageRole error", err);
    response.status(500).json({ error: "operation_failed", message: err.message });
  }
});

