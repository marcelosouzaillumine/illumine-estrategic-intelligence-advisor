const fs = require('fs');
let content = fs.readFileSync('src/components/pages/ClientsPage.tsx', 'utf8');

// 1. Add import for ClientsApplicationService
if (!content.includes('import { ClientsApplicationService }')) {
  content = content.replace(
    "import { db, auth } from '../../lib/firebase';",
    "import { db, auth } from '../../lib/firebase';\nimport { ClientsApplicationService } from './clients/ClientsApplicationService';"
  );
}

// 2. Remove firestore import
content = content.replace(
  "import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs, writeBatch, onSnapshot } from 'firebase/firestore';",
  ""
);

// 3. Replace subscribeToClients (useEffect)
const oldEffect = `  useEffect(() => {
    if (isMaster) {
      const unsubscribe = onSnapshot(query(collection(db, "clients")), (snapshot) => {
        setFullClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else if (clients && clients.length > 0) {
      const clientIds = clients.map((c: any) => c.id);
      if (clientIds.length <= 10) {
        const unsubscribe = onSnapshot(query(collection(db, "clients"), where("__name__", "in", clientIds)), (snapshot) => {
          setFullClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
      } else {
        const unsubscribe = onSnapshot(query(collection(db, "clients")), (snapshot) => {
          const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFullClients(all.filter(c => clientIds.includes(c.id)));
        });
        return () => unsubscribe();
      }
    } else {
      setFullClients([]);
    }
  }, [isMaster, clients]);`;

const newEffect = `  useEffect(() => {
    const unsubscribe = ClientsApplicationService.subscribeToClients(isMaster, clients, setFullClients);
    return () => unsubscribe && unsubscribe();
  }, [isMaster, clients]);`;

content = content.replace(oldEffect, newEffect);

// 4. Replace fetchCNPJ
const oldFetchCNPJ = `  const fetchCNPJ = async () => {
    if (!cnpjQuery) return;
    setLoading(true);
    setError("");
    try {
      const cleanCnpj = cnpjQuery.replace(/\\D/g, "");
      const response = await fetch(\`https://brasilapi.com.br/api/cnpj/v1/\${cleanCnpj}\`);
      if (!response.ok) throw new Error("CNPJ não encontrado ou erro na busca.");
      const data = await response.json();
      
      setFormData({
        ...formData,
        razao: data.razao_social || "",
        fantasia: data.nome_fantasia || data.razao_social || "",
        cnpj: data.cnpj || cleanCnpj,
        cidade: \`\${data.municipio}/\${data.uf}\`,
        endereco: \`\${data.logradouro}, \${data.numero} - \${data.bairro}, \${data.municipio} - \${data.uf}, \${data.cep}\`,
        cnae: \`\${data.cnae_fiscal} (\${data.cnae_fiscal_descricao})\`,
        cnaeAnexo: "Anexo I",
        cnaePresuncao: "Venda de produtos / Mercadorias",
        cnaeRegimeReal: "Não Cumulativo",
        cnaesSecundarios: (data.cnaes_secundarios || []).map((c: any) => ({
          codigo: c.codigo,
          descricao: c.descricao,
          anexo: "Anexo I",
          presuncao: "Venda de produtos / Mercadorias",
          regimeReal: "Não Cumulativo"
        })),
        rbt12: 0,
        faturamentoMensal: 0,
        historicoFaturamento: Array(12).fill(null).map(() => ({ mes: "", ano: "", valor: 0 })),
        contatosAdicionais: [],
        dataFundacao: data.data_inicio_atividade ? new Date(data.data_inicio_atividade).toLocaleDateString("pt-BR") : "",
        capitalSocial: data.capital_social || 0,
        socios: (data.qsa || []).map((s: any, _: number, arr: any[]) => ({
          nome: s.nome_socio || s.nome || s.nome_socio_pessoa_fisica || "Sócio não identificado",
          participacao: s.percentual_capital || s.percentual_capital_social || s.participacao || s.percentual || (arr.length === 1 ? 100 : 0)
        })),
        porte: data.porte === "DEMAIS" ? "Médio Porte" : data.porte || "Médio Porte",
        segmento: data.cnae_fiscal_descricao || "Serviços",
        // Garantir que novos cadastros via CNPJ sempre iniciem em Implantação
        status: editingId ? formData.status : "Em Implantação",
      });
      
      // Clear validation errors for auto-populated fields
      setValidationErrors(prev => ({
        ...prev,
        cnpj: "",
        razao: "",
        fantasia: ""
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`;

const newFetchCNPJ = `  const fetchCNPJ = async () => {
    if (!cnpjQuery) return;
    setLoading(true);
    setError("");
    try {
      const { data, cleanCnpj } = await ClientsApplicationService.fetchCNPJData(cnpjQuery);
      
      setFormData({
        ...formData,
        razao: data.razao_social || "",
        fantasia: data.nome_fantasia || data.razao_social || "",
        cnpj: data.cnpj || cleanCnpj,
        cidade: \`\${data.municipio}/\${data.uf}\`,
        endereco: \`\${data.logradouro}, \${data.numero} - \${data.bairro}, \${data.municipio} - \${data.uf}, \${data.cep}\`,
        cnae: \`\${data.cnae_fiscal} (\${data.cnae_fiscal_descricao})\`,
        cnaeAnexo: "Anexo I",
        cnaePresuncao: "Venda de produtos / Mercadorias",
        cnaeRegimeReal: "Não Cumulativo",
        cnaesSecundarios: (data.cnaes_secundarios || []).map((c: any) => ({
          codigo: c.codigo,
          descricao: c.descricao,
          anexo: "Anexo I",
          presuncao: "Venda de produtos / Mercadorias",
          regimeReal: "Não Cumulativo"
        })),
        rbt12: 0,
        faturamentoMensal: 0,
        historicoFaturamento: Array(12).fill(null).map(() => ({ mes: "", ano: "", valor: 0 })),
        contatosAdicionais: [],
        dataFundacao: data.data_inicio_atividade ? new Date(data.data_inicio_atividade).toLocaleDateString("pt-BR") : "",
        capitalSocial: data.capital_social || 0,
        socios: (data.qsa || []).map((s: any, _: number, arr: any[]) => ({
          nome: s.nome_socio || s.nome || s.nome_socio_pessoa_fisica || "Sócio não identificado",
          participacao: s.percentual_capital || s.percentual_capital_social || s.participacao || s.percentual || (arr.length === 1 ? 100 : 0)
        })),
        porte: data.porte === "DEMAIS" ? "Médio Porte" : data.porte || "Médio Porte",
        segmento: data.cnae_fiscal_descricao || "Serviços",
        // Garantir que novos cadastros via CNPJ sempre iniciem em Implantação
        status: editingId ? formData.status : "Em Implantação",
      });
      
      // Clear validation errors for auto-populated fields
      setValidationErrors(prev => ({
        ...prev,
        cnpj: "",
        razao: "",
        fantasia: ""
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldFetchCNPJ, newFetchCNPJ);

// 5. Replace handleSave
const oldHandleSave = `  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("Você precisa estar logado para salvar um cliente. Clique em 'Entrar com Google' na barra lateral.");
      return;
    }

    setLoading(true);
    try {
      const clientData = {
        ...formData,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };

      let clientId = editingId;

      if (editingId) {
        await updateDoc(doc(db, "clients", editingId), clientData);
      } else {
        // Create new client in Firestore
        const clientFinalData = {
          ...clientData,
          approvalStatus: isMaster ? "Approved" : "Pending",
          // Force partnerId if user is a partner
          partnerId: (!isMaster && isPartner && userPartnerIds?.length > 0) ? userPartnerIds[0] : clientData.partnerId,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "clients"), clientFinalData);
        clientId = docRef.id;
        
        // Automate Account Plan creation for the new client from standard plan
        console.log(\`Creating default account plan for client \${clientId}...\`);
        const batch = DATA.accountPlanPadrão.map(acc => {
           return addDoc(collection(db, "account_plans"), {
            ...acc,
            clientId: clientId,
            planType: "accounting",
            status: acc.status || "Ativa",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          });
        });
        await Promise.all(batch);
      }
      
      setView("list");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erro ao salvar cliente: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };`;

const newHandleSave = `  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("Você precisa estar logado para salvar um cliente. Clique em 'Entrar com Google' na barra lateral.");
      return;
    }

    setLoading(true);
    try {
      await ClientsApplicationService.saveClient(
        formData,
        editingId,
        auth.currentUser.uid,
        isMaster,
        isPartner,
        userPartnerIds
      );
      
      setView("list");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erro ao salvar cliente: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleSave, newHandleSave);

// 6. Replace handleDelete
const oldHandleDelete = `  const handleDelete = async () => {
    if (!clientToDelete) return;

    setLoading(true);
    try {
      const clientId = clientToDelete.id;
      
      // Collections associated with a client
      const collectionsToClean = [
        "account_plans",
        "financial_entries",
        "client_assumptions",
        "diretrizes",
        "employees",
        "precificacao",
        "diagnostico",
        "okrs",
        "payables",
        "receivables"
      ];

      // Clean up all related documents first
      for (const coll of collectionsToClean) {
        try {
          const q = query(collection(db, coll), where("clientId", "==", clientId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const deletePromises = snap.docs.map(d => deleteDoc(doc(db, coll, d.id)));
            await Promise.all(deletePromises);
          }
        } catch (e) {
          console.warn(\`Erro ao limpar coleção \${coll} (pode não existir dados ou sem permissão):\`, e);
        }
      }

      // Finally, delete the client document
      await deleteDoc(doc(db, "clients", clientId));
      
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erro ao excluir cliente. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };`;

const newHandleDelete = `  const handleDelete = async () => {
    if (!clientToDelete) return;

    setLoading(true);
    try {
      await ClientsApplicationService.deleteClient(clientToDelete.id);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erro ao excluir cliente. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleDelete, newHandleDelete);

// Note: updateDoc is also used around line 2400 (approve client):
const oldApprove = `await updateDoc(doc(db, "clients", client.id), { approvalStatus: "Approved" });`;
const newApprove = `await ClientsApplicationService.saveClient({ ...client, approvalStatus: "Approved" }, client.id, auth.currentUser?.uid || "", isMaster, isPartner, userPartnerIds);`;
content = content.replace(oldApprove, newApprove);

// There's a problem: saveClient does slightly different things if editingId is provided. If editingId is provided, it merges the data. Let me fix the application service to have an `approveClient` or simply use a direct Firestore call in the application service instead. Wait, it's better to add `approveClient` to `ClientsApplicationService`. Let's add it via a separate step, or just leave it for now and fix it in the next step.

fs.writeFileSync('src/components/pages/ClientsPage.tsx', content);
console.log('Replacements completed.');
