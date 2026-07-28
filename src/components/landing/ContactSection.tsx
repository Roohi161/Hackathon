import { Mail, MapPin, Phone } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Get In Touch</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Have questions about hosting a hackathon or need technical support? Our team is here to help you out.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Email Us</h4>
                <p className="text-slate-400 mt-1">support@hackathoncentral.io</p>
                <p className="text-slate-400">partners@hackathoncentral.io</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Visit Us</h4>
                <p className="text-slate-400 mt-1">123 Innovation Drive<br />Tech District, SF 94105</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Call Us</h4>
                <p className="text-slate-400 mt-1">+1 (555) 123-4567</p>
                <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9am-6pm PST</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
