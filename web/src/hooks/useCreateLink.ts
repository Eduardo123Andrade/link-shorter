import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../lib/toast';
import { API_URL } from '../lib/api';
import { createLinkSchema, CreateLinkFormData } from '../schemas/createLinkSchema';

export function useCreateLink(fetchLinks: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      originalUrl: '',
      customSuffix: '',
    },
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: data.originalUrl, shortLink: data.customSuffix }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        const message =
          responseData.errors
            ? Object.values(responseData.errors).flat().join(', ')
            : responseData.error || 'Falha ao criar o link';
        throw new Error(message);
      }

      await fetchLinks();

      form.reset();
      toast.success('Link criado com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar o link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit,
  };
}
