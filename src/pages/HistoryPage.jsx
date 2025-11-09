import React, { useEffect, useState } from "react";
import { listActivities } from "../utils/storage";

export default function HistoryPage({ user }) {
  const [nameFilter, setNameFilter] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchActs() {
      setLoading(true);
      setError("");
      try {
        const resp = await listActivities({ sort, limit: 50 });
        if (!mounted) return;
        // resp expected { data: [], meta: {} } or an array depending on API
        setActs(resp.data || resp);
      } catch (e) {
        setError(e.message || "Failed to load activities");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchActs();
    return () => {
      mounted = false;
    };
  }, [sort]);

  const filtered = acts
    .filter((a) =>
      nameFilter
        ? (a.name || "").toLowerCase().includes(nameFilter.toLowerCase())
        : true
    )
    .filter((a) => (user ? true : true))
    .sort((a, b) =>
      sort === "date_desc"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    );

  return (
    <div>
      <h2>Activity History</h2>
      <div className="filters">
        <input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date_desc">Date (new→old)</option>
          <option value="date_asc">Date (old→new)</option>
        </select>
      </div>

      {loading && <div className="empty">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="list card">
        {filtered.length === 0 && !loading && (
          <div className="empty">No activities</div>
        )}
        {filtered.map((a, idx) => (
          <div className="activity-row" key={idx}>
            <div className="activity-main">
              <div className="activity-title">{a.name}</div>
              <div className="activity-meta">
                <span
                  className={`badge badge-activity badge-activity-${a.type}`}
                >
                  {a.type}
                </span>
                <span className="activity-by">By: {a.user}</span>
              </div>
            </div>
            <div className="activity-time">
              {new Date(a.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
