import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch(`${API}/api/deals`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load deals");
        }

        return res.json();
      })
      .then((data) => {
        setDeals(data.deals);
        setSelectedDeal(data.deals[0]);
      })
      .catch(() => {
        setError("Backend is not running. Start the DealMind API.");
      });
  }, []);

  const prepareMeeting = async () => {
    if (!selectedDeal) return;

    setLoading(true);
    setBrief(null);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/deals/${selectedDeal.id}/prepare`
      );

      if (!response.ok) {
        throw new Error("Failed to prepare meeting");
      }

      const data = await response.json();

      setBrief(data);
    } catch (err) {
      setError("Could not generate meeting brief.");
    } finally {
      setLoading(false);
    }
  };

  const selectPage = (page) => {
    setActivePage(page);

    if (page !== "dashboard") {
      setBrief(null);
    }
  };

  return (
    <div style={styles.app}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <div style={styles.logo}>

          <div style={styles.logoMark}>
            D
          </div>

          <div>
            <div style={styles.logoText}>
              DealMind
            </div>

            <div style={styles.logoSub}>
              AI SALES INTELLIGENCE
            </div>
          </div>

        </div>


        <nav style={styles.nav}>

          {/* DASHBOARD */}

          <div
            onClick={() => selectPage("dashboard")}
            style={{
              ...styles.navItem,
              ...(activePage === "dashboard"
                ? styles.navActive
                : {}),
            }}
          >
            <span>▦</span>
            Dashboard
          </div>


          {/* DEALS */}

          <div
            onClick={() => selectPage("deals")}
            style={{
              ...styles.navItem,
              ...(activePage === "deals"
                ? styles.navActive
                : {}),
            }}
          >
            <span>◈</span>
            Deals
          </div>


          {/* MEMORY */}

          <div
            onClick={() => selectPage("memory")}
            style={{
              ...styles.navItem,
              ...(activePage === "memory"
                ? styles.navActive
                : {}),
            }}
          >
            <span>◉</span>
            Memory
          </div>


          {/* AI BRIEFS */}

          <div
            onClick={() => selectPage("briefs")}
            style={{
              ...styles.navItem,
              ...(activePage === "briefs"
                ? styles.navActive
                : {}),
            }}
          >
            <span>✦</span>
            AI Briefs
          </div>

        </nav>


        {/* MEMORY STATUS */}

        <div style={styles.memoryBox}>

          <div style={styles.memoryIcon}>
            ✦
          </div>

          <div>

            <div style={styles.memoryTitle}>
              Hindsight Memory
            </div>

            <div style={styles.memoryStatus}>
              <span style={styles.greenDot}></span>
              Connected
            </div>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main style={styles.main}>

        {/* HEADER */}

        <header style={styles.header}>

          <div>

            <div style={styles.eyebrow}>
              SALES COMMAND CENTER
            </div>

            <h1 style={styles.title}>
              Good evening, Sales Team
            </h1>

            <p style={styles.subtitle}>
              Your deals, enriched with memory and intelligence.
            </p>

          </div>


          <div style={styles.headerRight}>

            <div style={styles.liveBadge}>
              <span style={styles.greenDot}></span>
              Hindsight Live
            </div>

            <div style={styles.avatar}>
              S
            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* DASHBOARD */}

        {activePage === "dashboard" && (

          <>

            {/* STATS */}

            <section style={styles.stats}>

              <div style={styles.statCard}>

                <div style={styles.statLabel}>
                  ACTIVE DEALS
                </div>

                <div style={styles.statValue}>
                  {deals.length}
                </div>

                <div style={styles.statHint}>
                  Across your pipeline
                </div>

              </div>


              <div style={styles.statCard}>

                <div style={styles.statLabel}>
                  PIPELINE VALUE
                </div>

                <div style={styles.statValue}>
                  $
                  {deals
                    .reduce(
                      (sum, deal) =>
                        sum + deal.deal_value,
                      0
                    )
                    .toLocaleString()}
                </div>

                <div style={styles.statHint}>
                  Total opportunity
                </div>

              </div>


              <div style={styles.statCard}>

                <div style={styles.statLabel}>
                  AT RISK
                </div>

                <div
                  style={{
                    ...styles.statValue,
                    color: "#A4262C",
                  }}
                >
                  {
                    deals.filter(
                      (deal) =>
                        deal.health === "At Risk"
                    ).length
                  }
                </div>

                <div style={styles.statHint}>
                  Needs attention
                </div>

              </div>


              <div style={styles.statCard}>

                <div style={styles.statLabel}>
                  MEMORY STATUS
                </div>

                <div
                  style={{
                    ...styles.statValue,
                    color: "#107C10",
                  }}
                >
                  ●
                </div>

                <div style={styles.statHint}>
                  Hindsight connected
                </div>

              </div>

            </section>


            {/* CONTENT */}

            <section style={styles.contentGrid}>

              {/* DEAL LIST */}

              <div>

                <div style={styles.sectionHeader}>

                  <div>

                    <div style={styles.sectionEyebrow}>
                      YOUR PIPELINE
                    </div>

                    <h2 style={styles.sectionTitle}>
                      Active Deals
                    </h2>

                  </div>

                  <div style={styles.countBadge}>
                    {deals.length} deals
                  </div>

                </div>


                <div style={styles.dealList}>

                  {deals.map((deal) => (

                    <div
                      key={deal.id}
                      onClick={() => {
                        setSelectedDeal(deal);
                        setBrief(null);
                      }}
                      style={{
                        ...styles.dealCard,

                        ...(selectedDeal?.id === deal.id
                          ? styles.dealSelected
                          : {}),
                      }}
                    >

                      <div style={styles.dealTop}>

                        <div>

                          <h3 style={styles.company}>
                            {deal.company}
                          </h3>

                          <div style={styles.industry}>
                            {deal.industry}
                          </div>

                        </div>


                        <span
                          style={{
                            ...styles.health,

                            ...(deal.health === "At Risk"
                              ? styles.risk
                              : styles.healthy),
                          }}
                        >
                          {deal.health}
                        </span>

                      </div>


                      <div style={styles.dealInfo}>

                        <div>

                          <span style={styles.infoLabel}>
                            VALUE
                          </span>

                          <strong style={styles.infoValue}>
                            $
                            {deal.deal_value.toLocaleString()}
                          </strong>

                        </div>


                        <div>

                          <span style={styles.infoLabel}>
                            STAGE
                          </span>

                          <strong style={styles.infoValue}>
                            {deal.stage}
                          </strong>

                        </div>


                        <div>

                          <span style={styles.infoLabel}>
                            DECISION MAKER
                          </span>

                          <strong style={styles.infoValue}>
                            {deal.decision_maker}
                          </strong>

                        </div>

                      </div>


                      <div style={styles.dealBottom}>

                        <span>
                          Next meeting:{" "}
                          <strong>
                            {deal.next_meeting}
                          </strong>
                        </span>

                        <span>
                          →
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* DEAL INTELLIGENCE */}

              <div>

                {selectedDeal && (

                  <div style={styles.intelligencePanel}>

                    <div style={styles.panelHeader}>

                      <div>

                        <div style={styles.sectionEyebrow}>
                          DEAL INTELLIGENCE
                        </div>

                        <h2 style={styles.panelTitle}>
                          {selectedDeal.company}
                        </h2>

                      </div>


                      <div style={styles.aiBadge}>
                        ✦ AI POWERED
                      </div>

                    </div>


                    <div style={styles.contextBox}>

                      <div style={styles.contextTitle}>
                        ◉ Last Known Context
                      </div>

                      <p style={styles.contextText}>
                        {selectedDeal.last_interaction}
                      </p>


                      <div style={styles.contextGrid}>

                        <div style={styles.contextItem}>

                          <span style={styles.contextLabel}>
                            Decision Maker
                          </span>

                          <strong style={styles.contextValue}>
                            {selectedDeal.decision_maker}
                          </strong>

                        </div>


                        <div style={styles.contextItem}>

                          <span style={styles.contextLabel}>
                            Competitor
                          </span>

                          <strong style={styles.contextValue}>
                            {selectedDeal.competitor}
                          </strong>

                        </div>

                      </div>

                    </div>


                    <button
                      onClick={prepareMeeting}
                      disabled={loading}
                      style={{
                        ...styles.prepareButton,

                        ...(loading
                          ? styles.prepareButtonDisabled
                          : {}),
                      }}
                    >

                      <span>
                        ✦
                      </span>

                      {loading
                        ? "Thinking with Hindsight..."
                        : "Prepare My Next Meeting"}

                    </button>


                    {brief && (

                      <div style={styles.brief}>

                        <div style={styles.briefHeader}>

                          <div>

                            <div style={styles.sectionEyebrow}>
                              HINDSIGHT REFLECTION
                            </div>

                            <h3 style={styles.briefTitle}>
                              AI Meeting Brief
                            </h3>

                          </div>


                          <div style={styles.memoryCount}>
                            Memory active
                          </div>

                        </div>


                        <div style={styles.briefText}>

                          {brief.meeting_brief
                            .replaceAll("**", "")
                            .replaceAll("###", "")
                            .split("\n")
                            .map((line, index) => {

                              const text =
                                line.trim();

                              if (!text) {
                                return null;
                              }

                              const cleanText =
                                text.replace(
                                  /^\*\s*/,
                                  ""
                                );


                              const isHeading =
                                cleanText.endsWith(":") ||
                                cleanText.startsWith(
                                  "Current Deal"
                                ) ||
                                cleanText.startsWith(
                                  "Key Decision"
                                ) ||
                                cleanText.startsWith(
                                  "Main Customer"
                                ) ||
                                cleanText.startsWith(
                                  "Competitors"
                                ) ||
                                cleanText.startsWith(
                                  "What the Customer"
                                ) ||
                                cleanText.startsWith(
                                  "Pricing"
                                ) ||
                                cleanText.startsWith(
                                  "Focus for"
                                ) ||
                                cleanText.startsWith(
                                  "Recommended"
                                );


                              if (isHeading) {

                                return (
                                  <div
                                    key={index}
                                    style={
                                      styles.briefHeading
                                    }
                                  >
                                    {cleanText}
                                  </div>
                                );

                              }


                              return (
                                <div
                                  key={index}
                                  style={
                                    styles.briefLine
                                  }
                                >
                                  {cleanText}
                                </div>
                              );

                            })}

                        </div>


                        <div style={styles.memoryEvidence}>

                          <span>
                            ✦
                          </span>{" "}

                          Generated by reasoning over
                          DealMind's Hindsight memory

                        </div>

                      </div>

                    )}


                    {!brief && !loading && (

                      <div style={styles.emptyBrief}>

                        <div style={styles.emptyIcon}>
                          ✦
                        </div>

                        <h3 style={styles.emptyTitle}>
                          Ready to reason over deal history
                        </h3>

                        <p style={styles.emptyText}>
                          DealMind will use remembered
                          customer interactions to prepare
                          a context-aware meeting strategy.
                        </p>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </section>

          </>

        )}


        {/* DEALS PAGE */}

        {activePage === "deals" && (

          <section style={styles.pageCard}>

            <div style={styles.sectionEyebrow}>
              SALES PIPELINE
            </div>

            <h2 style={styles.pageTitle}>
              All Deals
            </h2>

            <p style={styles.pageDescription}>
              Select a deal to view its intelligence,
              customer context, and Hindsight-powered
              meeting preparation.
            </p>


            <div style={styles.fullDealGrid}>

              {deals.map((deal) => (

                <div
                  key={deal.id}
                  onClick={() => {
                    setSelectedDeal(deal);
                    setActivePage("dashboard");
                    setBrief(null);
                  }}
                  style={styles.fullDealCard}
                >

                  <div style={styles.dealTop}>

                    <div>

                      <h3 style={styles.company}>
                        {deal.company}
                      </h3>

                      <div style={styles.industry}>
                        {deal.industry}
                      </div>

                    </div>


                    <span
                      style={{
                        ...styles.health,

                        ...(deal.health === "At Risk"
                          ? styles.risk
                          : styles.healthy),
                      }}
                    >
                      {deal.health}
                    </span>

                  </div>


                  <div style={styles.fullDealValue}>
                    ${deal.deal_value.toLocaleString()}
                  </div>

                  <div style={styles.fullDealStage}>
                    {deal.stage}
                  </div>

                  <div style={styles.fullDealMaker}>
                    Decision maker:{" "}
                    <strong>
                      {deal.decision_maker}
                    </strong>
                  </div>

                  <div style={styles.dealBottom}>
                    <span>
                      Next meeting:{" "}
                      <strong>
                        {deal.next_meeting}
                      </strong>
                    </span>

                    <span>
                      View →
                    </span>
                  </div>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* MEMORY PAGE */}

        {activePage === "memory" && (

          <section style={styles.pageCard}>

            <div style={styles.sectionEyebrow}>
              HINDSIGHT MEMORY
            </div>

            <h2 style={styles.pageTitle}>
              Deal Memory
            </h2>

            <p style={styles.pageDescription}>
              DealMind uses Hindsight to retain customer
              interactions and retrieve relevant context
              when preparing for future sales conversations.
            </p>


            <div style={styles.memoryPageCard}>

              <div style={styles.largeMemoryIcon}>
                ✦
              </div>

              <h3 style={styles.memoryPageTitle}>
                Memory is active
              </h3>

              <p style={styles.memoryPageText}>
                Customer interactions are retained in
                DealMind's Hindsight memory bank and can
                be recalled when preparing future meetings.
              </p>

              <div style={styles.memoryFlow}>

                <span>Interaction</span>

                <strong>→</strong>

                <span>Retain</span>

                <strong>→</strong>

                <span>Recall</span>

                <strong>→</strong>

                <span>Reflect</span>

              </div>

            </div>

          </section>

        )}


        {/* AI BRIEFS PAGE */}

        {activePage === "briefs" && (

          <section style={styles.pageCard}>

            <div style={styles.sectionEyebrow}>
              AI SALES INTELLIGENCE
            </div>

            <h2 style={styles.pageTitle}>
              AI Meeting Briefs
            </h2>

            <p style={styles.pageDescription}>
              Generate context-aware preparation for
              upcoming customer meetings using the
              remembered history of each deal.
            </p>


            <div style={styles.briefPageCard}>

              <div style={styles.largeBriefIcon}>
                ✦
              </div>

              <h3 style={styles.briefPageTitle}>
                Prepare your next meeting
              </h3>

              <p style={styles.briefPageText}>
                Choose a deal from the Deals section and
                DealMind will use Hindsight to reason over
                its history and generate a focused meeting
                strategy.
              </p>


              <button
                onClick={() => {
                  setActivePage("dashboard");
                  setBrief(null);
                }}
                style={styles.prepareButton}
              >
                View Deals & Prepare
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


/* =========================================================
   STYLES
   Microsoft / Fluent-inspired enterprise theme
   ========================================================= */

const styles = {

  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#F5F5F5",
    color: "#242424",
   fontFamily:
  '"Segoe UI", SegoeUI, Arial, sans-serif',
  },


  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#FFFFFF",
    borderRight: "1px solid #E1E1E1",
    padding: "28px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },


  logo: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "4px 10px 34px",
  },


  logoMark: {
    width: "38px",
    height: "38px",
    borderRadius: "4px",
    background: "#0078D4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: "20px",
  },


  logoText: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#242424",
  },


  logoSub: {
    fontSize: "8px",
    color: "#797775",
    letterSpacing: "1.3px",
    marginTop: "3px",
  },


  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },


  navItem: {
    padding: "11px 13px",
    borderRadius: "4px",
    color: "#605E5C",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    cursor: "pointer",
  },


  navActive: {
    background: "#E8F3FC",
    color: "#0078D4",
    fontWeight: "600",
    borderLeft: "3px solid #0078D4",
  },


  memoryBox: {
    marginTop: "auto",
    padding: "14px",
    borderRadius: "6px",
    background: "#F8F8F8",
    border: "1px solid #E1E1E1",
    display: "flex",
    gap: "11px",
    alignItems: "center",
  },


  memoryIcon: {
    color: "#0078D4",
    fontSize: "19px",
  },


  memoryTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#323130",
  },


  memoryStatus: {
    marginTop: "5px",
    fontSize: "11px",
    color: "#605E5C",
  },


  greenDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    background: "#107C10",
    borderRadius: "50%",
    marginRight: "6px",
  },


  main: {
    flex: 1,
    padding: "38px 48px",
    maxWidth: "1500px",
    boxSizing: "border-box",
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },


  eyebrow: {
    fontSize: "10px",
    letterSpacing: "1.6px",
    color: "#605E5C",
    fontWeight: "600",
    marginBottom: "8px",
  },


  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "600",
    letterSpacing: "-0.5px",
    color: "#242424",
  },


  subtitle: {
    color: "#605E5C",
    marginTop: "7px",
    fontSize: "14px",
  },


  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },


  liveBadge: {
    padding: "7px 11px",
    borderRadius: "4px",
    background: "#F3F9F1",
    border: "1px solid #D7EAD2",
    color: "#107C10",
    fontSize: "11px",
    fontWeight: "600",
  },


  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#0078D4",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },


  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "34px",
  },


  statCard: {
    background: "#FFFFFF",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    padding: "19px",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.04)",
  },


  statLabel: {
    color: "#605E5C",
    fontSize: "9px",
    letterSpacing: "1.2px",
    fontWeight: "600",
  },


  statValue: {
    fontSize: "25px",
    fontWeight: "600",
    marginTop: "9px",
    color: "#242424",
  },


  statHint: {
    color: "#797775",
    fontSize: "11px",
    marginTop: "5px",
  },


  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "0.9fr 1.1fr",
    gap: "22px",
  },


  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    marginBottom: "14px",
  },


  sectionEyebrow: {
    color: "#605E5C",
    fontSize: "9px",
    letterSpacing: "1.5px",
    fontWeight: "600",
  },


  sectionTitle: {
    margin: "5px 0 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#242424",
  },


  countBadge: {
    color: "#605E5C",
    fontSize: "11px",
    background: "#FFFFFF",
    border: "1px solid #E1E1E1",
    padding: "6px 9px",
    borderRadius: "4px",
  },


  dealList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },


  dealCard: {
    background: "#FFFFFF",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    padding: "17px",
    cursor: "pointer",
    transition: "all .15s",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03)",
  },


  dealSelected: {
    border: "1px solid #0078D4",
    background: "#FFFFFF",
    boxShadow:
      "0 0 0 1px #0078D4",
  },


  dealTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
  },


  company: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#242424",
  },


  industry: {
    color: "#797775",
    fontSize: "11px",
    marginTop: "4px",
  },


  health: {
    fontSize: "9px",
    fontWeight: "600",
    padding: "5px 8px",
    borderRadius: "3px",
  },


  risk: {
    color: "#A4262C",
    background: "#FDE7E9",
  },


  healthy: {
    color: "#107C10",
    background: "#DFF6DD",
  },


  dealInfo: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr 1.3fr",
    gap: "12px",
    marginTop: "18px",
  },


  infoLabel: {
    display: "block",
    color: "#797775",
    fontSize: "8px",
    letterSpacing: "1px",
    marginBottom: "4px",
  },


  infoValue: {
    color: "#242424",
    fontSize: "13px",
    fontWeight: "600",
  },


  dealBottom: {
    display: "flex",
    justifyContent: "space-between",
    borderTop:
      "1px solid #EDEBE9",
    marginTop: "15px",
    paddingTop: "12px",
    color: "#605E5C",
    fontSize: "10px",
  },


  intelligencePanel: {
    background: "#FFFFFF",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    padding: "23px",
    minHeight: "530px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.04)",
  },


  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "20px",
  },


  panelTitle: {
    fontSize: "24px",
    margin: "6px 0 0",
    fontWeight: "600",
    color: "#242424",
  },


  aiBadge: {
    fontSize: "9px",
    color: "#0078D4",
    border:
      "1px solid #BDE0F7",
    background: "#F3F9FD",
    borderRadius: "3px",
    padding: "6px 8px",
    fontWeight: "600",
  },


  contextBox: {
    background: "#F8F8F8",
    border:
      "1px solid #E1E1E1",
    borderRadius: "5px",
    padding: "16px",
  },


  contextTitle: {
    color: "#323130",
    fontSize: "11px",
    fontWeight: "600",
  },


  contextText: {
    color: "#323130",
    fontSize: "14px",
    lineHeight: "1.55",
    margin: "12px 0 0",
  },


  contextGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
    marginTop: "14px",
    paddingTop: "13px",
    borderTop:
      "1px solid #E1E1E1",
  },


  contextItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },


  contextLabel: {
    color: "#797775",
    fontSize: "10px",
  },


  contextValue: {
    color: "#242424",
    fontSize: "13px",
    fontWeight: "600",
  },


  prepareButton: {
    width: "100%",
    marginTop: "16px",
    border: "0",
    borderRadius: "4px",
    padding: "13px",
    background: "#0078D4",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.12)",
  },


  prepareButtonDisabled: {
    background: "#8A8886",
    cursor: "wait",
  },


  brief: {
    marginTop: "18px",
    background: "#F8F8F8",
    border:
      "1px solid #E1E1E1",
    borderRadius: "5px",
    padding: "17px",
  },


  briefHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    borderBottom:
      "1px solid #E1E1E1",
    paddingBottom: "13px",
  },


  briefTitle: {
    margin: "5px 0 0",
    fontSize: "17px",
    fontWeight: "600",
    color: "#242424",
  },


  memoryCount: {
    fontSize: "9px",
    color: "#107C10",
    background: "#DFF6DD",
    padding: "6px 8px",
    borderRadius: "3px",
    fontWeight: "600",
  },


  briefText: {
    color: "#323130",
    fontSize: "12px",
    lineHeight: "1.65",
    marginTop: "15px",
    textAlign: "left",
  },


  briefHeading: {
    color: "#242424",
    fontSize: "11px",
    fontWeight: "700",
    marginTop: "13px",
    marginBottom: "4px",
  },


  briefLine: {
    color: "#605E5C",
    fontSize: "12px",
    lineHeight: "1.65",
    marginBottom: "6px",
  },


  memoryEvidence: {
    marginTop: "14px",
    paddingTop: "12px",
    borderTop:
      "1px solid #E1E1E1",
    color: "#797775",
    fontSize: "10px",
  },


  emptyBrief: {
    textAlign: "center",
    padding: "55px 30px",
    color: "#797775",
  },


  emptyIcon: {
    fontSize: "32px",
    color: "#0078D4",
    marginBottom: "10px",
  },


  emptyTitle: {
    color: "#323130",
    fontSize: "17px",
    fontWeight: "600",
  },


  emptyText: {
    color: "#797775",
    fontSize: "13px",
    lineHeight: "1.6",
  },


  error: {
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "5px",
    background: "#FDE7E9",
    border:
      "1px solid #F1B8BC",
    color: "#A4262C",
    fontSize: "12px",
  },


  /* OTHER PAGES */

  pageCard: {
    background: "#FFFFFF",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    padding: "28px",
    minHeight: "520px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.04)",
  },


  pageTitle: {
    fontSize: "27px",
    fontWeight: "600",
    margin: "7px 0 8px",
    color: "#242424",
  },


  pageDescription: {
    color: "#605E5C",
    fontSize: "13px",
    lineHeight: "1.6",
    maxWidth: "700px",
    marginBottom: "28px",
  },


  fullDealGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "16px",
  },


  fullDealCard: {
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    padding: "18px",
    cursor: "pointer",
    background: "#FFFFFF",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03)",
  },


  fullDealValue: {
    marginTop: "20px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#0078D4",
  },


  fullDealStage: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#605E5C",
  },


  fullDealMaker: {
    marginTop: "14px",
    paddingBottom: "14px",
    fontSize: "11px",
    color: "#605E5C",
  },


  memoryPageCard: {
    maxWidth: "700px",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    background: "#F8F8F8",
    padding: "40px",
    textAlign: "center",
  },


  largeMemoryIcon: {
    fontSize: "42px",
    color: "#0078D4",
  },


  memoryPageTitle: {
    fontSize: "21px",
    color: "#242424",
    marginTop: "12px",
  },


  memoryPageText: {
    color: "#605E5C",
    fontSize: "13px",
    lineHeight: "1.7",
    maxWidth: "570px",
    margin:
      "0 auto 28px",
  },


  memoryFlow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    color: "#0078D4",
    fontSize: "12px",
    fontWeight: "600",
  },


  briefPageCard: {
    maxWidth: "700px",
    border: "1px solid #E1E1E1",
    borderRadius: "6px",
    background: "#F8F8F8",
    padding: "40px",
    textAlign: "center",
  },


  largeBriefIcon: {
    fontSize: "42px",
    color: "#0078D4",
  },


  briefPageTitle: {
    fontSize: "21px",
    color: "#242424",
    marginTop: "12px",
  },


  briefPageText: {
    color: "#605E5C",
    fontSize: "13px",
    lineHeight: "1.7",
    maxWidth: "570px",
    margin:
      "0 auto 25px",
  },

};


export default App;