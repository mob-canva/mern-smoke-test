import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const load = () => fetch("/api/notes").then(r => r.json()).then(setNotes);
  useEffect(() => { load(); }, []);
  const add = async () => {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    load();
  };
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 500 }}>
      <h1>MERN smoke test</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="note" />
      <button onClick={add}>add</button>
      <ul>{notes.map(n => <li key={n._id}>{n.text}</li>)}</ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
