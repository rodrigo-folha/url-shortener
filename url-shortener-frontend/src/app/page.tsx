"use client";

import { useState } from "react";
import { API_BASE_URL } from "../lib/api";

type ShortenerResponseDTO = {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
};

type ShortenerDTO = {
  url: string;
  urlPersonalizada?: string | null;
};

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [urlPersonalizada, setUrlPersonalizada] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ShortenerResponseDTO | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!originalUrl) {
      setError("Informe uma URL.");
      return;
    }

    const body: ShortenerDTO = {
      url: originalUrl,
      urlPersonalizada: urlPersonalizada || null,
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        let msg = "Erro ao encurtar URL.";
        if (data?.errors?.length > 0) {
          msg = data.errors[0].message;
        } else if (data?.message) {
          msg = data.message;
        }
        throw new Error(msg);
      }

      const data: ShortenerResponseDTO = await response.json();
      setResult(data);
      setOriginalUrl("");
      setUrlPersonalizada("");
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const getShortUrl = (shortCode: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${shortCode}`;
  };
    

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(getShortUrl(result.shortCode));
    alert("Link copiado para a área de transferência!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 shadow-lg border border-slate-800">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">URL Shortener</h1>
          <p className="text-sm text-slate-400 mt-1">
            Encurte links usando sua API em Java com Spring Boot.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">URL original</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://exemplo.com/minha-pagina"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              URL personalizada (opcional)
            </label>
            <input
              type="text"
              value={urlPersonalizada}
              onChange={(e) => setUrlPersonalizada(e.target.value)}
              placeholder="minha-url-personalizada"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Aceita apenas letras, números e hífen.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Encurtando..." : "Encurtar URL"}
          </button>
        </form>

        {result && (
          <section className="mt-6 border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold mb-2">URL encurtada:</h2>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400">
                Original:{" "}
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline break-all"
                >
                  {result.url}
                </a>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={getShortUrl(result.shortCode)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg bg-slate-800 text-sm break-all underline"
                >
                  {getShortUrl(result.shortCode)}
                </a>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  Copiar
                </button>
              </div>

              <span className="text-[11px] text-slate-500">
                Criado em:{" "}
                {new Date(result.createdAt).toLocaleString("pt-BR")}
              </span>
            </div>
          </section>
        )}

        <footer className="mt-6 text-right">
          <a
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Ver dashboard de URLs
          </a>
        </footer>
      </div>
    </main>
  );
}
