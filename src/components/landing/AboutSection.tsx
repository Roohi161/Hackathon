export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">HackathonCentral</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-6">
              We started HackathonCentral with a simple mission: to make organizing and participating in hackathons seamless, enjoyable, and intensely collaborative. 
            </p>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Whether you are a developer looking for your next big challenge, an organizer trying to manage hundreds of participants, or a judge evaluating the next unicorn startup, our platform provides the specialized tools you need to succeed.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div>
                <span className="block text-4xl font-black text-indigo-600">50k+</span>
                <span className="block mt-1 text-sm font-medium text-slate-500 uppercase tracking-wider">Active Hackers</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-cyan-500">1,200+</span>
                <span className="block mt-1 text-sm font-medium text-slate-500 uppercase tracking-wider">Hackathons Hosted</span>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-cyan-200 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80" 
              alt="Hackathon Team" 
              className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full border border-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
