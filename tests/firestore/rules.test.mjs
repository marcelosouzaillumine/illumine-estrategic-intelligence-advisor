import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function nowish() {
  return serverTimestamp();
}

async function run() {
  const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
  if (!hasEmulator) {
    console.warn("⚠️  SKIPPED_EMULATOR_NOT_RUNNING: process.env.FIRESTORE_EMULATOR_HOST is not set.");
    console.log("rules tests: SKIPPED_EMULATOR_NOT_RUNNING");
    return;
  }

  const projectId = "demo-illumine-rules";
  const rules = readFileSync("firestore.rules", "utf8");

  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });

  try {
    const ownerUid = "owner-1";
    const otherUid = "owner-2";

    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, "clients", "client-owner-1"), {
        fantasia: "Cliente 1",
        regime: "Lucro Real",
        ownerId: ownerUid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await setDoc(doc(db, "clients", "client-owner-2"), {
        fantasia: "Cliente 2",
        regime: "Lucro Real",
        ownerId: otherUid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauthDb, "clients", "client-owner-1")));

    const ownerDb = testEnv.authenticatedContext(ownerUid).firestore();
    const otherDb = testEnv.authenticatedContext(otherUid).firestore();

    await assertSucceeds(
      setDoc(doc(ownerDb, "clients", "new-client-1"), {
        fantasia: "Novo Cliente",
        regime: "Lucro Real",
        ownerId: ownerUid,
        createdAt: nowish(),
        updatedAt: nowish(),
      })
    );

    await assertFails(
      setDoc(doc(ownerDb, "clients", "spoof-client-1"), {
        fantasia: "Spoof",
        regime: "Lucro Real",
        ownerId: otherUid,
        createdAt: nowish(),
        updatedAt: nowish(),
      })
    );

    await assertSucceeds(
      setDoc(doc(ownerDb, "payables", "pay-1"), {
        clientId: "client-owner-1",
        fornecedor: "Fornecedor",
        documento: "NF-1",
        emissao: "2026-05-01",
        vencimento: "2026-05-10",
        valor: 1000,
        status: "A vencer",
        createdBy: ownerUid,
        createdAt: nowish(),
        updatedAt: nowish(),
      })
    );

    await assertFails(
      setDoc(doc(ownerDb, "payables", "pay-2"), {
        clientId: "client-owner-2",
        fornecedor: "Outro",
        documento: "NF-2",
        vencimento: "2026-05-10",
        valor: 1000,
        status: "A vencer",
        createdBy: ownerUid,
        createdAt: nowish(),
        updatedAt: nowish(),
      })
    );

    await assertSucceeds(
      setDoc(doc(ownerDb, "financial_entries", "entry-1"), {
        clientId: "client-owner-1",
        type: "DRE",
        year: 2026,
        month: 5,
        ano: 2026,
        mes: 5,
        periodType: "mensal",
        data: [{ category: "Receita Líquida", value: 10000 }],
        fileName: "dre-maio.xlsx",
        createdBy: ownerUid,
        createdAt: nowish(),
      })
    );

    await assertFails(
      setDoc(doc(otherDb, "financial_entries", "entry-2"), {
        clientId: "client-owner-1",
        type: "DRE",
        year: 2026,
        month: 5,
        data: [{ category: "Receita Líquida", value: 10000 }],
        fileName: "dre-maio.xlsx",
        createdBy: otherUid,
        createdAt: nowish(),
      })
    );

    console.log("rules tests: PASS");
  } finally {
    await testEnv.cleanup();
  }
}

run().catch((err) => {
  console.error("rules tests: FAIL", err);
  process.exit(1);
});
