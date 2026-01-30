import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-textPrimary selection:bg-primary selection:text-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-background text-xl">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">Novastra</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-textSecondary font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-textSecondary hover:text-textPrimary transition-colors font-medium">
              Login
            </Link>
            <Link href="/signup" className="bg-primary hover:bg-primarySoft text-background font-bold px-6 py-2.5 rounded-full transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              AI-Powered Skill Gap Analysis
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Bridge the Gap to Your <span className="text-primary">Dream Career</span>
            </h1>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed">
              Upload your resume and let Novastra analyze your skills against industry standards. Get a personalized learning path to land your next role.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/upload" className="w-full sm:w-auto bg-primary hover:bg-primarySoft text-background text-lg font-bold px-10 py-4 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Upload Resume
              </Link>
              <button className="w-full sm:w-auto border border-border hover:border-primary px-10 py-4 rounded-full font-bold transition-all">
                View Demo
              </button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-6 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">How Novastra Works</h2>
              <p className="text-textSecondary">Four simple steps to accelerate your career growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Upload", desc: "Simply drop your resume (PDF or Image)." },
                { step: "02", title: "Analyze", desc: "Our AI extracts and classifies your skills." },
                { step: "03", title: "Compare", desc: "See how you stack up against job market data." },
                { step: "04", title: "Grow", desc: "Follow your personalized learning roadmap." }
              ].map((item, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-surface border border-border group hover:border-primary transition-all">
                  <span className="text-5xl font-black text-primary/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">{item.step}</span>
                  <div className="space-y-4 mt-4">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Powerful Features</h2>
              <p className="text-textSecondary">Tools designed to give you a competitive edge.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Advanced OCR", desc: "Extract text from any resume format with pinpoint accuracy using neural networks." },
                { title: "Skill Versioning", desc: "Track your growth over time as you complete courses and update your profile." },
                { title: "Market Insights", desc: "Real-time data on which skills are trending and which ones are becoming obsolete." }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-3xl bg-surface border border-border hover:shadow-[0_0_30px_rgba(124,108,255,0.15)] transition-all">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-textSecondary leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto relative p-12 md:p-20 rounded-[3rem] bg-primary overflow-hidden text-center text-background">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black">Ready to level up?</h2>
              <p className="text-xl font-medium opacity-90 max-w-xl mx-auto">
                Join thousands of professionals using Novastra to navigate their career paths.
              </p>
              <Link href="/upload" className="inline-block bg-background text-primary text-lg font-black px-12 py-5 rounded-full hover:shadow-2xl transition-all transform hover:scale-105">
                Analyze My Resume Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2 grayscale brightness-200">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="font-bold text-black text-sm">N</span>
            </div>
            <span className="text-xl font-bold">Novastra</span>
          </div>
          <p className="text-textMuted text-sm">© 2026 Novastra AI. All rights reserved.</p>
          <div className="flex gap-6 text-textMuted">
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">GitHub</a>
            <a href="#" className="hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
