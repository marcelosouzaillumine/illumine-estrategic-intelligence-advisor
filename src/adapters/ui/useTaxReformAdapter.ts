import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProductInfo } from '../../lib/taxIntelligence';

export function useTaxReformAdapter(clientId: string) {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [dbProducts, setDbProducts] = useState<ProductInfo[]>([]);

  useEffect(() => {
    if (!clientId) return;
    setLoadingProducts(true);
    const q = query(collection(db, 'precificacao'), where('clientId', '==', clientId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.nome,
          ncm: data.ncm || '0000.00.00',
          valorMensal: (data.precoVenda || 0) * 10,
          tipo: 'Produto'
        } as ProductInfo;
      });
      
      setDbProducts(products);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  return {
    loadingProducts,
    dbProducts
  };
}
