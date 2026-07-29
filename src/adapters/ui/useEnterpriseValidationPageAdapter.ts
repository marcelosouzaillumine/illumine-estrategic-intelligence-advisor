import { useState } from 'react';

export function useEnterpriseValidationPageAdapter() {
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState<any[]>([]);

  return { validations, loading };
}
