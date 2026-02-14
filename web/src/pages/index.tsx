import { ProjectLogo } from "../components/ProjectLogo";
import { CreateLinkForm } from "../components/CreateLinkForm";
import { LinkList } from "../components/LinkList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-sans text-gray-100">
      <main className="flex w-full max-w-3xl flex-col items-center gap-12">
        <header className="text-center w-full">
          <ProjectLogo />
        </header>

        <section className="w-full flex flex-col gap-8 bg-white/10 p-6 rounded-2xl">
          <h1 className="text-lg text-gray-200 font-bold tracking-tight sm:text-5xl">
            Novo link
          </h1>
          <CreateLinkForm />
        </section>

        <section className="w-full">
          <LinkList />
        </section>
      </main>
    </div>
  );
}
