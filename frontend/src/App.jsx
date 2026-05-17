import { useState } from "react";

function App() {

  const [url, setUrl] = useState("");

  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const handleSummarize = async () => {

    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {

      setLoading(true);

      setError("");

      setSummary("");

      const response = await fetch(
        "http://127.0.0.1:5000/summarize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: url,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }

    } catch (err) {

      setError("Something went wrong");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div style={{ padding: "40px" }}>

      <h1>Web Page Summarizer AI</h1>

      <input
        type="text"
        placeholder="Enter webpage URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "400px",
          padding: "10px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleSummarize}>
        Summarize
      </button>

      <br />
      <br />

      {loading && <p>Generating summary...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {summary && (
        <div>
          <h2>Summary</h2>

          <p>{summary}</p>
        </div>
      )}

    </div>
  );
}

export default App;