import {
  Activity,
  AlertTriangle,
  Moon,
  Sun,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  LayoutDashboard,
  Menu,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";


/* ============================================================
   CONFIGURATION
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


/*
  IMPORTANT:
  Your frontend .env should contain:

  VITE_LANFUSE_PROJECT_URL=https://cloud.langfuse.com/...

  Restart Vite after changing .env.
*/
const LANGFUSE_PROJECT_URL =
  import.meta.env.VITE_LANFUSE_PROJECT_URL || "";
  console.log("LANGFUSE URL:", import.meta.env.VITE_LANFUSE_PROJECT_URL);


const API_DOCS_URL =
  `${API_BASE_URL}/docs`;


const USER_GUIDE_URL =
  `${window.location.origin}/?page=user-guide`;


const PAGE_SIZE = 7;


/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Investigations",
    icon: Search,
  },
];


const resources = [
  {
    label: "User Guide",
    icon: BookOpen,
  },
  {
    label: "Workflow",
    icon: Activity,
  },
];


/* ============================================================
   MAIN APP
   ============================================================ */

function App() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);
  
  
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("csai-theme") === "dark"
  );

  useEffect(() => {
  localStorage.setItem(
      "csai-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);


  const [activePage, setActivePage] =
    useState("Dashboard");

  const [apiStatus, setApiStatus] =
    useState("Checking");


  const queryPage =
    new URLSearchParams(
      window.location.search
    ).get("page");


  /* ==========================================================
     HEALTH CHECK
     ========================================================== */

  useEffect(() => {
    let mounted = true;


    async function checkHealth() {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/health`
          );


        if (!mounted) {
          return;
        }


        setApiStatus(
          response.ok
            ? "Online"
            : "Offline"
        );

      } catch {
        if (mounted) {
          setApiStatus(
            "Offline"
          );
        }
      }
    }


    checkHealth();


    return () => {
      mounted = false;
    };

  }, []);


  /* ==========================================================
     USER GUIDE PAGE
     ========================================================== */

  if (
    queryPage ===
    "user-guide"
  ) {
    return (
      <UserGuidePage />
    );
  }


  function handleNavigation(label) {
    if (label === "User Guide") {
      window.open(USER_GUIDE_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (label === "Investigations") {
      setActivePage("Dashboard");
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("scroll-to-manual-investigation"));
      }, 50);
      return;
    }

    if (label === "Workflow") {
      setActivePage("Dashboard");
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("scroll-to-workflow-analytics"));
      }, 50);
      return;
    }

    setActivePage(label);
  }


  return (
    <div
      className={`app-shell ${
        darkMode ? "theme-dark" : "theme-light"
      }`}
    >   

      {/* ======================================================
          SIDEBAR
         ====================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >

        <div className="brand">

          <div className="brand-mark">
            <ShieldCheck
              size={23}
              strokeWidth={2.2}
            />
          </div>


          {sidebarOpen && (
            <div className="brand-text">

              <strong>
                CyberGuard AI
              </strong>

              <span>
                Security Operations
              </span>

            </div>
          )}


          {sidebarOpen && (
            <button
              className="sidebar-toggle"
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
              aria-label="Collapse sidebar"
            >
              <X size={18} />
            </button>
          )}

        </div>


        {!sidebarOpen && (
          <button
            className="sidebar-expand"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}


        <nav className="sidebar-nav">

          <NavSection
            title="OPERATIONS"
            items={navigation}
            activePage={activePage}
            sidebarOpen={sidebarOpen}
            onNavigate={handleNavigation}
          />


          <NavSection
            title="RESOURCES"
            items={resources}
            activePage={activePage}
            sidebarOpen={sidebarOpen}
            onNavigate={handleNavigation}
          />

        </nav>


        <div className="sidebar-footer">

          <button
            className={`nav-item ${
              activePage ===
              "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Settings"
              )
            }
          >

            <Settings size={19} />

            {sidebarOpen && (
              <span>
                Settings
              </span>
            )}

          </button>


          {sidebarOpen && (
            <div className="system-status">

              <span
                className={`status-dot ${
                  apiStatus ===
                  "Offline"
                    ? "offline-dot"
                    : ""
                }`}
              />


              <div>

                <strong>
                  {apiStatus ===
                  "Online"
                    ? "System Operational"
                    : apiStatus}
                </strong>

                <span>
                  FastAPI service status
                </span>

              </div>

            </div>
          )}

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
         ====================================================== */}

      <main className="main-content">

        {/* ====================================================
            TOP BAR
           ==================================================== */}

        <header className="topbar">

          {!sidebarOpen && (
            <button
              className="menu-button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>
          )}


          <div className="breadcrumb">

            <span>
              Security Operations
            </span>

            <ChevronRight size={15} />

            <strong>
              {activePage}
            </strong>

          </div>


          {/* ==================================================
              TOP RIGHT TEXT BUTTONS
             ================================================== */}

          <div className="topbar-right">

            <button
              className="theme-toggle-button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={
                darkMode
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              title={
                darkMode
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* AVAILABLE INCIDENTS */}

            <button
              className="top-text-button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(
                    "open-available-incidents"
                  )
                )
              }
            >
              Available Incidents
            </button>


            {/* USER GUIDE */}

            <button
              className="top-text-button"
              onClick={() =>
                window.open(
                  USER_GUIDE_URL,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              User Guide
            </button>


            {/* API DOCS */}

            <button
              className="top-text-button"
              onClick={() =>
                window.open(
                  API_DOCS_URL,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              API Docs
            </button>


            {/* =================================================
                WORKFLOW TRACES

                Opens Langfuse Cloud project from .env
               ================================================= */}

            <button
              className="top-text-button"
              onClick={() => {

                if (
                  !LANGFUSE_PROJECT_URL
                ) {

                  alert(
                    "Langfuse project URL is not configured. Add VITE_LANFUSE_PROJECT_URL to the frontend .env file."
                  );

                  return;
                }


                window.open(
                  LANGFUSE_PROJECT_URL,
                  "_blank",
                  "noopener,noreferrer"
                );

              }}
            >
              Workflow Traces
            </button>


            {/* DEVELOPMENT */}

            <div className="environment-badge">

              <span className="environment-dot" />

              Development

            </div>


            {/* PROFILE */}

            <div className="profile">

              <div className="profile-avatar">
                AI
              </div>


              <div className="profile-info">

                <strong>
                  Security Analyst
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ====================================================
            PAGE CONTENT
           ==================================================== */}

        <section className="page-content">

          {activePage ===
            "Dashboard" ? (

              <Dashboard
                apiStatus={
                  apiStatus
                }
              />  

            ) : activePage ===
            "Settings" ? (

              <SettingsPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />

            ) : (

              <PlaceholderPage
                title={
                  activePage
                }
              />

            )}

        </section>

      </main>

    </div>
  );
}


/* ============================================================
   NAV SECTION
   ============================================================ */

function NavSection({
  title,
  items,
  activePage,
  sidebarOpen,
  onNavigate,
}) {
  return (
    <div className="nav-section">

      {sidebarOpen && (
        <span className="nav-title">
          {title}
        </span>
      )}


      {items.map(
        ({
          label,
          icon: Icon,
        }) => (

          <button
            key={label}
            className={`nav-item ${
              activePage ===
              label
                ? "active"
                : ""
            }`}
            onClick={() =>
              onNavigate(
                label
              )
            }
            title={
              sidebarOpen
                ? ""
                : label
            }
          >

            <Icon size={19} />


            {sidebarOpen && (
              <span>
                {label}
              </span>
            )}


            {sidebarOpen &&
              activePage ===
                label && (
                <ChevronRight
                  size={16}
                  className="nav-chevron"
                />
              )}

          </button>

        )
      )}

    </div>
  );
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({
  apiStatus,
}) {

  const manualRef =
    useRef(null);

  const manualBodyRef =
    useRef(null);

  const analyticsRef =
    useRef(null);

  const completedRef =
    useRef(null);


  const [
    incidents,
    setIncidents,
  ] = useState([]);

  const [
  investigations,
  setInvestigations,
  ] = useState([]);


  const [
    dataStatus,
    setDataStatus,
  ] = useState(
    "Loading"
  );


  const [
    selectedId,
    setSelectedId,
  ] = useState("");


  const [
    searchText,
    setSearchText,
  ] = useState("");


  const [
    logsText,
    setLogsText,
  ] = useState("");


  const [
    indicatorsText,
    setIndicatorsText,
  ] = useState("");


  const [
    runStatus,
    setRunStatus,
  ] = useState("Idle");


  const [
    runResult,
    setRunResult,
  ] = useState(null);

  const [
  investigationResults,
  setInvestigationResults,
] = useState({});


  const [
    runError,
    setRunError,
  ] = useState("");


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    completedPage,
    setCompletedPage,
  ] = useState(1);


  const [
    completedSearch,
    setCompletedSearch,
  ] = useState("");


  const [
    availableIncidentsOpen,
    setAvailableIncidentsOpen,
  ] = useState(false);

  const [
    totalIncidentsOpen,
    setTotalIncidentsOpen,
  ] = useState(false);

  const [
    completedIncidentsOpen,
    setCompletedIncidentsOpen,
  ] = useState(false);


  const [
    incidentSelectorOpen,
    setIncidentSelectorOpen,
  ] = useState(false);


  const [
    popupSearch,
    setPopupSearch,
  ] = useState("");

  const [
    metricPopupSearch,
    setMetricPopupSearch,
  ] = useState("");

  const [
    reportItem,
    setReportItem,
  ] = useState(null);


  /* ==========================================================
     LOAD INCIDENTS FROM COSMOS-BACKED API
     ========================================================== */

  async function loadIncidents(
    showRefresh = false
  ) {

    if (showRefresh) {
      setRefreshing(true);
    }


    setDataStatus(
      "Loading"
    );

    setRunError("");


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/incidents`
        );


      if (!response.ok) {

        const body =
          await response.text();


        throw new Error(
          body ||
            `Unable to load incidents (${response.status})`
        );
      }


      const data =
        await response.json();


      let rows = [];


      if (
        Array.isArray(data)
      ) {

        rows = data;

      } else if (
        Array.isArray(
          data?.items
        )
      ) {

        rows =
          data.items;

      } else if (
        Array.isArray(
          data?.data
        )
      ) {

        rows =
          data.data;

      }


      rows =
        rows
          .filter(
            (item) =>
              item &&
              getIncidentId(
                item
              )
          )
          .map(
            normalizeIncident
          );


      setIncidents(
        rows
      );


      setDataStatus(
        "Loaded"
      );


      if (
        rows.length
      ) {

        const selectedStillExists =
          rows.some(
            (item) =>
              getIncidentId(
                item
              ) === selectedId
          );


        if (
          !selectedStillExists
        ) {

          setSelectedId(
            getIncidentId(
              rows[0]
            )
          );

        }

      }

    } catch (error) {

      console.error(
        error
      );


      setIncidents(
        []
      );


      setDataStatus(
        "Error"
      );


      setRunError(
        error.message ||
          "Unable to load Cosmos DB incidents."
      );

    } finally {

      setRefreshing(
        false
      );

    }
  }
  async function loadInvestigations() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/investigations`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load investigations (${response.status})`
        );
      }

      const data = await response.json();

      let rows = [];

      if (Array.isArray(data)) {
        rows = data;
      } else if (Array.isArray(data?.value)) {
        rows = data.value;
      } else if (Array.isArray(data?.items)) {
        rows = data.items;
      } else if (Array.isArray(data?.data)) {
        rows = data.data;
      }

      setInvestigations(rows);

    } catch (error) {
      console.error(
        "Unable to load PostgreSQL investigations:",
        error
      );

      setInvestigations([]);
    }
  }

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {

    loadIncidents();
    loadInvestigations();

  }, []);


  /* ==========================================================
     AVAILABLE INCIDENTS EVENT
     ========================================================== */

  useEffect(() => {

    function openIncidents() {
      setPopupSearch("");
      setAvailableIncidentsOpen(true);
    }

    function scrollToManual() {
      manualRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function scrollToWorkflow() {
      analyticsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("open-available-incidents", openIncidents);
    window.addEventListener("scroll-to-manual-investigation", scrollToManual);
    window.addEventListener("scroll-to-workflow-analytics", scrollToWorkflow);

    return () => {
      window.removeEventListener("open-available-incidents", openIncidents);
      window.removeEventListener("scroll-to-manual-investigation", scrollToManual);
      window.removeEventListener("scroll-to-workflow-analytics", scrollToWorkflow);
    };

  }, []);


  /* ==========================================================
     SELECTED INCIDENT
     ========================================================== */

  const selectedIncident =
    useMemo(
      () =>
        incidents.find(
          (item) =>
            getIncidentId(
              item
            ) === selectedId
        ) || null,
      [
        incidents,
        selectedId,
      ]
    );


  /* ==========================================================
     AVAILABLE / UNEXECUTED INCIDENTS
     ========================================================== */

  const availableIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          !isIncidentExecuted(incident, investigations)
      ),
    [incidents, investigations]
  );


  /* ==========================================================
     POPUP SEARCH
     ========================================================== */

  const popupIncidents =
    useMemo(() => {

      const query =
        popupSearch
          .trim()
          .toLowerCase();


      if (!query) {
        return availableIncidents;
      }


      return availableIncidents.filter(
        (item) => {

          const searchable =
            [
              getIncidentId(
                item
              ),

              getIncidentName(
                item
              ),

              item.incident,

              item.description,

              item.logs,

              item.indicators,

              item.findings,

              item.severity,

              item.status,

              item.risk_level,

              JSON.stringify(
                item
              ),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();


          return searchable.includes(
            query
          );

        }
      );

    }, [
      availableIncidents,
      popupSearch,
    ]);


  /* ==========================================================
     SELECT INCIDENT
     ========================================================== */

  function handleSelectIncident(
    id
  ) {

    const item =
      incidents.find(
        (incident) =>
          getIncidentId(
            incident
          ) === id
      );


    if (!item) {
      return;
    }


    setSelectedId(
      id
    );


    setLogsText(
      stringifyField(
        item.logs ??
          item.security_logs ??
          item.log_data ??
          ""
      )
    );


    setIndicatorsText(
      stringifyField(
        item.indicators ??
          item.iocs ??
          item.threat_indicators ??
          ""
      )
    );


    setRunError(
      ""
    );


    setRunResult(
      null
    );


    setAvailableIncidentsOpen(
      false
    );


    setIncidentSelectorOpen(
      false
    );


    setPopupSearch(
      ""
    );


    setTimeout(() => {

      manualRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",

          block:
            "start",
        }
      );

    }, 100);

  }


  /* ==========================================================
     MAIN SEARCH
     ========================================================== */

  const filteredIncidents =
    useMemo(() => {

      const query =
        searchText
          .trim()
          .toLowerCase();


      if (!query) {
        return availableIncidents;
      }


      return availableIncidents.filter(
        (item) => {

          const searchable =
            [
              getIncidentId(
                item
              ),

              getIncidentName(
                item
              ),

              item.incident,

              item.description,

              item.logs,

              item.indicators,

              item.findings,

              item.severity,

              item.status,

              item.risk_level,

              item.risk_score,

              JSON.stringify(
                item
              ),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();


          return searchable.includes(
            query
          );

        }
      );

    }, [
      availableIncidents,
      searchText,
    ]);


  /* ==========================================================
     RUN INVESTIGATION
     ========================================================== */

  async function runInvestigation() {

    if (
      !selectedIncident
    ) {

      setRunError(
        "Please select an incident first."
      );

      return;
    }


    setRunError(
      ""
    );


    setRunResult(
      null
    );


    setRunStatus(
      "Running"
    );


    const incidentId =
      getIncidentId(
        selectedIncident
      );


    const incidentText =
      selectedIncident.incident ||
      selectedIncident.description ||
      selectedIncident.title ||
      selectedIncident.findings ||
      `Security incident ${incidentId}`;

    console.log("SELECTED INCIDENT BEFORE RUN:", selectedIncident);
    console.log("LOGS BEFORE RUN:", logsText);
    console.log("INDICATORS BEFORE RUN:", indicatorsText);


    const payload = {

      incident:
        stringifyField(
          incidentText
        ),

      logs:
        parseInput(
          logsText
        ),

      indicators:
        parseInput(
          indicatorsText
        ),

    };


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/investigations`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      const responseText =
        await response.text();


      if (
        !response.ok
      ) {

        let message =
          responseText;


        try {

          const errorJson =
            JSON.parse(
              responseText
            );


          message =
            errorJson.detail ||
            errorJson.message ||
            responseText;

        } catch {
          // Keep original response.
        }


        throw new Error(
          message ||
            `Investigation failed (${response.status})`
        );

      }


      let result;


      try {

        result =
          JSON.parse(
            responseText
          );

      } catch {

        result = {
          message:
            responseText,
        };

      }


      setRunResult(
        result
      );

      setInvestigationResults(
        (previous) => ({
          ...previous,
          [result?.investigation_id]: {
          rawOutput: result,
          incident: incidentText,
          logs: logsText,
          indicators: indicatorsText,
        },
      })
    );


      setRunStatus(
        "Completed"
      );


      await loadInvestigations();

    } catch (error) {

      console.error(
        error
      );


      setRunStatus(
        "Failed"
      );


      setRunError(
        error.message ||
          "Investigation failed."
      );

    }

  }


  function openReport(item) {
  const investigationId =
    item?.investigation_id ??
    item?.id ??
    getIncidentId(item);

  const rawOutput = {
    investigation_id: investigationId,
    status: item?.status ?? "COMPLETED",
    risk_assessment: item?.risk_assessment ?? {
      risk_level: item?.risk_level ?? null,
      risk_score: item?.risk_score ?? null,
    },
  };

  setReportItem({
    ...item,

    reportRawOutput: rawOutput,

    reportIncident:
      item?.incident ??
      item?.description ??
      item?.title ??
      "",

    reportLogs:
      item?.logs ??
      item?.security_logs ??
      item?.log_data ??
      "",

    reportIndicators:
      item?.indicators ??
      item?.iocs ??
      item?.threat_indicators ??
      "",
  });
}


  /* ==========================================================
     METRICS
     ========================================================== */

  const completedIncidents =
    investigations;


  const filteredCompletedIncidents =
    useMemo(() => {
      const query = completedSearch
        .trim()
        .toLowerCase();

      if (!query) {
        return completedIncidents;
      }

      return completedIncidents.filter((item) => {
        const incidentId = String(
          item?.incident_id ??
          item?.incidentId ??
          getIncidentId(item) ??
          ""
        ).toLowerCase();

        const incidentName = String(
          getIncidentName(item) || ""
        ).toLowerCase();

        const incidentText = String(
          item?.incident ??
          item?.description ??
          item?.title ??
          ""
        ).toLowerCase();

        return (
          incidentId.includes(query) ||
          incidentName.includes(query) ||
          incidentText.includes(query)
        );
      });
    }, [
      completedIncidents,
      completedSearch,
    ]);


  const completedCount =
    completedIncidents.length;


  const totalIncidents =
    availableIncidents.length +
    completedCount;


  const otherCount =
    availableIncidents.length;

  const totalIncidentPopupItems =
    useMemo(() => {
      const query = metricPopupSearch
        .trim()
        .toLowerCase();

      const rows = incidents
        .map((incident) => {
          const completed =
            isIncidentExecuted(
              incident,
              investigations
            );

          return {
            ...incident,
            metricStatus: completed
              ? "COMPLETED"
              : "INCOMPLETE",
          };
        })
        .sort((a, b) => {
          if (
            a.metricStatus ===
              b.metricStatus
          ) {
            return 0;
          }

          return a.metricStatus ===
            "COMPLETED"
            ? -1
            : 1;
        });

      if (!query) {
        return rows;
      }

      return rows.filter((item) =>
        [
          getIncidentId(item),
          getIncidentName(item),
          item.incident,
          item.description,
          getIncidentDate(item),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }, [
      incidents,
      investigations,
      metricPopupSearch,
    ]);

  const completedMetricPopupItems =
    useMemo(() => {
      const query = metricPopupSearch
        .trim()
        .toLowerCase();

      const rows = completedIncidents
        .map((investigation) => {
          const sourceIncident =
            incidents.find(
              (incident) =>
                isIncidentExecuted(
                  incident,
                  [investigation]
                )
            );

          return {
            ...investigation,
            metricIncidentId:
              sourceIncident
                ? getIncidentId(sourceIncident)
                : (
                    investigation?.incident_id ??
                    investigation?.incidentId ??
                    getIncidentId(investigation)
                  ),
            metricIncidentName:
              sourceIncident
                ? getIncidentName(sourceIncident)
                : getIncidentName(investigation),
          };
        });

      if (!query) {
        return rows;
      }

      return rows.filter((item) =>
        [
          item.metricIncidentId,
          item.metricIncidentName,
          item.incident,
          item.description,
          getIncidentDate(item),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }, [
      completedIncidents,
      incidents,
      metricPopupSearch,
    ]);

  function openCompletedInvestigationForIncident(
    incident
  ) {
    const incidentName =
      getIncidentName(incident);

    setCompletedSearch(
      incidentName || ""
    );
    setCompletedPage(1);
    setTotalIncidentsOpen(false);
    setCompletedIncidentsOpen(false);
    setMetricPopupSearch("");

    window.setTimeout(() => {
      completedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }


  /* ==========================================================
     RISK COUNTS
     ========================================================== */

  const riskCounts = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };


  investigations.forEach(
    (item) => {

      const risk =
        normalizeRisk(
          item
        );


      if (
        risk ===
        "HIGH"
      ) {
        riskCounts.HIGH++;
      }


      if (
        risk ===
        "MEDIUM"
      ) {
        riskCounts.MEDIUM++;
      }


      if (
        risk ===
        "LOW"
      ) {
        riskCounts.LOW++;
      }

    }
  );


  /* ==========================================================
     DAILY INCIDENT DATA
     ========================================================== */

  const dailyData =
    useMemo(() => {

      const completed =
        investigations;


      const buckets = {};


      completed.forEach(
        (item) => {

          const date =
            getIncidentDate(
              item
            );


          if (!date) {
            return;
          }


          const key =
            formatDateKey(
              date
            );


          buckets[key] =
            (buckets[key] ||
              0) + 1;

        }
      );


      const keys =
        Object.keys(
          buckets
        )
          .sort()
          .slice(-7);


      return keys.map(
        (key) => ({

          key,

          label:
            formatShortDate(
              new Date(
                `${key}T00:00:00`
              )
            ),

          value:
            buckets[key],

        })
      );

    }, [
      investigations,
    ]);


  /* ==========================================================
     PAGINATION
     ========================================================== */

  const totalCompletedPages =
    Math.max(
      Math.ceil(
        filteredCompletedIncidents.length /
          PAGE_SIZE
      ),
      1
    );


  useEffect(() => {

    if (
      completedPage >
      totalCompletedPages
    ) {

      setCompletedPage(
        totalCompletedPages
      );

    }

  }, [
    completedPage,
    totalCompletedPages,
  ]);
  
  const completedPageData =
    useMemo(() => {

      const start =
        (completedPage -
          1) *
        PAGE_SIZE;


      return filteredCompletedIncidents.slice(
        start,
        start +
          PAGE_SIZE
      );

    }, [
      filteredCompletedIncidents,
      completedPage,
    ]);


  /* ==========================================================
     DASHBOARD UI
     ========================================================== */

  return (
    <>

      {/* ======================================================
          PAGE HEADER
         ====================================================== */}

      <div className="page-header">

        <div>

          <h1>
            Security Intelligence Dashboard
          </h1>


          <p>
            Monitor security incidents,
            review risk posture, and
            manually investigate cases
            from Azure Cosmos DB.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={() =>
            loadIncidents(
              true
            )
          }
          disabled={
            refreshing
          }
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? "spin"
                : ""
            }
          />


          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* ======================================================
          METRICS
         ====================================================== */}

      <div className="metric-grid">

        <MetricCard
          icon={Database}
          label="Total Incidents"
          value={
            totalIncidents
          }
          description="Cosmos DB records"
          onClick={() => {
            setMetricPopupSearch("");
            setTotalIncidentsOpen(true);
          }}
        />


        <MetricCard
          icon={CheckCircle2}
          label="Completed"
          value={
            completedCount
          }
          description="Completed investigations"
          onClick={() => {
            setMetricPopupSearch("");
            setCompletedIncidentsOpen(true);
          }}
        />


        <MetricCard
          icon={AlertTriangle}
          label="Incomplete"
          value={
            otherCount
          }
          description="Pending / other"
          accent="maroon"
          onClick={() => {
            setPopupSearch("");
            setAvailableIncidentsOpen(true);
          }}
        />

      </div>


      <div
        ref={analyticsRef}
        className="dashboard-analytics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
      {/* ======================================================
          DAILY VERTICAL BAR GRAPH
         ====================================================== */}

      <section className="dashboard-card daily-chart-card">

        <CardHeader
          eyebrow="INVESTIGATION ANALYTICS"
          title="Incidents Worked Per Day"
          icon={Activity}
        />


        <div className="chart-subtitle">
          Completed investigations grouped
          by completion date.
        </div>


        <DailyVerticalChart
          data={
            dailyData
          }
        />

      </section>

      {/* ======================================================
          RISK PIE CHART
         ====================================================== */}

      <section className="dashboard-card risk-chart-card">

        <CardHeader
          eyebrow="RISK POSTURE"
          title="Risk Distribution"
          icon={ShieldAlert}
        />


        <RiskPieChart
          counts={
            riskCounts
          }
          total={
            completedCount
          }
        />

      </section>
      </div>

      <div
        className="dashboard-lower-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.72fr) minmax(0, 1.68fr)",
          gap: "12px",
          alignItems: "stretch",
        }}
      >
      {/* ======================================================
          MANUAL INVESTIGATION
         ====================================================== */}

      <section
        ref={manualRef}
        className="dashboard-card manual-investigation-card"
      >

        <div className="manual-header">

          <div className="manual-title-area">

            <div className="manual-icon">
              <ShieldAlert
                size={21}
              />
            </div>


            <div>

              <span className="card-eyebrow">
                MANUAL INVESTIGATION
              </span>


              <h2>
                Investigate Cosmos DB Incident
              </h2>


              <p>
                Select an incident, review
                its logs and indicators,
                and manually run the
                security investigation.
              </p>

            </div>

          </div>


          <div className="manual-scroll-controls">
            <button
              type="button"
              className="manual-scroll-button"
              onClick={() =>
                manualBodyRef.current?.scrollTo({
                  top: manualBodyRef.current.scrollHeight,
                  behavior: "smooth",
                })
              }
              title="Scroll to raw output"
            >
              <ChevronRight size={14} />
              Output
            </button>
            <button
              type="button"
              className="manual-scroll-button"
              onClick={() =>
                manualBodyRef.current?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              title="Scroll to top"
            >
              <ChevronLeft size={14} />
              Top
            </button>
          </div>

          <div
            className={`run-status ${
              runStatus.toLowerCase()
            }`}
          >

            <span />

            {runStatus ===
            "Running"
              ? "Investigation Running"
              : runStatus ===
                "Completed"
              ? "Investigation Completed"
              : runStatus ===
                "Failed"
              ? "Investigation Failed"
              : "Ready"}

          </div>

        </div>


        <div ref={manualBodyRef} className="manual-body manual-scroll-container">

          {/* ==================================================
              SEARCH + SELECT
             ================================================== */}

          <div className="search-select-row">

            <div className="search-field">

              <Search
                size={18}
              />


              <input
                type="text"
                placeholder="Search incident ID, logs, indicators..."
                value={
                  searchText
                }
                onChange={(
                  event
                ) => {

                  setSearchText(
                    event.target
                      .value
                  );


                  setCompletedPage(
                    1
                  );

                }}
              />


              {searchText && (
                <button
                  className="clear-search"
                  onClick={() =>
                    setSearchText(
                      ""
                    )
                  }
                >
                  <X size={15} />
                </button>
              )}

            </div>


            <button
              className="select-incident-button"
              onClick={() => {

                setPopupSearch(
                  ""
                );


                setIncidentSelectorOpen(
                  true
                );

              }}
              disabled={
                dataStatus !==
                  "Loaded" ||
                runStatus ===
                  "Running"
              }
            >

              <SlidersHorizontal
                size={17}
              />


              <span>
                Select Incident
              </span>


              <ChevronRight
                size={16}
              />

            </button>

          </div>


          {searchText.trim() && (
            <div
              className="search-suggestions"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop: "8px",
                padding: "6px",
                border: "1px solid #dfe5eb",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                maxHeight: "280px",
                overflowY: "auto",
              }}
            >
              {filteredIncidents.length ? (
                filteredIncidents.slice(0, 8).map((item) => (
                  <button
                    type="button"
                    className="search-suggestion"
                    key={getIncidentId(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      width: "100%",
                      padding: "10px 12px",
                      border: "0",
                      borderRadius: "8px",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectIncident(getIncidentId(item))}
                  >
                    <span className="search-suggestion-main">
                      {getIncidentName(item)}
                    </span>
                    <span className="search-suggestion-id">
                      {getIncidentId(item)}
                    </span>
                  </button>
                ))
              ) : (
                <div
                  className="search-suggestions-empty"
                  style={{ padding: "12px", fontSize: "13px", opacity: 0.7 }}
                >
                  No available incidents match your search.
                </div>
              )}
            </div>
          )}


          {/* ==================================================
              SELECTED INCIDENT
             ================================================== */}

          {selectedIncident ? (

            <div className="selected-incident-panel">

              <div className="selected-incident-header">

                <div>

                  <span>
                    SELECTED INCIDENT
                  </span>


                  <strong>
                    {
                      getIncidentName(
                        selectedIncident
                      )
                    }
                  </strong>


                  <small>
                    Incident ID:{" "}
                    {
                      getIncidentId(
                        selectedIncident
                      )
                    }
                  </small>

                </div>


                <span
                  className={`risk-badge ${normalizeRisk(
                    selectedIncident
                  ).toLowerCase()}`}
                >
                  {
                    normalizeRisk(
                      selectedIncident
                    )
                  }
                </span>

              </div>


              <div className="selected-description">

                {
                  getIncidentDescription(
                    selectedIncident
                  )
                }

              </div>


              <div className="selected-meta">

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedIncident.status ||
                      "UNKNOWN"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Severity
                  </span>

                  <strong>
                    {
                      selectedIncident.severity ||
                      "UNKNOWN"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Risk Score
                  </span>

                  <strong>
                    {
                      selectedIncident.risk_score ??
                      selectedIncident
                        .risk_assessment
                        ?.risk_score ??
                      "—"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Source
                  </span>

                  <strong>
                    Azure Cosmos DB
                  </strong>

                </div>

              </div>

            </div>

          ) : (

            <div className="selection-empty">

              <Database
                size={19}
              />


              <span>
                Click "Select Incident"
                to choose an incident from
                Cosmos DB.
              </span>

            </div>

          )}


          {/* ==================================================
              LOGS + INDICATORS
             ================================================== */}

          <div className="input-grid">

            <div className="input-panel">

              <div className="input-panel-header">

                <div>

                  <span>
                    SECURITY LOGS
                  </span>

                  <strong>
                    Logs
                  </strong>

                </div>


                <FileText
                  size={17}
                />

              </div>


              <textarea
                value={
                  logsText
                }
                onChange={(
                  event
                ) =>
                  setLogsText(
                    event.target
                      .value
                  )
                }
                placeholder={
                  selectedIncident
                    ? "Logs loaded from Cosmos DB..."
                    : "Select an incident to load logs..."
                }
                disabled={
                  !selectedIncident ||
                  runStatus ===
                    "Running"
                }
              />

            </div>


            <div className="input-panel">

              <div className="input-panel-header">

                <div>

                  <span>
                    THREAT INDICATORS
                  </span>

                  <strong>
                    Indicators
                  </strong>

                </div>


                <AlertTriangle
                  size={17}
                />

              </div>


              <textarea
                value={
                  indicatorsText
                }
                onChange={(
                  event
                ) =>
                  setIndicatorsText(
                    event.target
                      .value
                  )
                }
                placeholder={
                  selectedIncident
                    ? "IP addresses, domains, hashes, IOCs..."
                    : "Select an incident to load indicators..."
                }
                disabled={
                  !selectedIncident ||
                  runStatus ===
                    "Running"
                }
              />

            </div>

          </div>


          {/* ==================================================
              RUN INVESTIGATION BUTTON
             ================================================== */}

          <div className="manual-action-row">

            <div className="manual-hint">

              <ShieldCheck
                size={17}
              />

              <span>
                Review the selected
                Cosmos DB data before
                manually starting the
                investigation.
              </span>

            </div>


            <button
              className="run-investigation-button"
              onClick={
                runInvestigation
              }
              disabled={
                !selectedIncident ||
                runStatus ===
                  "Running"
              }
            >

              {runStatus ===
              "Running" ? (

                <>

                  <Activity className="pulse" />

                  Running Investigation...

                </>

              ) : (

                <>

                  <Play
                    size={17}
                    fill="currentColor"
                  />

                  Run Investigation

                </>

              )}

            </button>

          </div>


          {/* ==================================================
              ERROR
             ================================================== */}

          {runError && (
            <div className="error-banner">

              <AlertTriangle
                size={16}
              />


              <span>
                {runError}
              </span>

            </div>
          )}


          {/* ==================================================
              INVESTIGATION OUTPUT
             ================================================== */}

          {runResult && (
            <InvestigationResult
              result={
                runResult
              }
            />
          )}

        </div>

      </section>

      {/* ======================================================
          COMPLETED INVESTIGATIONS
         ====================================================== */}

      <section
        ref={completedRef}
        className="dashboard-card completed-card"
      >

        <CardHeader
          eyebrow="INVESTIGATION HISTORY"
          title="Completed Investigations"
          icon={CheckCircle2}
          right={
            <div className="completed-header-tools">
              <div className="completed-history-search">
                <Search size={16} />
                <input
                  type="text"
                  value={completedSearch}
                  placeholder="Search completed investigations"
                  aria-label="Search completed investigations"
                  onChange={(event) => {
                    setCompletedSearch(event.target.value);
                    setCompletedPage(1);
                  }}
                />
                {completedSearch && (
                  <button
                    type="button"
                    className="completed-history-search-clear"
                    aria-label="Clear completed investigation search"
                    onClick={() => {
                      setCompletedSearch("");
                      setCompletedPage(1);
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <span className="record-count">
                {completedSearch.trim()
                  ? `${filteredCompletedIncidents.length} matching`
                  : `${completedCount} completed`}
              </span>
            </div>
          }
        />



        <div className="completed-table-wrapper">

          <table className="completed-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Incident ID</th>
                <th>Incident</th>
                <th>Severity</th>
                <th>Risk Score</th>
                <th>Recorded At</th>
                <th>Report</th>
              </tr>
            </thead>

            <tbody>
              {completedPageData.length ? (
                completedPageData.map((item) => (
                  <tr key={`${getIncidentId(item)}-${getIncidentDate(item)}`}>
                    <td>
                      <span className={`completed-status ${String(item.status || "").toLowerCase()}`}>
                        <span />
                        {formatStatus(item.status || "COMPLETED")}
                      </span>
                    </td>
                    <td>
                      <span className="table-id-text">
                        {getIncidentId(item)}
                      </span>
                    </td>
                    <td>
                      <div className="table-incident">
                        <span className="table-incident-title">
                          {getIncidentName(item)}
                        </span>
                        <span>{getIncidentDescription(item)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`severity-badge ${getInvestigationSeverity(item, incidents).toLowerCase()}`}>
                        {getInvestigationSeverity(item, incidents)}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {item.risk_score ?? item.risk_assessment?.risk_score ?? "—"}
                      </strong>
                    </td>
                    <td>{formatDateTime(getIncidentDate(item))}</td>
                    <td>
                      <button
                        type="button"
                        className="view-report-button"
                        style={{
                          border: "1px solid #cfd7df",
                          borderRadius: "7px",
                          padding: "7px 12px",
                          background: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        onClick={() => openReport(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty">
                    {completedSearch.trim()
                      ? `No completed investigations match "${completedSearch.trim()}".`
                      : "No completed investigations found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>


        {/* ====================================================
            PAGINATION
           ==================================================== */}

        <div className="pagination-bar">

          <div className="pagination-info">

            {filteredCompletedIncidents.length === 0
              ? "0 records"
              : `${Math.min(
                  (completedPage - 1) * PAGE_SIZE + 1,
                  filteredCompletedIncidents.length
                )}-${Math.min(
                  completedPage * PAGE_SIZE,
                  filteredCompletedIncidents.length
                )} of ${filteredCompletedIncidents.length}`}

          </div>


          <div className="pagination-controls">

            <button
              className="pagination-button"
              disabled={
                completedPage <=
                1
              }
              onClick={() =>
                setCompletedPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
            >
              <ChevronLeft
                size={17}
              />
            </button>


            <div className="page-number">

              Page{" "}
              {
                completedPage
              }{" "}
              of{" "}
              {
                totalCompletedPages
              }

            </div>


            <button
              className="pagination-button"
              disabled={
                completedPage >=
                totalCompletedPages
              }
              onClick={() =>
                setCompletedPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalCompletedPages
                    )
                )
              }
            >
              <ChevronRight
                size={17}
              />
            </button>

          </div>

        </div>

      </section>
      </div>

      {reportItem && (
        <ReportModal
          item={reportItem}
          severity={getInvestigationSeverity(reportItem, incidents)}
          onClose={() => setReportItem(null)}
        />
      )}


      {/* ======================================================
          PLATFORM HEALTH
         ====================================================== */}

      <section className="dashboard-card health-card">

        <CardHeader
          eyebrow="PLATFORM HEALTH"
          title="Security Platform Services"
          icon={Server}
        />


        <div className="health-grid">

          <HealthRow
            icon={Server}
            name="FastAPI Backend"
            status={
              apiStatus
            }
            online={
              apiStatus ===
              "Online"
            }
          />


          <HealthRow
            icon={Database}
            name="Azure Cosmos DB"
            status={
              dataStatus ===
              "Loaded"
                ? "Connected"
                : dataStatus ===
                  "Error"
                ? "Error"
                : "Checking"
            }
            online={
              dataStatus ===
              "Loaded"
            }
          />


          <HealthRow
            icon={Database}
            name="PostgreSQL"
            status="Configured"
            online
          />


          <HealthRow
            icon={Database}
            name="Redis Cache"
            status="Configured"
            online
          />


          <HealthRow
            icon={Activity}
            name="Langfuse"
            status={
              LANGFUSE_PROJECT_URL
                ? "Connected"
                : "Not Configured"
            }
            online={
              Boolean(
                LANGFUSE_PROJECT_URL
              )
            }
          />

        </div>

      </section>


      {/* ======================================================
          TOTAL INCIDENTS POPUP
         ====================================================== */}

      {totalIncidentsOpen && (
        <MetricIncidentPopup
          title="Total Incidents"
          subtitle="All incidents from Azure Cosmos DB, with completed investigations shown first."
          incidents={totalIncidentPopupItems}
          search={metricPopupSearch}
          setSearch={setMetricPopupSearch}
          showStatus
          onClose={() => {
            setTotalIncidentsOpen(false);
            setMetricPopupSearch("");
          }}
          onSelectCompleted={
            openCompletedInvestigationForIncident
          }
        />
      )}


      {/* ======================================================
          COMPLETED INCIDENTS POPUP
         ====================================================== */}

      {completedIncidentsOpen && (
        <MetricIncidentPopup
          title="Completed Incidents"
          subtitle="Incidents with completed investigations."
          incidents={completedMetricPopupItems}
          search={metricPopupSearch}
          setSearch={setMetricPopupSearch}
          completedOnly
          onClose={() => {
            setCompletedIncidentsOpen(false);
            setMetricPopupSearch("");
          }}
          onSelectCompleted={
            openCompletedInvestigationForIncident
          }
        />
      )}


      {/* ======================================================
          AVAILABLE INCIDENTS POPUP
         ====================================================== */}

      {availableIncidentsOpen && (
        <CasePopup
          title="Available Incidents"
          subtitle="All security incidents currently available from Azure Cosmos DB."
          incidents={
            popupIncidents
          }
          search={
            popupSearch
          }
          setSearch={
            setPopupSearch
          }
          onClose={() =>
            setAvailableIncidentsOpen(
              false
            )
          }
          onSelect={
            handleSelectIncident
          }
        />
      )}


      {/* ======================================================
          SELECT INCIDENT POPUP
         ====================================================== */}

      {incidentSelectorOpen && (
        <CasePopup
          title="Available Input Data"
          subtitle="Select an available Cosmos DB incident to preview its input data and load it into the manual investigation."
          showInputData
          incidents={
            popupIncidents
          }
          search={
            popupSearch
          }
          setSearch={
            setPopupSearch
          }
          onClose={() =>
            setIncidentSelectorOpen(
              false
            )
          }
          onSelect={
            handleSelectIncident
          }
        />
      )}

    </>
  );
}


/* ============================================================
   CASE POPUP
   ============================================================ */

function CasePopup({
  title,
  subtitle,
  incidents,
  search,
  setSearch,
  onClose,
  onSelect,
  showInputData = false,
}) {
  return (

    <div
      className="modal-overlay"
      onMouseDown={(
        event
      ) => {

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="cases-modal">

        <div className="cases-modal-header">

          <div className="cases-modal-title">

            <div className="modal-icon">
              <Database
                size={20}
              />
            </div>


            <div>

              <span>
                AZURE COSMOS DB
              </span>


              <h2>
                {title}
              </h2>


              <p>
                {subtitle}
              </p>

            </div>

          </div>


          <button
            className="modal-close"
            onClick={
              onClose
            }
          >
            <X size={19} />
          </button>

        </div>


        <div className="cases-modal-search">

          <Search
            size={17}
          />


          <input
            autoFocus
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Search incident name, ID, logs, indicators..."
          />


          {search && (
            <button
              onClick={() =>
                setSearch(
                  ""
                )
              }
            >
              <X size={15} />
            </button>
          )}

        </div>


        <div className="cases-modal-summary">

          <strong>
            {
              incidents.length
            }
          </strong>


          <span>
            incidents available
          </span>

        </div>


        <div className="cases-list">

          {incidents.length ? (

            incidents.map(
              (item) => (

                <CaseCard
                  key={
                    getIncidentId(
                      item
                    )
                  }
                  incident={
                    item
                  }
                  onSelect={
                    onSelect
                  }
                  showInputData={
                    showInputData
                  }
                />

              )
            )

          ) : (

            <div className="cases-empty">

              <Search
                size={28}
              />


              <strong>
                No incidents found
              </strong>


              <span>
                Try another search term.
              </span>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   CASE CARD
   ============================================================ */

function CaseCard({
  incident,
  onSelect,
  showInputData = false,
}) {

  const id =
    getIncidentId(
      incident
    );


  const logs =
    stringifyField(
      incident.logs ??
        incident.security_logs ??
        incident.log_data ??
        ""
    );


  const indicators =
    stringifyField(
      incident.indicators ??
        incident.iocs ??
        incident.threat_indicators ??
        ""
    );


  const incidentName =
    getIncidentName(
      incident
    );


  const logCount =
    countItems(
      logs
    );


  const indicatorCount =
    countItems(
      indicators
    );


  return (

    <button
      className="case-card"
      onClick={() =>
        onSelect(
          id
        )
      }
    >

      <div className="case-card-main">

        <div className="case-name-section">

          <h3>
            {
              incidentName
            }
          </h3>


          <span className="case-id-text">
            Incident ID:{" "}
            {id}
          </span>

        </div>


        <div className="case-card-badges">

          <span
            className={`risk-badge ${normalizeRisk(
              incident
            ).toLowerCase()}`}
          >
            {
              normalizeRisk(
                incident
              )
            }{" "}
            Risk
          </span>


          <span className="case-status">
            {
              formatStatus(
                incident.status
              )
            }
          </span>

        </div>

      </div>


      <div className="case-description">

        {
          getIncidentDescription(
            incident
          )
        }

      </div>


      <div className="case-data-summary">

        <div className="case-summary-item">

          <FileText
            size={15}
          />


          <div>

            <strong>
              Security Logs
            </strong>


            <span>
              {logCount > 0
                ? `${logCount} log ${
                    logCount ===
                    1
                      ? "entry"
                      : "entries"
                  } available`
                : "No logs available"}
            </span>

          </div>

        </div>


        <div className="case-summary-item">

          <AlertTriangle
            size={15}
          />


          <div>

            <strong>
              Threat Indicators
            </strong>


            <span>
              {indicatorCount > 0
                ? `${indicatorCount} indicator${
                    indicatorCount ===
                    1
                      ? ""
                      : "s"
                  } available`
                : "No indicators available"}
            </span>

          </div>

        </div>

      </div>


      {showInputData && (
        <div
          className="available-input-data"
          style={{
            marginTop: "12px",
            padding: "12px",
            border: "1px solid #e3e8ee",
            borderRadius: "10px",
            background: "#f8fafc",
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "12px",
              letterSpacing: "0.06em",
            }}
          >
            AVAILABLE INPUT DATA
          </strong>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                }}
              >
                Logs
              </strong>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "120px",
                  overflow: "auto",
                  fontSize: "11px",
                  lineHeight: 1.45,
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "7px",
                  border: "1px solid #e3e8ee",
                }}
              >
                {logs || "No logs available"}
              </pre>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                }}
              >
                Indicators
              </strong>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "120px",
                  overflow: "auto",
                  fontSize: "11px",
                  lineHeight: 1.45,
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "7px",
                  border: "1px solid #e3e8ee",
                }}
              >
                {indicators || "No indicators available"}
              </pre>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <strong
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
              }}
            >
              Findings
            </strong>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "100px",
                overflow: "auto",
                fontSize: "11px",
                lineHeight: 1.45,
                background: "#fff",
                padding: "8px",
                borderRadius: "7px",
                border: "1px solid #e3e8ee",
              }}
            >
              {stringifyField(
                incident.findings
              ) || "No findings available"}
            </pre>
          </div>
        </div>
      )}

      <div className="case-card-footer">

        <span>

          Severity:{" "}

          <strong>
            {
              incident.severity ||
              "UNKNOWN"
            }
          </strong>

        </span>


        <span className="case-select-label">

          Select Incident

          <ChevronRight
            size={15}
          />

        </span>

      </div>

    </button>
  );
}


/* ============================================================
   DASHBOARD METRIC INCIDENT POPUP
   ============================================================ */

function MetricIncidentPopup({
  title,
  subtitle,
  incidents,
  search,
  setSearch,
  onClose,
  showStatus = false,
  completedOnly = false,
  onSelectCompleted,
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="cases-modal metric-incidents-modal">
        <div className="cases-modal-header">
          <div className="cases-modal-title">
            <div className="modal-icon">
              <Database size={20} />
            </div>

            <div>
              <span>DASHBOARD INCIDENTS</span>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <div className="cases-modal-search">
          <Search size={17} />

          <input
            autoFocus
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search incident name or ID..."
            aria-label={`Search ${title}`}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="cases-modal-summary">
          <strong>{incidents.length}</strong>
          <span>
            {completedOnly
              ? "completed incidents"
              : "incidents"}
          </span>
        </div>

        <div className="metric-incident-list">
          {incidents.length ? (
            incidents.map((item, index) => {
              const incidentId =
                item.metricIncidentId ||
                getIncidentId(item);

              const incidentName =
                item.metricIncidentName ||
                getIncidentName(item);

              const recordedAt =
                formatDateTime(
                  getIncidentDate(item)
                );

              const isCompleted =
                item.metricStatus ===
                  "COMPLETED" ||
                completedOnly;

              return (
                <button
                  key={`${incidentId}-${index}`}
                  type="button"
                  className={`metric-incident-row ${
                    isCompleted
                      ? "metric-incident-row-clickable"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      isCompleted &&
                      onSelectCompleted
                    ) {
                      onSelectCompleted(item);
                    }
                  }}
                  disabled={!isCompleted}
                >
                  <div className="metric-incident-main">
                    <span className="metric-incident-id">
                      {incidentId || "—"}
                    </span>

                    <strong>
                      {incidentName ||
                        "Security incident"}
                    </strong>

                    <span>
                      Recorded at:{" "}
                      {recordedAt || "—"}
                    </span>
                  </div>

                  {showStatus && (
                    <span
                      className={`metric-incident-status ${
                        isCompleted
                          ? "completed"
                          : "incomplete"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : "Incomplete"}
                    </span>
                  )}

                  {completedOnly && (
                    <span className="metric-incident-status completed">
                      Completed
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="cases-empty">
              <Search size={28} />
              <strong>
                No incidents found
              </strong>
              <span>
                Try another search term.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   METRIC CARD
   ============================================================ */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  accent = "blue",
  onClick,
}) {
  const CardElement = onClick
    ? "button"
    : "div";

  return (

    <CardElement
      className={`metric-card ${
        onClick
          ? "metric-card-button"
          : ""
      }`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >

      <div
        className={`metric-icon ${accent}`}
      >
        <Icon
          size={20}
        />
      </div>


      <div className="metric-content">

        <span>
          {label}
        </span>


        <strong>
          {value}
        </strong>


        <small>
          {description}
        </small>

      </div>

    </CardElement>
  );
}


/* ============================================================
   CARD HEADER
   ============================================================ */

function CardHeader({
  eyebrow,
  title,
  icon: Icon,
  right,
}) {
  return (

    <div className="card-header">

      <div>

        <span className="card-eyebrow">
          {eyebrow}
        </span>


        <h2>
          {title}
        </h2>

      </div>


      <div className="card-header-right">

        {right}


        <div className="card-icon">

          <Icon
            size={18}
          />

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   DAILY VERTICAL BAR GRAPH
   ============================================================ */

function DailyVerticalChart({
  data,
}) {

  if (!data.length) {

    return (

      <div className="chart-empty">

        <Activity
          size={25}
        />


        <strong>
          No completed investigation data
        </strong>


        <span>
          Completed incidents will
          appear here grouped by day.
        </span>

      </div>
    );
  }


  const maxValue =
    Math.max(
      ...data.map(
        (item) =>
          item.value
      ),
      1
    );


  return (

    <div className="vertical-chart">

      <div className="chart-y-axis">

        <span>
          {maxValue}
        </span>


        <span>
          {Math.ceil(
            maxValue / 2
          )}
        </span>


        <span>
          0
        </span>

      </div>


      <div className="chart-area">

        <div className="chart-grid-line top" />

        <div className="chart-grid-line middle" />

        <div className="chart-grid-line bottom" />


        <div className="vertical-bars">

          {data.map(
            (item) => {

              const height =
                (item.value /
                  maxValue) *
                100;


              return (

                <div
                  className="vertical-bar-column"
                  key={
                    item.key
                  }
                >

                  <div className="bar-value">
                    {
                      item.value
                    }
                  </div>


                  <div className="vertical-bar-track">

                    <div
                      className="vertical-bar-fill"
                      style={{
                        height:
                          `${Math.max(
                            height,
                            5
                          )}%`,
                      }}
                    />

                  </div>


                  <span className="bar-date">
                    {
                      item.label
                    }
                  </span>

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   RISK PIE CHART
   ============================================================ */

function RiskPieChart({
  counts,
  total,
}) {

  const high =
    total
      ? (counts.HIGH /
          total) *
        100
      : 0;


  const medium =
    total
      ? (counts.MEDIUM /
          total) *
        100
      : 0;


  const mediumEnd =
    high +
    medium;


  const background =
    total > 0
      ? `conic-gradient(
          #b44c55 0 ${high}%,
          #d59b36 ${high}% ${mediumEnd}%,
          #4b9b70 ${mediumEnd}% 100%
        )`
      : "#e8edf2";


  return (

    <div className="pie-layout">

      <div className="pie-wrapper">

        <div
          className="pie-chart"
          style={{
            background,
          }}
        />


        <div className="pie-total">

          <strong>
            {total}
          </strong>


          <span>
            incidents
          </span>

        </div>

      </div>


      <div className="pie-legend">

        <PieLegend
          label="High Risk"
          value={
            counts.HIGH
          }
          total={
            total
          }
          className="high"
        />


        <PieLegend
          label="Medium Risk"
          value={
            counts.MEDIUM
          }
          total={
            total
          }
          className="medium"
        />


        <PieLegend
          label="Low Risk"
          value={
            counts.LOW
          }
          total={
            total
          }
          className="low"
        />

      </div>

    </div>
  );
}


/* ============================================================
   PIE LEGEND
   ============================================================ */

function PieLegend({
  label,
  value,
  total,
  className,
}) {

  const percentage =
    total
      ? Math.round(
          (value /
            total) *
            100
        )
      : 0;


  return (

    <div className="pie-legend-row">

      <div className="pie-legend-name">

        <span
          className={`pie-dot ${className}`}
        />


        <span>
          {label}
        </span>

      </div>


      <strong>
        {value}
      </strong>


      <small>
        {percentage}%
      </small>

    </div>
  );
}


/* ============================================================
   INVESTIGATION RESULT
   ============================================================ */

function InvestigationResult({
  result,
}) {

  const risk =
    result
      ?.risk_assessment
      ?.risk_level ||
    result?.risk_level ||
    "UNKNOWN";


  const score =
    result
      ?.risk_assessment
      ?.risk_score ??
    result?.risk_score ??
    "—";


  const summary =
    result
      ?.risk_assessment
      ?.summary ||
    result?.summary ||
    result?.message ||
    "Investigation completed successfully.";


  return (

    <div className="investigation-result">

      <div className="result-header">

        <div>

          <span>
            INVESTIGATION OUTPUT
          </span>


          <strong>
            Investigation completed
          </strong>

        </div>


        <div className="result-risk">

          <span>
            Risk
          </span>


          <strong>
            {risk}
          </strong>


          <small>
            Score {score}
          </small>

        </div>

      </div>


      <div className="result-summary">

        <span>
          SUMMARY
        </span>


        <p>
          {summary}
        </p>

      </div>


      <div className="result-json">

        <div>

          <span>
            RAW OUTPUT
          </span>

        </div>


        <pre>
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>

      </div>

    </div>
  );
}


/* ============================================================
   REPORT MODAL
   ============================================================ */

function ReportModal({ item, severity: resolvedSeverity, onClose }) {
  const rawOutput = item?.reportRawOutput;

  const logs =
    item?.reportLogs ??
    item?.logs ??
    item?.security_logs ??
    item?.log_data ??
    "";

  const indicators =
    item?.reportIndicators ??
    item?.indicators ??
    item?.iocs ??
    item?.threat_indicators ??
    "";

  const incident =
    item?.reportIncident ??
    item?.incident ??
    item?.description ??
    item?.title ??
    "";

  const severity =
    resolvedSeverity ??
    item?.risk_level ??
    item?.severity ??
    item?.triage_result?.severity ??
    item?.triage?.severity ??
    item?.risk_assessment?.severity ??
    "UNKNOWN";

  const riskScore =
    rawOutput?.risk_assessment?.risk_score ??
    rawOutput?.risk_score ??
    item?.risk_score ??
    item?.risk_assessment?.risk_score ??
    "N/A";

  const formatReportValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    if (typeof value === "string") {
      return value;
    }

    return JSON.stringify(value, null, 2);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="cases-modal report-modal">

        {/* HEADER */}
        <div className="report-modal-header">
          <div>
            <span>INVESTIGATION REPORT</span>

            <h2>
              Investigation Report
            </h2>

            <p>
              PostgreSQL investigation record
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close report"
          >
            <X size={19} />
          </button>
        </div>

        {/* REPORT CONTENT */}
        <div className="report-modal-content">

          {/* 1. INCIDENT ID */}
          <div className="report-detail-row">
            <span>
              INCIDENT ID
            </span>

            <strong className="report-mono">
              {getIncidentId(item)}
            </strong>
          </div>

          {/* 2. INCIDENT */}
          <div className="report-detail-row report-incident-row">
            <span>
              INCIDENT
            </span>

            <strong>
              {formatReportValue(incident)}
            </strong>
          </div>

          {/* 3. LOGS */}
          <div className="report-detail-row report-content-row">
            <span>
              LOGS
            </span>

            <pre className="report-field-output">
              {formatReportValue(logs)}
            </pre>
          </div>

          {/* 4. INDICATORS */}
          <div className="report-detail-row report-content-row">
            <span>
              INDICATORS
            </span>

            <pre className="report-field-output">
              {formatReportValue(indicators)}
            </pre>
          </div>

          {/* 5. STATUS */}
          <div className="report-detail-row">
            <span>
              STATUS
            </span>

            <strong>
              {formatStatus(
                rawOutput?.status ??
                item?.status ??
                "COMPLETED"
              )}
            </strong>
          </div>

          {/* 6. SEVERITY */}
          <div className="report-detail-row">
            <span>
              SEVERITY
            </span>

            <strong
              className={`severity-badge ${String(
                severity
              ).toLowerCase()}`}
            >
              {severity}
            </strong>
          </div>

          {/* 7. RISK SCORE */}
          <div className="report-detail-row">
            <span>
              RISK SCORE
            </span>

            <strong className="report-risk-score">
              {riskScore}
            </strong>
          </div>

          {/* 8. EXACT RAW OUTPUT */}
          <div className="report-raw-output">
            <span>
              RAW OUTPUT
            </span>

            <pre>
              {rawOutput
                ? JSON.stringify(
                    rawOutput,
                    null,
                    2
                  )
                : "Raw investigation output is not available for this investigation."}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
/* ============================================================
   HEALTH ROW
   ============================================================ */

function HealthRow({
  icon: Icon,
  name,
  status,
  online,
}) {
  return (

    <div className="health-row">

      <div className="health-service">

        <div className="health-icon">

          <Icon
            size={16}
          />

        </div>


        <span>
          {name}
        </span>

      </div>


      <div
        className={`health-status ${
          online
            ? "online"
            : "offline"
        }`}
      >

        <span />

        {status}

      </div>

    </div>
  );
}


/* ============================================================
   USER GUIDE
   ============================================================ */

function UserGuidePage() {

  return (

    <div className="guide-page">

      <div className="guide-container">

        <div className="guide-top">

          <div className="guide-brand">

            <div className="brand-mark">

              <ShieldCheck
                size={23}
              />

            </div>


            <div>

              <strong>
                CyberGuard AI
              </strong>


              <span>
                Security Operations
              </span>

            </div>

          </div>


          <button
            className="guide-back"
            onClick={() =>
              window.close()
            }
          >
            Close Guide
          </button>

        </div>


        <div className="guide-hero">

          <span className="eyebrow">
            USER GUIDE
          </span>


          <h1>
            CyberGuard AI Dashboard Guide
          </h1>


          <p>
            Learn how to select incidents,
            review security logs and
            indicators, manually run
            investigations, and review
            investigation results.
          </p>

        </div>


        <div className="guide-grid">

          <GuideSection
            number="01"
            title="Available Incidents"
            text="Click Available Incidents in the top-right corner to view all incidents currently available from Azure Cosmos DB."
          />


          <GuideSection
            number="02"
            title="Select an Incident"
            text="Click Select Incident inside Manual Investigation. Choose a case to load its data."
          />


          <GuideSection
            number="03"
            title="Review Logs"
            text="The selected incident's security logs are automatically loaded into the Logs panel."
          />


          <GuideSection
            number="04"
            title="Review Indicators"
            text="Threat indicators such as IP addresses, domains, hashes and other IOC data are loaded into the Indicators panel."
          />


          <GuideSection
            number="05"
            title="Run Investigation"
            text="Click Run Investigation to manually submit the incident, logs and indicators to the backend."
          />


          <GuideSection
            number="06"
            title="View Output"
            text="The investigation output appears directly inside the Manual Investigation section."
          />


          <GuideSection
            number="07"
            title="Risk Distribution"
            text="The risk chart displays High, Medium and Low risk incidents."
          />


          <GuideSection
            number="08"
            title="Completed Investigations"
            text="Completed investigations are displayed ten records per page."
          />

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   GUIDE SECTION
   ============================================================ */

function GuideSection({
  number,
  title,
  text,
}) {
  return (

    <div className="guide-section">

      <div className="guide-number">
        {number}
      </div>


      <div>

        <h2>
          {title}
        </h2>


        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   PLACEHOLDER
   ============================================================ */
function SettingsPage({
  darkMode,
  setDarkMode,
}) {

  return (

    <div className="dashboard-placeholder">

      <div className="placeholder-icon">

        <SlidersHorizontal
          size={32}
        />

      </div>


      <h2>
        Appearance Settings
      </h2>


      <p>
        Choose the theme for the application.
      </p>


      <div className="theme-settings">

        <button
          className={
            `theme-option ${
              !darkMode
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            setDarkMode(false)
          }
        >

          <Sun
            size={20}
          />

          <span>
            Light Theme
          </span>

        </button>


        <button
          className={
            `theme-option ${
              darkMode
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            setDarkMode(true)
          }
        >

          <Moon
            size={20}
          />

          <span>
            Dark Theme
          </span>

        </button>

      </div>

    </div>
  );
}


function PlaceholderPage({
  title,
}) {

  return (

    <div className="dashboard-placeholder">

      <div className="placeholder-icon">

        <ShieldCheck
          size={32}
        />

      </div>


      <h2>
        {title}
      </h2>


      <p>
        This module is available
        from the application navigation.
      </p>

    </div>
  );
}


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

function getIncidentId(
  item
) {

  return (
    item?.incident_id ||
    item?.id ||
    item?.investigation_id ||
    ""
  );
}


/* ============================================================
   INCIDENT NAME

   This gives a readable name instead of displaying only
   UUIDs/IDs.
   ============================================================ */

function getIncidentName(
  incident
) {

  if (!incident) {
    return "Security Incident";
  }


  if (incident.name) {
    return String(
      incident.name
    );
  }


  if (
    incident.incident_name
  ) {
    return String(
      incident.incident_name
    );
  }


  if (incident.title) {
    return String(
      incident.title
    );
  }


  const description =
    incident.description ||
    incident.incident ||
    "";


  const text =
    stringifyField(
      description
    ).trim();


  if (!text) {
    return "Security Incident";
  }


  const lower =
    text.toLowerCase();


  if (
    lower.includes(
      "failed login"
    ) ||
    lower.includes(
      "failed logins"
    ) ||
    lower.includes(
      "login attempts"
    )
  ) {
    return "Multiple Failed Login Attempts";
  }


  if (
    lower.includes(
      "brute force"
    )
  ) {
    return "Possible Brute Force Attack";
  }


  if (
    lower.includes(
      "malware"
    )
  ) {
    return "Possible Malware Activity";
  }


  if (
    lower.includes(
      "phishing"
    )
  ) {
    return "Possible Phishing Attack";
  }


  if (
    lower.includes(
      "unauthorized access"
    )
  ) {
    return "Unauthorized Access Attempt";
  }


  if (
    lower.includes(
      "sql injection"
    )
  ) {
    return "Possible SQL Injection";
  }


  if (
    lower.includes(
      "port scan"
    ) ||
    lower.includes(
      "port scanning"
    )
  ) {
    return "Network Port Scanning";
  }


  if (
    lower.includes(
      "suspicious"
    )
  ) {
    return "Suspicious Security Activity";
  }


  const words =
    text.split(
      /\s+/
    );


  const shortName =
    words
      .slice(
        0,
        7
      )
      .join(" ");


  return shortName.length <
    text.length
    ? `${shortName}...`
    : shortName;
}


/* ============================================================
   DESCRIPTION
   ============================================================ */

function getIncidentDescription(
  item
) {

  if (!item) {
    return "Security incident";
  }


  if (
    item.description
  ) {

    return stringifyField(
      item.description
    );

  }


  if (
    item.incident
  ) {

    return stringifyField(
      item.incident
    );

  }


  if (
    item.findings
  ) {

    if (
      Array.isArray(
        item.findings
      )
    ) {

      return item.findings.join(
        ", "
      );

    }


    return stringifyField(
      item.findings
    );

  }


  return "Security incident";
}


/* ============================================================
   STRINGIFY
   ============================================================ */

function stringifyField(
  value
) {

  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "";
  }


  if (
    typeof value ===
    "string"
  ) {
    return value;
  }


  try {

    return JSON.stringify(
      value,
      null,
      2
    );

  } catch {

    return String(
      value
    );

  }
}


/* ============================================================
   PARSE INPUT
   ============================================================ */

function parseInput(
  value
) {

  if (
    !value?.trim()
  ) {
    return "";
  }


  try {

    return JSON.parse(
      value
    );

  } catch {

    return value;

  }
}


/* ============================================================
   COUNT ITEMS
   ============================================================ */

function countItems(
  value
) {

  if (!value) {
    return 0;
  }


  if (
    Array.isArray(
      value
    )
  ) {
    return value.length;
  }


  if (
    typeof value ===
    "object"
  ) {

    return Object.keys(
      value
    ).length;

  }


  if (
    typeof value ===
    "string"
  ) {

    const trimmed =
      value.trim();


    if (!trimmed) {
      return 0;
    }


    try {

      const parsed =
        JSON.parse(
          trimmed
        );


      if (
        Array.isArray(
          parsed
        )
      ) {
        return parsed.length;
      }


      if (
        typeof parsed ===
          "object" &&
        parsed !== null
      ) {

        return Object.keys(
          parsed
        ).length;

      }

    } catch {
      // Plain text.
    }


    return trimmed
      .split("\n")
      .filter(
        (line) =>
          line.trim()
            .length > 0
      ).length;

  }


  return 1;
}


/* ============================================================
   EXECUTED INCIDENT CHECK
   ============================================================ */

function isIncidentExecuted(item, investigations) {
  const itemId = String(getIncidentId(item) || "").trim().toLowerCase();
  const itemText = String(
    item?.incident || item?.description || item?.title || ""
  ).trim().toLowerCase();

  return investigations.some((investigation) => {
    const investigationId = String(
      investigation?.incident_id || investigation?.incidentId || ""
    ).trim().toLowerCase();
    const investigationIncidentId = String(
      investigation?.id || investigation?.investigation_id || ""
    ).trim().toLowerCase();
    const investigationText = String(
      investigation?.incident || investigation?.description || ""
    ).trim().toLowerCase();

    return Boolean(
      (itemId && investigationId && itemId === investigationId) ||
      (itemId && investigationIncidentId && itemId === investigationIncidentId) ||
      (itemText && investigationText && itemText === investigationText)
    );
  });
}


/* ============================================================
   NORMALIZE INCIDENT
   ============================================================ */

function normalizeIncident(
  item
) {

  return {

    ...item,

    incident_id:
      getIncidentId(
        item
      ),


    incident:
      item.incident ||
      item.description ||
      item.title ||
      (
        Array.isArray(
          item.findings
        )
          ? item.findings.join(
              ", "
            )
          : item.findings
      ) ||
      "",


    logs:
      item.logs ??
      item.security_logs ??
      item.log_data ??
      "",


    indicators:
      item.indicators ??
      item.iocs ??
      item.threat_indicators ??
      "",


    risk_level:
      item.risk_level ||
      item.risk_assessment
        ?.risk_level ||
      item.severity ||
      "UNKNOWN",


    risk_score:
      item.risk_score ??
      item.risk_assessment
        ?.risk_score ??
      null,

  };
}


/* ============================================================
   NORMALIZE RISK
   ============================================================ */

function getInvestigationSeverity(
  investigation,
  cosmosIncidents = []
) {
  const directSeverity =
    investigation?.severity ??
    investigation?.triage_result?.severity ??
    investigation?.triage?.severity ??
    investigation?.risk_assessment?.severity;

  if (
    directSeverity !== null &&
    directSeverity !== undefined &&
    String(directSeverity).trim() !== ""
  ) {
    return String(directSeverity).toUpperCase();
  }

  const investigationId = String(
    investigation?.incident_id ??
    investigation?.incidentId ??
    ""
  ).trim().toLowerCase();

  const investigationText = String(
    investigation?.incident ??
    investigation?.description ??
    ""
  ).trim().toLowerCase();

  const matchedIncident =
    cosmosIncidents.find((incident) => {
      const incidentId = String(
        getIncidentId(incident) || ""
      ).trim().toLowerCase();

      const incidentText = String(
        incident?.incident ??
        incident?.description ??
        incident?.title ??
        ""
      ).trim().toLowerCase();

      return Boolean(
        (investigationId &&
          incidentId &&
          investigationId === incidentId) ||
        (investigationText &&
          incidentText &&
          investigationText === incidentText)
      );
    }) || null;

  return (
    matchedIncident?.severity ??
    "UNKNOWN"
  );
}


function normalizeRisk(
  item
) {

  const value =
    String(
      item?.risk_level ||
      item?.risk_assessment
        ?.risk_level ||
      item?.severity ||
      "UNKNOWN"
    ).toUpperCase();


  if (
    value ===
    "CRITICAL"
  ) {
    return "HIGH";
  }


  if (
    value === "HIGH" ||
    value === "MEDIUM" ||
    value === "LOW"
  ) {

    return value;

  }


  return "LOW";
}


/* ============================================================
   COMPLETED STATUS
   ============================================================ */

function isCompleted(
  item
) {

  const status =
    String(
      item?.status ||
        ""
    ).toUpperCase();


  return [
    "COMPLETED",
    "COMPLETE",
    "SUCCESS",
    "SUCCEEDED",
    "DONE",
  ].includes(
    status
  );
}


/* ============================================================
   STATUS FORMAT
   ============================================================ */

function formatStatus(
  status
) {

  if (!status) {
    return "Unknown Status";
  }


  const value =
    String(
      status
    )
      .replace(
        /_/g,
        " "
      )
      .toLowerCase();


  return value.replace(
    /\b\w/g,
    (letter) =>
      letter.toUpperCase()
  );
}


/* ============================================================
   DATE
   ============================================================ */

function getIncidentDate(
  item
) {

  const values = [

    item?.completed_at,

    item?.completedAt,

    item?.updated_at,

    item?.updatedAt,

    item?.created_at,

    item?.createdAt,

    item?.timestamp,

    item?.created_on,

    item?._ts,

  ];


  for (
    const value of
      values
  ) {

    if (
      value !==
        null &&
      value !==
        undefined &&
      value !== ""
    ) {

      const date =
        typeof value ===
          "number" &&
        value <
          100000000000
          ? new Date(
              value *
                1000
            )
          : new Date(
              value
            );


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        return date;

      }

    }

  }


  return null;
}


/* ============================================================
   DATE KEY
   ============================================================ */

function formatDateKey(
  date
) {

  if (!date) {
    return "";
  }


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;
}


/* ============================================================
   SHORT DATE
   ============================================================ */

function formatShortDate(
  date
) {

  if (!date) {
    return "Unknown";
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}


/* ============================================================
   DATE TIME
   ============================================================ */

function formatDateTime(
  date
) {

  if (!date) {
    return "—";
  }


  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


/* ============================================================
   CLOCK ICON
   ============================================================ */

function ClockIcon(
  props
) {

  return (

    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <circle
        cx="12"
        cy="12"
        r="9"
      />


      <polyline
        points="12 7 12 12 15 14"
      />

    </svg>
  );
}


/* ============================================================
   EXPORT
   ============================================================ */

export default App;