import { useState } from 'react';
import { API_URL } from '../lib/api';

export function useDownloadReport() {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/links/report`);
      if (!res.ok) throw new Error('Erro ao gerar relatório');
      const { url } = await res.json();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'links-report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setLoading(false);
    }
  };

  return { downloadReport, loading };
}
