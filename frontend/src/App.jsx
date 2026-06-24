import { useState } from "react";
import axios from "axios";
import "./App.css";
import TreeView from "./components/TreeView";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const data = input
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const res = await axios.post(
        "https://bajaj-oa1-api.onrender.com/bfhl",
        { data }
      );

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to call API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Hierarchy Analyzer</h1>
      <p className="subtitle">
        Analyze relationships, detect cycles, and visualize trees
      </p>

      <div className="input-card">
        <textarea
          rows="8"
          placeholder={`Enter one relationship per line

A->B
A->C
B->D`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Analyze
        </button>
      </div>

      {loading && <p>Processing...</p>}

      {error && <p className="error">{error}</p>}

      {response && (
        <>
          <div className="grid">
            <div className="card">
              <h2>Summary</h2>

              <p>
                Trees: {response.summary.total_trees}
              </p>

              <p>
                Cycles: {response.summary.total_cycles}
              </p>

              <p>
                Largest Root: {response.summary.largest_tree_root || "N/A"}
              </p>
            </div>

            <div className="card">
              <h2>User</h2>

              <p>{response.user_id}</p>
              <p>{response.email_id}</p>
              <p>{response.college_roll_number}</p>
            </div>
          </div>

          <div className="card">
            <h2>Invalid Entries</h2>

            {response.invalid_entries.length === 0 ? (
              <p>None</p>
            ) : (
              response.invalid_entries.map((item) => (
                <div key={item}>{item}</div>
              ))
            )}
          </div>

          <div className="card">
            <h2>Duplicate Edges</h2>

            {response.duplicate_edges.length === 0 ? (
              <p>None</p>
            ) : (
              response.duplicate_edges.map((item) => (
                <div key={item}>{item}</div>
              ))
            )}
          </div>

          <div className="card">
            <h2>Hierarchies</h2>

            {response.hierarchies.map((hierarchy) => (
              <div
                key={hierarchy.root}
                style={{ marginBottom: "20px" }}
              >
                <h3>
                  Root: {hierarchy.root}
                </h3>

                {"has_cycle" in hierarchy ? (
                  <p>Cycle Detected</p>
                ) : (
                  <>
                    <p>Depth: {hierarchy.depth}</p>
                    <TreeView tree={hierarchy.tree} />
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;