export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-24 md:px-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Settings</h1>
      </header>

      <section className="mt-8 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 md:p-8">
        <div className="border-b border-slate-200/70 pb-6 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Theme preferences</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Dark/Light mode toggle coming soon.</p>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Details</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">User profile and authentication coming soon.</p>
        </div>
      </section>
    </main>
  );
}
