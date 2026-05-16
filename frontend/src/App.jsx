import { useState } from "react";

function App(){

  const[url, setUrl]=useState("");
  const[summary, setSummary]=useState("");
  const handleSummarize = async () => {

  try {

    const response = await fetch("http://127.0.0.1:5000/summarize");

    const data = await response.json();

    setSummary(data.summary);

  } catch (error) {

    setSummary("Error connecting to backend.");

  }

};
    return (
    <div style={{
      minHeight:"100vh",
      backgroundColor:"#0f172a",
      color: "white",
      display: "flex",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>

      <div style={{
        width:"500px",
        padding:"30px",
        backgroundColor: "1e293b",
        borderRadius: "10px"
      }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize:"48px",
          lineHeight:"1.2",
        }}>
          AI Webpage Summarizer 
        </h1>
        <input
         type="text"
         placeholder="Paste webpage URL here.."
         value={url}
         onChange={(e)=>setUrl(e.target.value)}
         style={{
           width:"100%",
           padding:"12px",
           borderRadius:"5px",
           border:"none",
           marginBottom:"15px"
          }}
        />
        <button 
        onClick={handleSummarize}
        style={{
          width:"100%",
          padding:"12px",
          backgroundColor:"#3b82f6",
          color:"white",
          border:"none",
          borderRadius:"5px",
          cursor:"pointer",
          fontSize:"16px"
        }}>
          Summarize
        </button>

        <div style={{
          marginTop:"20px",
          backgroundColor:"#334155",
          padding:"15px",
          borderRadius:"5px",
          minHeight:"120px"
        }}>
          {summary}
        </div>
      

      </div>
    </div>

  );
}
export default App;