"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  async function submit() {
    const data = input
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const res = await fetch("https://bajaj-oa1-api.onrender.com/bfhl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const json = await res.json();
    setResult(json);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "10px",
          }}
        >
          Hierarchy Analyzer
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Enter one edge per line (Example: A-&gt;B)
        </p>

        <textarea
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`A->B
A->C
B->D`}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />

        <button
          onClick={submit}
          style={{
            marginTop: "15px",
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Analyze Hierarchy
        </button>

        {result && (
          <div
            style={{
              marginTop: "25px",
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>Response</h2>

            <pre
              style={{
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}