import { useState } from 'react';
import { toast } from '../lib/toast';
import { API_URL } from '../lib/api';
import { useLinkStore } from '../store/linkStore';

export function useDeleteLink() {
  const [loading, setLoading] = useState(false);
  const removeLinkFromStore = useLinkStore((state) => state.removeLink);

  const deleteLink = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/links/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      removeLinkFromStore(id);
      toast.success('Link excluído com sucesso!');
    } catch (err) {
      console.error('Failed to delete link:', err);
      toast.error('Erro ao excluir o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return { deleteLink, loading };
}
