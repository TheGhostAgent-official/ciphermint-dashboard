export default function RackdogPage() {
  return (
    <main className="cm-page">
      <div className="cm-shell">
        <header className="cm-header">
          <div className="cm-header-left">
            <div className="cm-logo-block" />
            <div className="cm-title-wrap">
              <div className="cm-title">
                <span className="cm-title-gradient">Rackdog</span>{" "}
                Token Overview
              </div>
              <p className="cm-subtitle">
                Flagship ecosystem token (RACKD) for the CipherMint Chain.
              </p>
            </div>
          </div>
        </header>

        <div className="cm-grid">
          <section>
            <div className="cm-card">
              <h2 className="cm-card-title">Positioning</h2>
              <p className="cm-info-text">
                Rackdog (RACKD) is the first force released from the CipherMint
                Chain. It is intentionally designed as a{" "}
                <span className="cm-info-highlight">meme + utility hybrid</span>{" "}
                token: culturally expressive like a meme coin, but with real
                hooks into creator and gaming economies.
              </p>
              <p className="cm-info-text">
                The goal is to give brands, games, and communities a{" "}
                <span className="cm-info-highlight">ready-made asset</span>{" "}
                they can plug into, instead of forcing each partner to invent
                their own token from scratch.
              </p>
            </div>

            <div className="cm-card" style={{ marginTop: 12 }}>
              <h2 className="cm-card-title">Utility Plan</h2>
              <ul className="cm-eco-list">
                <li>
                  • Access token for gated communities, creator content, and
                  special game modes.
                </li>
                <li>
                  • Rewards engine for in-game performance, quests, and creator
                  milestones.
                </li>
                <li>
                  • Fee and routing token inside CipherMint-powered apps and
                  future layers.
                </li>
                <li>
                  • Loyalty rail for brands: hold RACKD to unlock perks,
                  discounts, or in-world boosts.
                </li>
              </ul>
            </div>
          </section>

          <aside>
            <div className="cm-card">
              <h2 className="cm-card-title">Demo Tokenomics</h2>
              <div className="cm-status-meta">
                <div className="cm-status-row">
                  <span className="cm-status-label">Demo total supply</span>
                  <span className="cm-status-value">
                    100,000,000 RACKD
                  </span>
                </div>
                <div className="cm-status-row">
                  <span className="cm-status-label">Demo circulating</span>
                  <span className="cm-status-value">
                    84,500,000 RACKD
                  </span>
                </div>
                <div className="cm-status-row">
                  <span className="cm-status-label">Ecosystem / growth</span>
                  <span className="cm-status-value">10%</span>
                </div>
                <div className="cm-status-row">
                  <span className="cm-status-label">
                    Team & advisors (locked)
                  </span>
                  <span className="cm-status-value">10%</span>
                </div>
              </div>
              <p className="cm-helper" style={{ marginTop: 10 }}>
                Numbers shown here are for demo purposes and can be tuned before
                a public launch.
              </p>
            </div>

            <div className="cm-card" style={{ marginTop: 12 }}>
              <h2 className="cm-card-title">Why Rackdog first?</h2>
              <p className="cm-info-text">
                Launching Rackdog first gives CipherMint a{" "}
                <span className="cm-info-highlight">
                  single, recognizable
                </span>{" "}
                asset that communities can rally around, while still keeping the
                chain neutral for future brands and IP to build on without
                conflict.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
