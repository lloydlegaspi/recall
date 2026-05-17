import SubjectGrid from "@/app/components/dashboard/SubjectGrid";
import { supabase } from "@/lib/supabase";

type Subject = {
  id: string;
  title: string;
  slug: string;
  color_theme: string | null;
};

export default async function DashboardPage() {
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, title, slug, color_theme, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-10">
      <div className="space-y-1">
        <h1 className="font-sans text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
          Hi, champion!
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-300">
          Pick a subject to resume your recall flow.
        </p>
      </div>

      <SubjectGrid subjects={(subjects as Subject[]) || []} />
    </section>
  );
}
