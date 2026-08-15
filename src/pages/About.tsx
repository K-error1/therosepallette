import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-16 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-20">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Biography & Statement</span>
          {/* TODO: Customize Artist Full Name */}
          <h1 className="font-serif text-5xl sm:text-6xl text-white">THEROSEPALLETTE</h1>
          <p className="text-stone-300 text-lg font-light leading-relaxed">
            {/* TODO: Replace short tagline with your personal bio tagline */}
            Nairobi-Kenya based visual artist.Exploring identity, memory, and the boundary between observer and observed through the "Crows" lens
          </p>
        </div>

        {/* Hero Studio Image & Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Artist Philosophy</h2>
            {/* TODO: Replace with your actual artist statement text */}
            <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed">
              <p>
                I don't think of my work as being about birds. Crows are the entry point, not the subject. What I'm actually interested in is the exchange that happens the moment something looks back at you- a mirror, a memory, a creature that remembers your face better than you remember its. Where does the self end and the observer begin?
              </p>
              <p>
                I'm drawn to crows because they complicate a boundary we rarely question: the one between who's watching and who's being watched. Crows recognize faces. They remember them for years, pass that memory to their young, hold a grudge or a familiarity long after we've forgotten the encounter ourselves. That unsettles something, the assumption that observation only moves in one direction, from us toward the world.
              </p>
              <p>
                My work sits inside that discomfort. I fuse human forms with crow skulls and features not to make a costume, but to ask a genuine question: when you are the one being watched, what does that do to your sense of self? And more importantly, who is actually watching you through the parts of your life no one else sees? Usually, the answer is uncomfortable in its simplicity: you are.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            {/* TODO: Replace photo with actual studio photo of artist */}
            <img
              src="/artist-portrait.jpg"
              alt="THEROSEPALLETTE in studio"
              className="w-full h-[32rem] object-cover rounded border border-stone-800"
            />
            <p className="mt-2 text-[11px] text-stone-400 font-mono tracking-widest text-center">
              Studio space in Nairobi, Kenya. Photo credit: Studio Archive.
            </p>
          </motion.div>
        </div>


      </div>
    </div>
  );
}
