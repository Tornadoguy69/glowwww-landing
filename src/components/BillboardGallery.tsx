import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { billboards, type Billboard } from "../content/billboards";
import { fadeUp } from "../motion";

function BillboardCard({ board, onOpen }: { board: Billboard; onOpen: (b: Billboard) => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      className="billboard-card"
      onClick={() => onOpen(board)}
      aria-label={`Open billboard: ${board.title}`}
    >
      <div className="billboard-card__frame">
        {!failed ? (
          <img
            src={board.src}
            alt={board.alt}
            className="billboard-card__img"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="billboard-card__fallback">{board.title}</span>
        )}
      </div>
      <span className="billboard-card__title">{board.title}</span>
    </button>
  );
}

export function BillboardGallery() {
  const [active, setActive] = useState<Billboard | null>(null);
  const viewportConfig = { once: true, margin: "-60px" };

  return (
    <section id="billboards" className="section billboard-section">
      <motion.div
        className="billboard-section__intro"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Campaign</p>
        <h2 className="section__title">
          BILLBOARDS.
          <br />
          <span style={{ color: "var(--red)" }}>ONE VOICE.</span>
        </h2>
        <p className="section__lead">
          A growing series of out-of-home concepts for Glowwww. Pure black, one idea per board, no noise.
        </p>
      </motion.div>

      <motion.div
        className="billboard-grid"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0.12}
      >
        {billboards.map((board) => (
          <BillboardCard key={board.id} board={board} onOpen={setActive} />
        ))}
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="billboard-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.figure
              className="billboard-lightbox__figure"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.src} alt={active.alt} className="billboard-lightbox__img" />
              <figcaption className="billboard-lightbox__caption">
                <span>{active.title}</span>
              </figcaption>
              <button
                type="button"
                className="billboard-lightbox__close"
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ×
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
