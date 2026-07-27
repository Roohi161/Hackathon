export const LeaderboardSection = () => {
  return (
    <section id="leaderboard" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Top Hackers & Teams</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
            Check out the current standings. Earn points by winning hackathons, submitting quality projects, and helping others in the community.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 max-w-4xl mx-auto">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Global Ranking</span>
            <span className="text-sm text-indigo-600 font-medium">View All Categories →</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center hover:bg-slate-50 transition-colors">
                <span className="text-2xl font-black text-slate-300 w-12">#{i}</span>
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    T{i}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Team Innovators {i}</h4>
                    <p className="text-xs text-slate-500">12 Hackathons Won</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-slate-900">{10000 - i * 450} pts</span>
                  <span className="text-xs text-emerald-500 font-medium">↑ Top {i}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
