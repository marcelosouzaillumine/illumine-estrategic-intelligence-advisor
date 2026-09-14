import { useState } from 'react';

export function useEnterpriseValidationAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState<any[]>([]);

  return {
    validations,
    loading
  };
}
