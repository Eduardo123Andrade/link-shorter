import { useCreateLink } from "../hooks/useCreateLink";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

interface CreateLinkFormProps {
  fetchLinks: () => Promise<void>;
}

export function CreateLinkForm({ fetchLinks }: CreateLinkFormProps) {
  const { form, loading, onSubmit } = useCreateLink(fetchLinks);
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <TextInput
            id="originalUrl"
            label="Link Original"
            placeholder="www.example.com.br"
            error={errors.originalUrl?.message}
            {...register("originalUrl")}
          />
        </div>

        <div className="space-y-2">
          <TextInput
            id="customSuffix"
            label="Link Encurtado"
            placeholder="my-custom-link"
            prefix="brev.ly/"
            error={errors.customSuffix?.message}
            {...register("customSuffix")}
          />
        </div>

        <Button type="submit" loading={loading} variant="primary">
          Salvar Link
        </Button>
      </form>
    </div>
  );
}
