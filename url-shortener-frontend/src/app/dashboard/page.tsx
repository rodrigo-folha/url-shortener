"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/lib/api";

type ShortenerResponseDTO = {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
};

type StatisticsResponseDTO = {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
  accessCount: number;
};

type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // página atual
};

type ShortenerDTO = {
  url: string;
  urlPersonalizada?: string | null;
};

export default function DashboardPage() {
  const [page, setPage] = useState<PageResponse<ShortenerResponseDTO> | null>(
    null
  );
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // menu de ações (ícone lápis)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // dialog de estatísticas
  const [statsOpen, setStatsOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [stats, setStats] = useState<StatisticsResponseDTO | null>(null);

  // dialog de edição
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editItem, setEditItem] = useState<ShortenerResponseDTO | null>(null);

  const fetchPage = async (pageNoParam: number) => {
    setLoading(true);
    setError("");

    try {
      const resp = await fetch(
        `${API_BASE_URL}/shorten/all?pageNo=${pageNoParam}&pageSize=${pageSize}`
      );
      if (!resp.ok) {
        throw new Error(`Erro ao buscar URLs (status ${resp.status})`);
      }
      const data: PageResponse<ShortenerResponseDTO> = await resp.json();
      setPage(data);
      setPageNo(data.number);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(0);
  }, []);

  const getShortUrl = (shortCode: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${shortCode}`;
  };

  const handleDelete = async (shortCode: string) => {
    if (!confirm("Tem certeza que deseja deletar essa URL?")) return;

    try {
      const resp = await fetch(`${API_BASE_URL}/shorten/${shortCode}`, {
        method: "DELETE",
      });
      if (!resp.ok && resp.status !== 204) {
        throw new Error(`Erro ao deletar (status ${resp.status})`);
      }
      fetchPage(pageNo);
    } catch (err: any) {
      alert(err.message || "Erro ao deletar URL.");
    }
  };

  const handleOpenStats = async (shortCode: string) => {
    setStatsOpen(true);
    setStatsLoading(true);
    setStatsError("");
    setStats(null);

    try {
      const resp = await fetch(`${API_BASE_URL}/shorten/${shortCode}/stats`);
      if (!resp.ok) {
        throw new Error(
          `Erro ao buscar estatísticas (status ${resp.status})`
        );
      }
      const data: StatisticsResponseDTO = await resp.json();
      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || "Erro ao carregar estatísticas.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleOpenEdit = (item: ShortenerResponseDTO) => {
    setEditItem(item);
    setEditUrl(item.url);
    setEditError("");
    setEditOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    setEditLoading(true);
    setEditError("");

    const body: ShortenerDTO = {
      url: editUrl,
      urlPersonalizada: null, // atualizar só a URL original
    };

    try {
      const resp = await fetch(
        `${API_BASE_URL}/shorten/${editItem.shortCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const data = await resp.json().catch(() => null);

        let msg = "Erro ao atualizar URL.";
        if (data?.errors?.length > 0) {
          msg = data.errors[0].message;
        } else if (data?.message) {
          msg = data.message;
        }

        throw new Error(msg);
      }

      // deu certo → fecha dialog e recarrega página atual
      setEditOpen(false);
      setEditItem(null);
      fetchPage(pageNo);
    } catch (err: any) {
      setEditError(err.message || "Erro ao atualizar URL.");
    } finally {
      setEditLoading(false);
    }
  };

  const hasPrevious = page && page.number > 0;
  const hasNext = page && page.number < page.totalPages - 1;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard de URLs</h1>
            <p className="text-sm text-slate-400">
              Listagem paginada consumindo <code>/shorten/all</code>.
            </p>
          </div>
          <a
            href="/"
            className="text-sm px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-900"
          >
            Encurtar nova URL
          </a>
        </header>

        {loading && <p>Carregando...</p>}

        {error && (
          <p className="text-sm text-red-400 mb-4 bg-red-950/30 border border-red-500/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!loading && !error && page && (
          <>
            <div className="border border-slate-800 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/70">
                  <tr>
                    <th className="text-left px-4 py-3 border-b border-slate-800">
                      URL Encurtada
                    </th>
                    <th className="text-left px-4 py-3 border-b border-slate-800">
                      Original
                    </th>
                    <th className="text-left px-4 py-3 border-b border-slate-800">
                      Criada em
                    </th>
                    <th className="text-left px-4 py-3 border-b border-slate-800">
                      Atualizada em
                    </th>
                    <th className="text-left px-4 py-3 border-b border-slate-800">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.content.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-3 align-top">
                        <a
                          href={getShortUrl(item.shortCode)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {getShortUrl(item.shortCode)}
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top max-w-xs">
                        <span
                          title={item.url}
                          className="line-clamp-2 break-all text-slate-300"
                        >
                          {item.url}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {new Date(item.updatedAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === item.id ? null : item.id
                              )
                            }
                            className="px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800 text-xs"
                            title="Opções"
                          >
                            ✏️
                          </button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md bg-slate-900 border border-slate-700 shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleOpenStats(item.shortCode);
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800"
                              >
                                Ver estatísticas
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleOpenEdit(item);
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800"
                              >
                                Editar URL
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleDelete(item.shortCode);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-950/40"
                              >
                                Deletar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {page.content.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Nenhuma URL cadastrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
              <span>
                Página {page.number + 1} de {page.totalPages} —{" "}
                {page.totalElements} registro(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => hasPrevious && fetchPage(pageNo - 1)}
                  disabled={!hasPrevious}
                  className="px-3 py-1 rounded-md border border-slate-700 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  onClick={() => hasNext && fetchPage(pageNo + 1)}
                  disabled={!hasNext}
                  className="px-3 py-1 rounded-md border border-slate-700 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog de estatísticas */}
      {statsOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Estatísticas da URL</h2>
              <button
                onClick={() => setStatsOpen(false)}
                className="text-sm text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            {statsLoading && <p className="text-sm">Carregando...</p>}

            {statsError && (
              <p className="text-sm text-red-400 mb-2 bg-red-950/30 border border-red-500/40 rounded-lg px-3 py-2">
                {statsError}
              </p>
            )}

            {!statsLoading && !statsError && stats && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">URL encurtada:</span>
                  <div className="break-all text-slate-300">
                    {getShortUrl(stats.shortCode)}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Original:</span>
                  <div className="break-all text-slate-300">{stats.url}</div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Criada em:</span>
                  <span>
                    {new Date(stats.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Atualizada em:</span>
                  <span>
                    {new Date(stats.updatedAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total de acessos:</span>
                  <span className="text-indigo-300">{stats.accessCount}</span>
                </div>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setStatsOpen(false)}
                className="text-sm px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de edição de URL */}
      {editOpen && editItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Editar URL ({editItem.shortCode})
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="text-sm text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">URL original</label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {editError && (
                <p className="text-sm text-red-400 mb-2 bg-red-950/30 border border-red-500/40 rounded-lg px-3 py-2">
                  {editError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="text-sm px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
                >
                  {editLoading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
