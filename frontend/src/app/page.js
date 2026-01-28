export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight">
          Novastra
        </h1>
        <p className="text-xl md:text-2xl text-textSecondary max-w-2xl mx-auto">
          Bridge the gap between your skills and your dream career with our advanced analyzer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-surface border border-border p-6 rounded-2xl text-left space-y-4 hover:border-primary transition-colors">
            <h3 className="text-textPrimary text-xl font-semibold">Skill Analysis</h3>
            <p className="text-textMuted">Upload your resume and get a detailed breakdown of your current skillset.</p>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl text-left space-y-4 hover:border-primary transition-colors">
            <h3 className="text-textPrimary text-xl font-semibold">Market Trends</h3>
            <p className="text-textMuted">Compare your skills with the latest industry requirements and trends.</p>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl text-left space-y-4 hover:border-primary transition-colors">
            <h3 className="text-textPrimary text-xl font-semibold">Learning Path</h3>
            <p className="text-textMuted">Get personalized recommendations to bridge your identifying gaps.</p>
          </div>
        </div>

        <div className="mt-12">
          <button className="bg-primary hover:bg-primarySoft text-background font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
