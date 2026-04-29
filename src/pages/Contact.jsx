export default function Contact() {
  return (
    <div style={{padding:"60px",maxWidth:"1000px",margin:"auto"}}>
      <h1>Contact Us</h1>

      <p>Email: info@danonews.com</p>
      <p>Phone: +233 XX XXX XXXX</p>
      <p>Location: Accra, Ghana</p>

      <div style={{marginTop:"30px"}}>
        <input
          placeholder="Your Name"
          style={{
            width:"100%",
            padding:"14px",
            marginBottom:"15px"
          }}
        />

        <input
          placeholder="Your Email"
          style={{
            width:"100%",
            padding:"14px",
            marginBottom:"15px"
          }}
        />

        <textarea
          rows="6"
          placeholder="Your Message"
          style={{
            width:"100%",
            padding:"14px"
          }}
        />

        <button
          style={{
            marginTop:"15px",
            padding:"14px 20px",
            background:"#0d47a1",
            color:"#fff",
            border:"none",
            borderRadius:"8px"
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}