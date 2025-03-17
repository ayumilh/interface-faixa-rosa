'use client'
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `http://localhost:4000/api/search/companion?${queryParams}` : `http://localhost:4000/api/search/companion`;
      const response = await axios.get(url);
      setCompanions(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PlanContext.Provider value={{ companions, fetchCompanions, loading, error }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
