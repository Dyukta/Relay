import Link from "next/link"

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .relay-mono { font-family: 'DM Mono', monospace; }
        .nav-link { color: #555; font-size: 12px; transition: color 0.15s; font-family: 'DM Mono', monospace; }
        .nav-link:hover { color: #fff; }
        .doc-divider { border: none; border-top: 1px solid #111; margin: 0; }
        .log-row { display: flex; align-items: flex-start; gap: 14px; padding: 7px 0; border-bottom: 1px solid #0d0d0d; }
        .log-row:last-child { border-bottom: none; }
        .doc-row { display: flex; align-items: baseline; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #111; }
        .doc-row:last-child { border-bottom: none; }
        .toc-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
        .feature-card { background: #0d0d0d; border: 1px solid #161616; border-radius: 10px; padding: 20px; }
        .btn-primary { display: inline-block; background: #6366f1; color: #fff; border-radius: 7px; padding: 9px 18px; font-size: 12px; font-family: 'DM Mono', monospace; transition: background 0.15s; }
        .btn-primary:hover { background: #5558e8; }
        .btn-ghost { display: inline-block; color: #555; border: 1px solid #1f1f1f; border-radius: 7px; padding: 9px 18px; font-size: 12px; font-family: 'DM Mono', monospace; transition: color 0.15s, border-color 0.15s; }
        .btn-ghost:hover { color: #fff; border-color: #333; }
        .tag { font-family: 'DM Mono', monospace; font-size: 10px; color: #333; text-transform: uppercase; letter-spacing: 0.1em; }
        .code-inline { font-family: 'DM Mono', monospace; font-size: 11px; color: #6366f1; background: rgba(99,102,241,0.08); padding: 1px 5px; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", position: "sticky", top: 0, zIndex: 50, background: "#080808" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#6366f1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="relay-mono" style={{ color: "#fff", fontSize: 10, fontWeight: 500 }}>R</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.02em" }}>Relay</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
            <Link href="/login" className="nav-link">Sign in →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 32px 72px" }}>
        <h1 style={{ fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, color: "#fff", marginBottom: 24, maxWidth: 600 }}>
          Automate workflows.<br />
          <span style={{ color: "#6366f1" }}>Debug with confidence.</span>
        </h1>
        <p style={{ fontSize: 16, fontWeight: 300, color: "#555", lineHeight: 1.75, maxWidth: 460, marginBottom: 36 }}>
          Relay receives events through webhook endpoints, processes them asynchronously, and gives you full observability into every execution — logs, payloads, and failures in one place.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/register" className="btn-primary">Get started free →</Link>
          <Link href="/login" className="btn-ghost">View demo</Link>
        </div>
      </section>

      {/* Execution log preview */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 620, background: "#0d0d0d", border: "1px solid #161616", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#1a1a1a" }} />)}
            </div>
            <span className="relay-mono" style={{ fontSize: 10, color: "#2a2a2a" }}>relay.dev/executions/ex_a8f3b21</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              <span className="relay-mono" style={{ fontSize: 10, color: "#4ade80" }}>SUCCESS</span>
            </div>
          </div>
          <div style={{ padding: "6px 16px 10px" }}>
            {[
              { t: "16:42:11.024", l: "INFO",    m: "Event received from 54.187.174.169",   info: true },
              { t: "16:42:11.041", l: "INFO",    m: "Job queued in workers.default",         info: true },
              { t: "16:42:11.118", l: "INFO",    m: "Worker w-04 picked up job ej_8a72d",    info: true },
              { t: "16:42:11.201", l: "INFO",    m: "Sending email to billing@acme.co",      info: true },
              { t: "16:42:11.308", l: "SUCCESS", m: "Email delivered to billing@acme.co",    info: false },
              { t: "16:42:11.312", l: "SUCCESS", m: "Execution completed in 288ms",          info: false },
            ].map((row, i) => (
              <div key={i} className="log-row">
                <span className="relay-mono" style={{ fontSize: 10, color: "#222", flexShrink: 0 }}>{row.t}</span>
                <span className="relay-mono" style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, flexShrink: 0, color: row.info ? "#6366f1" : "#4ade80", background: row.info ? "rgba(99,102,241,0.08)" : "rgba(74,222,128,0.08)" }}>{row.l}</span>
                <span className="relay-mono" style={{ fontSize: 10, color: "#3a3a3a" }}>{row.m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="doc-divider" />

      {/* Architecture */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }}>
          <div>
            <p className="tag" style={{ marginBottom: 16 }}>Architecture</p>
            <h2 style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.2, marginBottom: 18, maxWidth: 340 }}>
              One endpoint.<br />Full pipeline visibility.
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, color: "#555", lineHeight: 1.75, marginBottom: 32, maxWidth: 380 }}>
              Every webhook event travels through a structured pipeline. Each step is logged, timed, and stored — so when something fails, you know exactly where and why.
            </p>
            {[
              { n: "01", label: "Receive", desc: "HMAC-verified POST to a generated endpoint" },
              { n: "02", label: "Queue",   desc: "Job enqueued with payload and workflow config" },
              { n: "03", label: "Execute", desc: "Worker runs the action — email or webhook" },
              { n: "04", label: "Log",     desc: "Every step written to the execution record" },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid #111" : "none" }}>
                <span className="relay-mono" style={{ fontSize: 10, color: "#222", paddingTop: 2, width: 18, flexShrink: 0 }}>{s.n}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 2 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #111" }}>
              <p className="tag">Dashboard overview</p>
            </div>
            <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { l: "Total executions", v: "18,398" },
                { l: "Success rate",     v: "97.5%" },
                { l: "Avg latency",      v: "284ms" },
              ].map(s => (
                <div key={s.l} style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 8, padding: "12px 14px" }}>
                  <p className="tag" style={{ marginBottom: 6 }}>{s.l}</p>
                  <p style={{ fontSize: 18, fontWeight: 300, color: "#fff" }}>{s.v}</p>
                </div>
              ))}
            </div>
            <div style={{ margin: "0 16px 16px", background: "#0a0a0a", border: "1px solid #111", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "7px 12px", borderBottom: "1px solid #0f0f0f" }}>
                <p className="tag">Recent executions</p>
              </div>
              {[
                { name: "Stripe Payment Notifier",  s: "SUCCESS", ms: "389ms", ok: true },
                { name: "GitHub Issue → Linear",    s: "SUCCESS", ms: "498ms", ok: true },
                { name: "Shopify Order Forwarder",  s: "FAILED",  ms: "266ms", ok: false },
                { name: "Internal Slack Alerts",    s: "SUCCESS", ms: "196ms", ok: true },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid #0d0d0d" }}>
                  <span className="relay-mono" style={{ fontSize: 10, color: "#3a3a3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>{r.name}</span>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <span className="relay-mono" style={{ fontSize: 9, color: r.ok ? "#4ade80" : "#f87171", background: r.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", padding: "2px 5px", borderRadius: 3 }}>{r.s}</span>
                    <span className="relay-mono" style={{ fontSize: 9, color: "#222" }}>{r.ms}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="doc-divider" />

      {/* Features */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
        <p className="tag" style={{ marginBottom: 16 }}>Built for production</p>
        <h2 style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.2, marginBottom: 36, maxWidth: 440 }}>
          Everything you need to ship event-driven systems.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { title: "Webhook Triggers",    desc: "Auto-generated endpoints with HMAC-SHA256 signed payloads and replay protection." },
            { title: "Queue Processing",    desc: "Durable job queue with exponential backoff, retry logic, and dead-letter handling." },
            { title: "Execution Tracking",  desc: "Per-run timelines, structured logs, and event payloads searchable across all workflows." },
            { title: "Failure Monitoring",  desc: "Alerts on failure spikes, full stack traces, and status visibility across your workspace." },
          ].map(c => (
            <div key={c.title} className="feature-card">
              <p style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 8 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="doc-divider" />

      {/* Case study — Glasswing-style editorial doc */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 64 }}>

          {/* TOC */}
          <div style={{ position: "sticky", top: 68, alignSelf: "start" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#2a2a2a", marginBottom: 14, letterSpacing: "0.02em" }}>Table of Contents</p>
            {["Overview", "The problem", "How Relay works", "Implementation", "Results"].map((item, i) => (
              <div key={item} className="toc-item">
                <span style={{ width: 8, height: 8, background: i === 0 ? "#6366f1" : "transparent", border: i === 0 ? "none" : "1px solid #222", borderRadius: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: i === 0 ? "#fff" : "#444", fontWeight: i === 0 ? 500 : 400 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Editorial content */}
          <div>
            <p className="tag" style={{ marginBottom: 12 }}>Case study · Stripe Payment Pipeline</p>
            <h2 style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.25, marginBottom: 20, maxWidth: 500 }}>
              How teams use Relay to automate critical payment workflows
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: "#555", lineHeight: 1.8, marginBottom: 32, maxWidth: 540 }}>
              Modern SaaS products rely on dozens of event streams — payments, signups, failures, deployments. Managing these events reliably across services requires infrastructure most teams don't have time to build.
            </p>

            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 10 }}>The problem</h3>
            <p style={{ fontSize: 14, fontWeight: 300, color: "#555", lineHeight: 1.8, marginBottom: 28, maxWidth: 540 }}>
              When Stripe fires a <code className="code-inline">payment.succeeded</code> event, teams need to send a receipt email, update their database, notify Slack, and trigger fulfillment — all reliably, with retry logic, and with a full audit trail. Building this manually takes weeks and breaks constantly.
            </p>

            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 10 }}>How Relay works</h3>
            <p style={{ fontSize: 14, fontWeight: 300, color: "#555", lineHeight: 1.8, marginBottom: 20, maxWidth: 540 }}>
              You point Stripe's webhook settings at a Relay-generated endpoint. Every event Stripe sends is received, verified with HMAC-SHA256, and processed through your configured workflow — no servers, no queue infrastructure, no ops overhead.
            </p>

            {/* Inline trace */}
            <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between" }}>
                <span className="tag">Execution trace · ex_a8f3b21</span>
                <span className="relay-mono" style={{ fontSize: 10, color: "#4ade80" }}>Completed in 284ms</span>
              </div>
              <div style={{ padding: "4px 14px 8px" }}>
                {[
                  { t: ":11.024", l: "INFO",    m: "Event received · payment.succeeded · $49.00 USD", ok: false },
                  { t: ":11.041", l: "INFO",    m: "Job enqueued · Stripe Payment Notifier",          ok: false },
                  { t: ":11.118", l: "INFO",    m: "Worker picked up job · sending receipt email",    ok: false },
                  { t: ":11.308", l: "SUCCESS", m: "Email delivered · billing@acme.co",               ok: true  },
                  { t: ":11.312", l: "SUCCESS", m: "Execution complete · 284ms",                      ok: true  },
                ].map((r, i) => (
                  <div key={i} className="log-row">
                    <span className="relay-mono" style={{ fontSize: 10, color: "#1f1f1f", flexShrink: 0 }}>{r.t}</span>
                    <span className="relay-mono" style={{ fontSize: 9, color: r.ok ? "#4ade80" : "#6366f1", background: r.ok ? "rgba(74,222,128,0.08)" : "rgba(99,102,241,0.08)", padding: "2px 5px", borderRadius: 3, flexShrink: 0 }}>{r.l}</span>
                    <span className="relay-mono" style={{ fontSize: 10, color: "#333" }}>{r.m}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 10 }}>Implementation</h3>
            <p style={{ fontSize: 14, fontWeight: 300, color: "#555", lineHeight: 1.8, marginBottom: 28, maxWidth: 540 }}>
              Relay uses HMAC-SHA256 with <code className="code-inline">timingSafeEqual</code> from Node's built-in <code className="code-inline">crypto</code> module to verify every incoming request against your workspace signing secret — preventing timing attacks. Invalid requests are rejected with a <code className="code-inline">401</code> before any processing begins. Jobs retry up to three times with exponential backoff.
            </p>

            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 14 }}>Results</h3>
            <div>
              {[
                { label: "Total executions processed",           value: "18,398" },
                { label: "Average execution latency",            value: "284ms" },
                { label: "Success rate across all workflows",    value: "97.5%" },
                { label: "Failed executions recovered via retry",value: "94%" },
                { label: "Time to debug a failure",              value: "< 30 seconds" },
              ].map(r => (
                <div key={r.label} className="doc-row">
                  <span style={{ fontSize: 13, color: "#555" }}>{r.label}</span>
                  <span className="relay-mono" style={{ fontSize: 13, color: "#fff" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="doc-divider" />

      {/* Footer */}
      <footer style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, background: "#6366f1", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="relay-mono" style={{ color: "#fff", fontSize: 9, fontWeight: 500 }}>R</span>
          </div>
          <span className="relay-mono" style={{ fontSize: 11, color: "#222" }}>© 2025 Relay Labs, Inc.</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="relay-mono" style={{ fontSize: 11, color: "#333" }}>GitHub</a>
          <Link href="/login" className="relay-mono" style={{ fontSize: 11, color: "#333" }}>Sign in</Link>
        </div>
      </footer>

    </div>
  )
}