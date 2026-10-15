import {useNavigate, Link} from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'


const values = [
  { title: 'Full-Grain Leather', note: 'Sourced from heritage tanneries' },
  { title: 'Hand-Stitched', note: 'Saddle-stitched by master artisans' },
  { title: 'Lifetime Repairs', note: 'Mended, free, for as long as you own it' },
];

export default function Home() {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">

        <Navbar />

        {/* Hero introduces the brand and sends shoppers to the catalog. */}
        <section className="bg-[#2b2118]">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">
              Est. 1912 · Northampton
            </p>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl leading-tight text-[#f6f1e7] md:text-5xl">
              Leather that outlives
              <br />
              the trends.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm italic text-[#c9bda6]">
              Full-grain hides, saddle-stitched by hand, made to be handed down —
              not replaced.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="border border-[#b08d57] bg-[#b08d57] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#c9a76e]"
              >
                Shop the Collection
              </button>
              <button className="border border-[#6e6250] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#e2d9c6] transition hover:border-[#b08d57] hover:text-[#b08d57]">
                Our Story
              </button>
            </div>
          </div>
        </section>

        {/* Workshop banner adds brand story before the product list. */}
        <section className="border-y border-[#d9cfbe] bg-[#fbf8f1]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center md:flex-row md:text-left">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center bg-gradient-to-br from-[#7a4a2b] via-[#5c3520] to-[#3a2315]">
              <span className="font-serif text-5xl text-[#c9a76e]/60">A</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">From the Workshop</p>
              <h2 className="mt-3 text-2xl leading-snug md:text-3xl">
                Four generations, one bench, no shortcuts.
              </h2>
              <p className="mt-3 max-w-xl text-sm italic text-[#8a7c66]">
                Every piece leaves our Northampton workshop after eleven pairs of
                hands and a fortnight of Quiet, deliberate work. The catalogue is
                small on purpose.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="shrink-0 border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              Browse Pieces
            </button>
          </div>
        </section>

        {/* Values strip repeats the main selling points in small blocks. */}
        <section className="border-y border-[#d9cfbe] bg-[#fbf8f1]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 text-center sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <span className="text-[10px] text-[#b08d57]">❦</span>
                <h3 className="mt-3 text-xs uppercase tracking-[0.25em]">{v.title}</h3>
                <p className="mt-2 text-sm italic text-[#8a7c66]">{v.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2b2118] text-[#c9bda6]">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <p className="tracking-[0.25em]">
              ASHFORD <span className="text-[#b08d57]">&amp;</span> SONS
            </p>
            <p className="mt-3 text-xs italic">Fine leather goods since 1912</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.25em]">
              <Link to="/products" className="transition hover:text-[#b08d57]">Collection</Link>
              <a href="#" className="transition hover:text-[#b08d57]">Returns</a>
              <a href="#" className="transition hover:text-[#b08d57]">Care Guide</a>
              <a href="#" className="transition hover:text-[#b08d57]">Contact</a>
            </div>

            <p className="mt-10 text-[10px] tracking-[0.2em] text-[#8a7c66]">
              © 2026 Ashford &amp; Sons Ltd. · Northampton, England
            </p>
          </div>
        </footer>
      </div>
    );
  }
