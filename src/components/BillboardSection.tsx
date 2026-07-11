import { useState } from 'react'

interface Billboard {
  id: string
  title: string
  src: string
  alt: string
}

const billboards: Billboard[] = [
  { id: "08", title: "The Question", src: "/billboards/glowwww_billboard_08_the_question.png", alt: "Glowwww billboard — the question" },
  { id: "09", title: "Verified", src: "/billboards/glowwww_billboard_09_verified.png", alt: "Glowwww billboard — verified" },
  { id: "10", title: "The Editor", src: "/billboards/glowwww_billboard_10_the_editor.png", alt: "Glowwww billboard — the editor" },
  { id: "12", title: "Search It", src: "/billboards/glowwww_billboard_12_search_it.png", alt: "Glowwww billboard — search it" },
  { id: "13", title: "Dark Enough", src: "/billboards/glowwww_billboard_13_dark_enough.png", alt: "Glowwww billboard — dark enough" },
  { id: "14", title: "The Split", src: "/billboards/glowwww_billboard_14_the_split.png", alt: "Glowwww billboard — the split" },
  { id: "15", title: "Waveform", src: "/billboards/glowwww_billboard_15_waveform.png", alt: "Glowwww billboard — waveform" },
  { id: "16", title: "One App", src: "/billboards/glowwww_billboard_16_1_app.png", alt: "Glowwww billboard — one app" },
  { id: "17", title: "Says Sorry", src: "/billboards/glowwww_billboard_17_says_sorry.png", alt: "Glowwww billboard — says sorry" },
  { id: "18", title: "Native", src: "/billboards/glowwww_billboard_18_native.png", alt: "Glowwww billboard — native" },
  { id: "19", title: "Your AI Has A Name", src: "/billboards/glowwww_billboard_19_your_ai_has_a_name.png", alt: "Glowwww billboard — your AI has a name" },
  { id: "20", title: "Delete Four", src: "/billboards/glowwww_billboard_20_delete_four.png", alt: "Glowwww billboard — delete four" },
  { id: "21", title: "Built At 3AM", src: "/billboards/glowwww_billboard_21_built_at_3am.png", alt: "Glowwww billboard — built at 3am" },
  { id: "22", title: "AI Never Sleeps", src: "/billboards/glowwww_billboard_22_ai_never_sleeps.png", alt: "Glowwww billboard — AI never sleeps" },
  { id: "23", title: "The Compass", src: "/billboards/glowwww_billboard_23_the_compass.png", alt: "Glowwww billboard — the compass" },
  { id: "24", title: "Ready", src: "/billboards/glowwww_billboard_24_ready.png", alt: "Glowwww billboard — ready" },
  { id: "25", title: "Think Out Loud", src: "/billboards/glowwww_billboard_25_think_out_loud.png", alt: "Glowwww billboard — think out loud" },
  { id: "26", title: "Early Adopters", src: "/billboards/glowwww_billboard_26_early_adopters.png", alt: "Glowwww billboard — early adopters" },
  { id: "27", title: "Glowwww", src: "/billboards/glowwww_billboard_27_glow_www.png", alt: "Glowwww billboard — glowwww" },
]

export default function BillboardSection() {
  const [lightbox, setLightbox] = useState<Billboard | null>(null)

  return (
    <section id="billboards" className="section billboard-section">
      <p className="section__label">Campaign</p>
      <h2 className="section__title">
        BILLBOARD<br /><span style={{ color: "var(--red)" }}>CONCEPTS</span>
      </h2>
      <p className="section__lead">
        A collection of outdoor campaign concepts exploring Glowwww's identity — minimal, bold, typographic.
      </p>
      <div className="billboard-grid">
        {billboards.map(b => (
          <button
            key={b.id}
            className="billboard-card"
            onClick={() => setLightbox(b)}
            aria-label={`Open billboard: ${b.title}`}
          >
            <div className="billboard-card__frame">
              <img
                src={b.src}
                alt={b.alt}
                className="billboard-card__img"
                loading="lazy"
                onError={e => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const fb = t.parentElement?.querySelector('.billboard-card__fallback') as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <div className="billboard-card__fallback" style={{ display: 'none' }}>{b.title}</div>
            </div>
            <span className="billboard-card__title">{b.title}</span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="billboard-lightbox" onClick={() => setLightbox(null)}>
          <figure className="billboard-lightbox__figure" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="billboard-lightbox__img"
            />
            <figcaption className="billboard-lightbox__caption">
              {lightbox.title}
            </figcaption>
            <button
              className="billboard-lightbox__close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ×
            </button>
          </figure>
        </div>
      )}
    </section>
  )
}
