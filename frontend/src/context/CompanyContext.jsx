import { createContext, useContext, useState, useEffect } from 'react';
import { companiesApi } from '../api/companies';

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      setLoading(true);
      const companies = await companiesApi.getAll();
      if (companies.length > 0) {
        const fullCompany = await companiesApi.getById(companies[0].id);
        setCompany(fullCompany);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    company,
    companyId: company?.id,
    loading,
    error,
    refresh: loadCompany
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
