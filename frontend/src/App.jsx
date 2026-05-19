import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await fetch(
        "https://webpage-summarizer-ai.onrender.com/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      console.log(data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult("Failed to fetch backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">
        Web Page Summarizer AI
      </h1>

      <input
        type="text"
        placeholder="Enter webpage URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-2xl p-4 rounded-lg text-black outline-none"
      />

      <button
        onClick={handleSummarize}
        className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {result && (
        <div className="mt-8 w-full max-w-3xl bg-gray-900 p-6 rounded-lg whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}

export default App;