import { ProjectLogo } from "../components/ProjectLogo";
import { CreateLinkForm } from "../components/CreateLinkForm";
import { LinkList } from "../components/LinkList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-sans text-gray-100">
      <main className="flex w-full max-w-[960px] flex-col items-center gap-6">
        <header className="w-full">
          <ProjectLogo />
        </header>

        <div className="w-full flex flex-col gap-6 md:grid md:grid-cols-[2fr_3fr] md:items-start md:gap-5">
          <section className="w-full flex flex-col gap-8 bg-white/10 p-4 rounded-2xl sm:p-6">
            <h1 className="text-xl text-gray-200 font-bold tracking-tight">
              Novo link
            </h1>
            <CreateLinkForm />
          </section>

          <section className="w-full">
            <LinkList />
          </section>
        </div>
      </main>
    </div>
  );
}
