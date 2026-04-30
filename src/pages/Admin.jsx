// src/pages/Admin.jsx

import { useRef, useState } from "react";
import { supabase } from "../services/supabase";
export default function Admin() {
  const editorRef = useRef(null);
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [cat, setCat] = useState("News");
  const [sponsored, setSponsored] = useState(false);
  const [loading, setLoading] = useState(false);

  function exec(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editorRef.current.focus();
  }

  function openUpload() {
    fileRef.current.click();
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = Date.now() + "-" + file.name;

    const { error } = await supabase.storage
      .from("news-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("news-images")
      .getPublicUrl(fileName);

    const url = data.publicUrl;

    setImage(url);
    exec("insertImage", url);
  }

  async function publishPost() {
    const body = editorRef.current.innerHTML;

    if (!title || !body) {
      alert("Title and content required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("posts").insert([
      {
        title,
        body,
        image,
        cat,
        sponsored
      }
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Published Successfully");

    setTitle("");
    setImage("");
    setSponsored(false);
    editorRef.current.innerHTML = "";
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        background: "#f5f6fa"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          background: "#fff",
          borderRight: "1px solid #eee",
          padding: "30px 20px"
        }}
      >
        <h2 style={{ color: "#e00000", fontSize: "34px" }}>
          DanoCMS
        </h2>

        {[
          "Dashboard",
          "Create",
          "Content Library",
          "Categories",
          "Analytics",
          "Monetization",
          "Settings"
        ].map((item, i) => (
          <div
            key={item}
            style={{
              padding: "14px",
              marginTop: "8px",
              borderRadius: "8px",
              background: i === 1 ? "#fff0f0" : "transparent",
              color: i === 1 ? "#e00000" : "#333",
              fontWeight: "600"
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ padding: "35px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "30px"
          }}
        >
          <h2 style={{ color: "#0d2b6b" }}>
            Create Article
          </h2>

          <input
            placeholder="Add title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />

          {/* EDITOR */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              minHeight: "350px",
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "20px",
              outline: "none",
              fontSize: "18px",
              lineHeight: "1.8",
              marginTop: "15px"
            }}
          />

          <input
            placeholder="Featured image URL..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={input}
          />

          <button style={grey} onClick={openUpload}>
            Upload Image
          </button>

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={uploadImage}
          />

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={input}
          >
            <option>News</option>
            <option>Politics</option>
            <option>Sports</option>
            <option>Business</option>
            <option>Entertainment</option>
            <option>World</option>
          </select>

          {/* SPONSORED */}
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background: "#fff8e8",
              borderRadius: "8px",
              border: "1px solid #ffe2a8"
            }}
          >
            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontWeight: "700"
              }}
            >
              <input
                type="checkbox"
                checked={sponsored}
                onChange={(e) =>
                  setSponsored(e.target.checked)
                }
              />

              Mark as Sponsored Post
            </label>

            <small style={{ color: "#777" }}>
              Paid client content will show Sponsored badges
            </small>
          </div>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <button
              style={blue}
              onClick={publishPost}
            >
              {loading ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "15px"
};

const grey = {
  padding: "12px 22px",
  border: "none",
  background: "#eef1f5",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px"
};

const blue = {
  padding: "12px 22px",
  border: "none",
  background: "#2d6df6",
  color: "#fff",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer"
};