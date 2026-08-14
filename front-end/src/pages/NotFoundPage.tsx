import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-700 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/50">
        <h1 className="mb-4 text-3xl font-semibold">Página não encontrada</h1>
        <p className="mb-6 text-slate-300">A rota solicitada não existe.</p>
        <Link to="/entrar" className="text-fuchsia-400 hover:text-fuchsia-300">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
