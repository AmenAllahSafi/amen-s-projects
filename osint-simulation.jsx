import { useState } from "react";

const target = {
  name: "James R. Holloway",
  title: "Junior IT Support Specialist",
  company: "MediCore Solutions",
  location: "Austin, Texas",
  connections: "87 connections",
  email_hint: "j.holloway@medicore.io",
  photo: "https://thispersondoesnotexist.com",
  about: "Passionate about helping teams stay connected and productive. Currently handling helpdesk tickets at MediCore Solutions. Looking to grow into a sysadmin role. Big fan of hiking and amateur photography 📷. Dad of two. Coffee addict ☕",
  posts: [
    {
      id: "post1",
      text: "Just finished setting up our new Cisco Meraki switches 🔧 took all day but got it done. Shoutout to @TechBuddy Mike for walking me through the CLI. #ITSupport #Networking",
      date: "3 days ago",
      likes: 12,
    },
    {
      id: "post2",
      text: "Excited for the MediCore annual offsite in Denver next month! Can't wait to meet the whole team in person 🏔️ #MediCore #TeamBuilding",
      date: "1 week ago",
      likes: 34,
    },
    {
      id: "post3",
      text: "Happy to announce I passed my CompTIA A+ exam! Finally official 😅 It's been a long road since I started at MediCore 8 months ago. Next goal: Network+",
      date: "2 weeks ago",
      likes: 67,
    },
  ],
  skills: ["Windows 10/11", "Active Directory", "Helpdesk Support", "Cisco Meraki", "Office 365"],
  education: "Austin Community College — IT Support Certificate, 2022",
  phone_hint: "Posts birthday photos tagged 'Austin, TX' every September 14th",
};

const vulnerabilities = {
  name: {
    label: "Full Name Public",
    severity: "low",
    icon: "👤",
    attack: "Username Enumeration",
    detail:
      "Full name enables automated username guessing across platforms (jhollow, james.holloway, jrholloway). Combined with the company domain hint, an attacker can reconstruct his email with ~80% accuracy.",
  },
  company: {
    label: "Employer + Role Exposed",
    severity: "high",
    icon: "🏢",
    attack: "Spear Phishing",
    detail:
      "Knowing he works IT Support at MediCore Solutions makes him a prime spear phishing target. An attacker sends a fake 'urgent ticket escalation' email spoofing his manager. He has admin-level system access — one click and it's over.",
  },
  email_hint: {
    label: "Email Pattern Inferable",
    severity: "high",
    icon: "📧",
    attack: "Credential Stuffing / Phishing",
    detail:
      "His post mentions 'MediCore' and his full name is public. Standard corporate email pattern (firstname.lastname@domain) gives attackers j.holloway@medicore.io with high confidence. This feeds directly into credential stuffing tools.",
  },
  cisco_post: {
    label: "Infrastructure Details Leaked",
    severity: "critical",
    icon: "🔧",
    attack: "Targeted Network Attack",
    detail:
      "He publicly disclosed that MediCore runs Cisco Meraki switches and that he personally manages the CLI configuration. An attacker now knows the exact hardware vendor, can research current CVEs for Meraki, and knows James is the person to social-engineer for network access.",
  },
  offsite_post: {
    label: "Travel Schedule Public",
    severity: "medium",
    icon: "✈️",
    attack: "Physical Intrusion / Vishing",
    detail:
      "He's announced he'll be away at an offsite in Denver next month. An attacker can call MediCore's front desk posing as an IT vendor: 'James asked me to come by and check the network closet while he's in Denver.' Physical tailgating or vishing window is now open.",
  },
  cert_post: {
    label: "Skill Level & Tenure Disclosed",
    severity: "medium",
    icon: "🎓",
    attack: "Social Engineering",
    detail:
      "He revealed he's been at MediCore only 8 months and just passed A+. This tells an attacker he's junior, eager to prove himself, and may lack security skepticism. A call pretending to be a senior vendor rep exploiting his desire to impress is highly likely to succeed.",
  },
  skills: {
    label: "Tech Stack Exposed",
    severity: "high",
    icon: "🖥️",
    attack: "Targeted Exploit Delivery",
    detail:
      "Active Directory + Office 365 + Cisco Meraki in one profile. An attacker now has MediCore's full internal tech stack. They can craft phishing lures using fake O365 login pages, fake AD password reset prompts, or fake Meraki dashboard alerts — all perfectly tailored.",
  },
  birthday: {
    label: "Birthday Traceable",
    severity: "low",
    icon: "🎂",
    attack: "Security Question Bypass",
    detail:
      "September 14th birthday posts are public. Date of birth is a standard security question and identity verification factor. Combined with full name + employer, it's enough to bypass many account recovery flows.",
  },
};

const severityConfig = {
  low: { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", label: "LOW" },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", label: "MED" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", label: "HIGH" },
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", label: "CRIT" },
};

const attackOrder = ["name", "email_hint", "company", "skills", "cisco_post", "cert_post", "offsite_post", "birthday"];

export default function OSINTSim() {
  const [activeVuln, setActiveVuln] = useState(null);
  const [revealed, setRevealed] = useState(new Set());
  const [showReport, setShowReport] = useState(false);
  const [mode, setMode] = useState("profile"); // profile | report

  const reveal = (key) => {
    setRevealed((prev) => new Set([...prev, key]));
    setActiveVuln(key);
  };

  const totalScore = [...revealed].reduce((acc, k) => {
    const s = vulnerabilities[k]?.severity;
    return acc + (s === "critical" ? 40 : s === "high" ? 25 : s === "medium" ? 15 : 5);
  }, 0);

  const riskLevel = totalScore >= 80 ? "CRITICAL" : totalScore >= 50 ? "HIGH" : totalScore >= 25 ? "MEDIUM" : "LOW";
  const riskColor = totalScore >= 80 ? "#ef4444" : totalScore >= 50 ? "#f97316" : totalScore >= 25 ? "#fbbf24" : "#4ade80";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(239,68,68,0.3)",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(239,68,68,0.03)",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ color: "#ef4444", fontSize: "11px", letterSpacing: "3px", fontWeight: "bold" }}>
            ◈ OSINT TERMINAL v2.1
          </div>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
          <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "2px" }}>LIVE SESSION</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["profile", "report"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "4px 12px", fontSize: "10px", letterSpacing: "2px",
              background: mode === m ? "rgba(239,68,68,0.15)" : "transparent",
              border: `1px solid ${mode === m ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              color: mode === m ? "#ef4444" : "#64748b",
              cursor: "pointer", textTransform: "uppercase",
            }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .vuln-tag:hover { filter: brightness(1.2); transform: translateY(-1px); }
        .vuln-tag { transition: all 0.15s ease; cursor: pointer; }
      `}</style>

      {mode === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", minHeight: "calc(100vh - 57px)" }}>

          {/* LEFT — LinkedIn-style profile */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px", overflowY: "auto" }}>
            <div style={{ fontSize: "10px", color: "#475569", letterSpacing: "3px", marginBottom: "16px" }}>
              TARGET PROFILE // LINKEDIN PUBLIC VIEW
            </div>

            {/* Profile card */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px", overflow: "hidden", marginBottom: "16px",
              animation: "fadeIn 0.4s ease",
            }}>
              {/* Cover */}
              <div style={{ height: "80px", background: "linear-gradient(135deg, #1e3a5f, #0f2040)", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)" }} />
              </div>

              <div style={{ padding: "0 20px 20px", position: "relative" }}>
                {/* Avatar */}
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  border: "3px solid #0a0a0f",
                  background: "#1e293b",
                  marginTop: "-36px", marginBottom: "8px",
                  overflow: "hidden", position: "relative",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(135deg, #334155, #1e293b)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px",
                  }}>👤</div>
                </div>

                <VulnTag id="name" vuln={vulnerabilities.name} active={activeVuln === "name"} revealed={revealed.has("name")} onReveal={reveal}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f1f5f9", fontFamily: "Georgia, serif" }}>
                    {target.name}
                  </div>
                </VulnTag>

                <VulnTag id="company" vuln={vulnerabilities.company} active={activeVuln === "company"} revealed={revealed.has("company")} onReveal={reveal}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                    {target.title} · {target.company}
                  </div>
                </VulnTag>

                <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>
                  📍 {target.location} · {target.connections}
                </div>

                <VulnTag id="email_hint" vuln={vulnerabilities.email_hint} active={activeVuln === "email_hint"} revealed={revealed.has("email_hint")} onReveal={reveal}>
                  <div style={{ fontSize: "11px", color: "#3b82f6", marginTop: "6px" }}>
                    🔗 Contact info visible
                  </div>
                </VulnTag>
              </div>
            </div>

            {/* About */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px", padding: "16px", marginBottom: "12px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "10px" }}>ABOUT</div>
              <VulnTag id="birthday" vuln={vulnerabilities.birthday} active={activeVuln === "birthday"} revealed={revealed.has("birthday")} onReveal={reveal}>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>{target.about}</div>
              </VulnTag>
            </div>

            {/* Skills */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px", padding: "16px", marginBottom: "12px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "10px" }}>SKILLS</div>
              <VulnTag id="skills" vuln={vulnerabilities.skills} active={activeVuln === "skills"} revealed={revealed.has("skills")} onReveal={reveal}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {target.skills.map((s) => (
                    <span key={s} style={{
                      padding: "3px 10px", fontSize: "11px",
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: "20px", color: "#93c5fd",
                    }}>{s}</span>
                  ))}
                </div>
              </VulnTag>
            </div>

            {/* Posts */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px", padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "10px" }}>RECENT ACTIVITY</div>
              {[
                { id: "cisco_post", post: target.posts[0] },
                { id: "offsite_post", post: target.posts[1] },
                { id: "cert_post", post: target.posts[2] },
              ].map(({ id, post }) => (
                <VulnTag key={id} id={id} vuln={vulnerabilities[id]} active={activeVuln === id} revealed={revealed.has(id)} onReveal={reveal}>
                  <div style={{
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    marginBottom: "8px",
                  }}>
                    <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5" }}>{post.text}</div>
                    <div style={{ fontSize: "10px", color: "#475569", marginTop: "6px" }}>
                      👍 {post.likes} · {post.date}
                    </div>
                  </div>
                </VulnTag>
              ))}
            </div>
          </div>

          {/* RIGHT — Analysis panel */}
          <div style={{ padding: "24px", overflowY: "auto" }}>
            <div style={{ fontSize: "10px", color: "#475569", letterSpacing: "3px", marginBottom: "16px" }}>
              THREAT ANALYSIS // CLICK ANY HIGHLIGHTED ELEMENT
            </div>

            {/* Risk meter */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${riskColor}40`,
              borderRadius: "8px", padding: "16px", marginBottom: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px" }}>EXPOSURE SCORE</div>
                <div style={{ fontSize: "11px", color: riskColor, letterSpacing: "2px", fontWeight: "bold" }}>
                  {riskLevel}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "4px",
                  width: `${Math.min(totalScore, 100)}%`,
                  background: `linear-gradient(90deg, #4ade80, ${riskColor})`,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ fontSize: "10px", color: "#475569", marginTop: "6px" }}>
                {revealed.size}/{Object.keys(vulnerabilities).length} vulnerabilities revealed · Score: {totalScore}
              </div>
            </div>

            {/* Active vuln detail */}
            {activeVuln ? (
              <div style={{
                background: severityConfig[vulnerabilities[activeVuln].severity].bg,
                border: `1px solid ${severityConfig[vulnerabilities[activeVuln].severity].border}`,
                borderRadius: "8px", padding: "16px", marginBottom: "16px",
                animation: "fadeIn 0.25s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "4px" }}>
                      {vulnerabilities[activeVuln].icon} VULNERABILITY DETECTED
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: severityConfig[vulnerabilities[activeVuln].severity].color }}>
                      {vulnerabilities[activeVuln].label}
                    </div>
                  </div>
                  <span style={{
                    padding: "2px 8px", fontSize: "10px", letterSpacing: "2px",
                    background: severityConfig[vulnerabilities[activeVuln].severity].bg,
                    border: `1px solid ${severityConfig[vulnerabilities[activeVuln].severity].border}`,
                    color: severityConfig[vulnerabilities[activeVuln].severity].color,
                    borderRadius: "4px",
                  }}>
                    {severityConfig[vulnerabilities[activeVuln].severity].label}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "6px" }}>
                  ⚡ ATTACK VECTOR: {vulnerabilities[activeVuln].attack}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.7" }}>
                  {vulnerabilities[activeVuln].detail}
                </div>
              </div>
            ) : (
              <div style={{
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: "8px", padding: "24px",
                textAlign: "center", marginBottom: "16px",
                color: "#334155",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>⬅</div>
                <div style={{ fontSize: "11px", letterSpacing: "2px" }}>
                  CLICK ANY HIGHLIGHTED<br />ELEMENT ON THE PROFILE
                </div>
              </div>
            )}

            {/* Attack chain */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px", padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px", marginBottom: "12px" }}>
                FINDINGS LOG
              </div>
              {attackOrder.map((key, i) => {
                const v = vulnerabilities[key];
                const isRevealed = revealed.has(key);
                const sc = severityConfig[v.severity];
                return (
                  <div key={key}
                    onClick={() => isRevealed && setActiveVuln(key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px", borderRadius: "4px", marginBottom: "4px",
                      cursor: isRevealed ? "pointer" : "default",
                      background: activeVuln === key ? "rgba(255,255,255,0.04)" : "transparent",
                      opacity: isRevealed ? 1 : 0.25,
                      transition: "all 0.2s",
                      animation: isRevealed ? `scanIn 0.3s ease ${i * 0.05}s both` : "none",
                    }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isRevealed ? sc.color : "#1e293b", flexShrink: 0 }} />
                    <div style={{ fontSize: "10px", color: isRevealed ? sc.color : "#334155", letterSpacing: "1px", flex: 1 }}>
                      {v.icon} {v.label}
                    </div>
                    {isRevealed && (
                      <span style={{
                        padding: "1px 6px", fontSize: "9px", letterSpacing: "1px",
                        border: `1px solid ${sc.border}`, color: sc.color, borderRadius: "3px",
                      }}>{sc.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {mode === "report" && (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
          <div style={{ fontSize: "10px", color: "#475569", letterSpacing: "3px", marginBottom: "20px" }}>
            OSINT INTELLIGENCE REPORT // JAMES R. HOLLOWAY
          </div>

          <div style={{
            background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px", padding: "20px", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "11px", color: "#ef4444", letterSpacing: "3px", marginBottom: "8px" }}>EXECUTIVE SUMMARY</div>
            <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.8" }}>
              Target <strong style={{ color: "#f1f5f9" }}>James R. Holloway</strong>, Junior IT Support Specialist at <strong style={{ color: "#f1f5f9" }}>MediCore Solutions</strong>, has exposed a significant attack surface through routine LinkedIn activity. A threat actor with no prior knowledge of MediCore could reconstruct his email address, identify the company's internal tech stack, predict his physical absence, and craft a highly convincing spear phishing campaign — all from public posts made in the last two weeks.
            </div>
          </div>

          {attackOrder.map((key) => {
            const v = vulnerabilities[key];
            const sc = severityConfig[v.severity];
            return (
              <div key={key} style={{
                background: sc.bg, border: `1px solid ${sc.border}`,
                borderRadius: "8px", padding: "16px", marginBottom: "10px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", color: sc.color, fontWeight: "bold" }}>
                    {v.icon} {v.label}
                  </div>
                  <span style={{
                    padding: "1px 8px", fontSize: "9px", letterSpacing: "2px",
                    border: `1px solid ${sc.border}`, color: sc.color, borderRadius: "3px",
                  }}>{sc.label} · {v.attack}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>{v.detail}</div>
              </div>
            );
          })}

          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px", padding: "20px", marginTop: "8px",
          }}>
            <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "3px", marginBottom: "12px" }}>RECOMMENDED MITIGATIONS</div>
            {[
              "Set LinkedIn profile to private or 'connections only' for non-essential fields",
              "Never disclose internal infrastructure tools, vendors, or hardware in public posts",
              "Avoid announcing travel or absence schedules on public platforms",
              "Remove or obfuscate job title granularity — 'IT Team' instead of 'IT Support Specialist'",
              "Disable contact info visibility to non-connections",
              "Audit all posts for operational security (OPSEC) before publishing",
            ].map((rec, i) => (
              <div key={i} style={{
                display: "flex", gap: "10px", alignItems: "flex-start",
                marginBottom: "8px", fontSize: "12px", color: "#94a3b8", lineHeight: "1.5",
              }}>
                <span style={{ color: "#4ade80", flexShrink: 0 }}>▸</span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VulnTag({ id, vuln, active, revealed, onReveal, children }) {
  const sc = severityConfig[vuln.severity];
  return (
    <div className="vuln-tag"
      onClick={() => onReveal(id)}
      style={{
        display: "inline-block", width: "100%",
        outline: active ? `1px solid ${sc.color}` : revealed ? `1px solid ${sc.border}` : "1px dashed rgba(255,255,255,0.08)",
        outlineOffset: "3px", borderRadius: "4px",
        background: active ? sc.bg : "transparent",
        padding: "4px",
        position: "relative",
      }}>
      {children}
      <span style={{
        position: "absolute", top: "-8px", right: "4px",
        fontSize: "9px", letterSpacing: "1px", padding: "1px 5px",
        background: "#0a0a0f", border: `1px solid ${sc.border}`,
        color: sc.color, borderRadius: "3px",
        opacity: revealed ? 1 : 0.5,
      }}>
        {revealed ? sc.label : "?"}
      </span>
    </div>
  );
}
