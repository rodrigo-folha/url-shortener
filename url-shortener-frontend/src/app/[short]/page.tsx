import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/src/lib/api";

type ShortenerResponseDTO = {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
};

type PageProps = {
  params: Promise<{
    short: string;
  }>;
};

export default async function RedirectPage(props: PageProps) {
  // ⬅️ Agora sim!! Next 15 requer await nos params
  const { short } = await props.params;

  const resp = await fetch(`${API_BASE_URL}/shorten/${short}`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">URL não encontrada</h1>
          <p className="text-sm text-slate-400 mb-4">
            Não foi possível encontrar nenhum destino para <code>/s/{short}</code>.
          </p>
          <a
            href="/"
            className="text-sm px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-900"
          >
            Voltar para a página inicial
          </a>
        </div>
      </main>
    );
  }

  const data: ShortenerResponseDTO = await resp.json();

  redirect(data.url);
}
