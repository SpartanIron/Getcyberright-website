import { QuickAssessment } from "@/components/quick-assessment";

export default function QuickAssessmentPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Discover Your Skill Level
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Take our quick 5-question assessment to find out where you stand and get personalized learning recommendations.
          </p>
        </div>
        <QuickAssessment />
      </div>
    </div>
  );
}
