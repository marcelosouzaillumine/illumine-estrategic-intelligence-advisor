import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstitutionalContext } from '../../../../hooks/useInstitutionalContext';
import { UniversalSearchApplicationService, SearchResult } from '../../application/UniversalSearchApplicationService';

export function useUniversalSearchHubViewModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const navigate = useNavigate();
  const { tenantId: ctxTenantId } = useInstitutionalContext();
  const tenantId = ctxTenantId || 'SYSTEM_TENANT';
  
  // Memoize correlationId so it doesn't regenerate on every render
  const correlationId = useMemo(() => `search-${Date.now()}`, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) {
            UniversalSearchApplicationService.recordSearchOpened(tenantId, correlationId);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tenantId, correlationId]);

  useEffect(() => {
    setResults(UniversalSearchApplicationService.getMockSearchResults(query));
  }, [query]);

  const handleCrossNavigation = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    UniversalSearchApplicationService.performNavigation(result, tenantId, navigate);
  };

  return {
    state: {
      isOpen,
      query,
      results
    },
    computed: {
      hasResults: results.length > 0,
      isSearchQueryEmpty: query.trim().length === 0
    },
    actions: {
      setIsOpen,
      setQuery,
      handleCrossNavigation
    }
  };
}
