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

  /* =========================
     TEXT EDITOR
  ========================= */
  function exec(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }

  /* =========================
     OPEN IMAGE PICKER
  ========================= */
  function openUpload() {
    fileRef.current.click();
  }

  /* =========================
     IMAGE UPLOAD - IMPROVED
  ========================= */
  async function uploadImage(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("❌ File size too large. Max 5MB allowed.");
        return;
      }

      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log("Uploading to bucket: news-images | File:", fileName);

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        alert("Upload failed: " + uploadError.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      console.log("Public URL:", publicUrl);

      setImage(publicUrl);

      if (editorRef.current) {
        editorRef.current.innerHTML += `
          <p>
            <img 
              src="${publicUrl}" 
              alt="${title || "News image"}"
              style="max-width:100%; border-radius:12px; margin:20px 0;"
            />
          </p>
        `;
      }

      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Image upload failed. Check console for details.");
    }
  }

  /* =========================
     PUBLISH ARTICLE
  ========================= */
  async function publishPost() {
    try {
      const body = editorRef.current?.innerHTML || "";

      if (!title.trim()) {
        alert("❌ Title is required");
        return;
      }
      if (!body || body.trim() === "<p><br></p>") {
        alert("❌ Please write some content");
        return;
      }
      if (!image) {
        alert("❌ Featured image is required");
        return;
      }

      setLoading(true);

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const { error } = await supabase.from("posts").insert([
        {
          title: title.trim(),
          cat: cat,
          body: body,
          content: body,
          image_art: image,
          image: image,
          sponsored: sponsored,
          writer: "DanoNews Staff",
          slug: slug,
          status: "published",
          views: 0,
          is_breaking: false,
        },
      ]);

      setLoading(false);

      if (error) {
        console.error(error);
        alert("Error: " + error.message);
        return;
      }

      alert("✅ Article Published Successfully!");

      setTitle("");
      setImage("");
      setCat("News");
      setSponsored(false);
      if (editorRef.current) editorRef.current.innerHTML = "";
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* SIDEBAR */}
      <div style={{ background: "#fff", borderRight: "1px solid #eee", padding: "30px 20px" }}>
        <h2 style={{ color: "#e00000", fontSize: "34px", marginBottom: "30px" }}>DanoCMS</h2>
        {["Dashboard", "Create", "Content Library", "Categories", "Analytics", "Monetization", "Settings"].map((item, i) => (
          <div
            key={item}
            style={{
              padding: "14px",
              marginTop: "8px",
              borderRadius: "8px",
              background: i === 1 ? "#fff0f0" : "transparent",
              color: i === 1 ? "#e00000" : "#333",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ padding: "35px" }}>
        <div style={{ background: "#fff", borderRadius: "14px", padding: "30px" }}>
          <h2 style={{ color: "#0d2b6b", marginBottom: "20px" }}>Create Article</h2>

          <input placeholder="Add title..." value={title} onChange={(e) => setTitle(e.target.value)} style={input} />

          <div style={{ display: "flex", gap: "10px", margin: "15px 0 10px", flexWrap: "wrap" }}>
            <button type="button" style={toolbarBtn} onClick={() => exec("bold")}>Bold</button>
            <button type="button" style={toolbarBtn} onClick={() => exec("italic")}>Italic</button>
            <button type="button" style={toolbarBtn} onClick={() => exec("underline")}>Underline</button>
            <button type="button" style={toolbarBtn} onClick={() => exec("insertUnorderedList")}>Bullet List</button>
          </div>

          <div ref={editorRef} contentEditable suppressContentEditableWarning style={editorStyle} />

          <input placeholder="Featured image URL..." value={image} onChange={(e) => setImage(e.target.value)} style={input} />

          <button type="button" style={grey} onClick={openUpload}>Upload Image</button>

          <input type="file" ref={fileRef} hidden accept="image/*" onChange={uploadImage} />

          <select value={cat} onChange={(e) => setCat(e.target.value)} style={input}>
            <option>News</option>
            <option>Politics</option>
            <option>Sports</option>
            <option>Business</option>
            <option>Entertainment</option>
            <option>World</option>
          </select>

          <div style={{ marginTop: "18px", padding: "14px", background: "#fff8e8", borderRadius: "8px", border: "1px solid #ffe2a8" }}>
            <label style={{ display: "flex", gap: "10px", alignItems: "center", fontWeight: "700" }}>
              <input type="checkbox" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} />
              Mark as Sponsored Post
            </label>
          </div>

          <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" style={blue} onClick={publishPost} disabled={loading}>
              {loading ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= STYLES ========================= */
const input = { width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "15px", fontSize: "16px" };
const grey = { padding: "12px 22px", border: "none", background: "#eef1f5", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" };
const blue = { padding: "12px 22px", border: "none", background: "#2d6df6", color: "#fff", borderRadius: "8px", fontWeight: "700", cursor: "pointer" };
const toolbarBtn = { padding: "10px 16px", border: "1px solid #ddd", background: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const editorStyle = { minHeight: "350px", border: "1px solid #eee", borderRadius: "10px", padding: "20px", outline: "none", fontSize: "18px", lineHeight: "1.8", marginTop: "15px" };