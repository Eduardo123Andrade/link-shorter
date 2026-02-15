import { useCreateLink } from "../hooks/useCreateLink";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

interface CreateLinkFormProps {
  fetchLinks: () => Promise<void>;
}

export function CreateLinkForm({ fetchLinks }: CreateLinkFormProps) {
  const {
    originalUrl,
    setOriginalUrl,
    customSuffix,
    setCustomSuffix,
    loading,
    error,
    handleSubmit,
  } = useCreateLink(fetchLinks);

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <TextInput
            id="originalUrl"
            label="Link Original"
            placeholder="www.example.com.br"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <TextInput
            id="customSuffix"
            label="Link Encurtado"
            placeholder="my-custom-link"
            value={customSuffix}
            onChange={(e) => setCustomSuffix(e.target.value)}
            prefix="brev.ly/"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleSubmit} loading={loading} variant="primary">
          Salvar Link
        </Button>
      </div>
    </div>
  );  
}
