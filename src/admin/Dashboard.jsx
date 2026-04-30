import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");

  async function publishPost() {
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content
      }
    ]);

    if(error){
      alert(error.message);
    } else {
      alert("News published successfully");
      setTitle("");
      setContent("");
    }
  }

  return (
    <div style={{
      padding:"40px",
      maxWidth:"900px",
      margin:"auto"
    }}>
      <h1>DanoNews Admin Dashboard</h1>

      <input
        placeholder="Headline"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        style={{
          width:"100%",
          padding:"12px",
          marginBottom:"15px"
        }}
      />

      <textarea
        placeholder="Full Article"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        rows="10"
        style={{
          width:"100%",
          padding:"12px",
          marginBottom:"15px"
        }}
      />

      <button
        onClick={publishPost}
        style={{
          background:"#dc2626",
          color:"white",
          border:"none",
          padding:"14px 20px"
        }}
      >
        Publish News
      </button>
    </div>
  );
}