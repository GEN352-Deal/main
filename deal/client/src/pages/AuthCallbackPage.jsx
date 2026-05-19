import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./LoginPage.css"; // reuse same styles

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("การยืนยันตัวตนถูกยกเลิก กรุณาลองใหม่อีกครั้ง");
      return;
    }

    if (!code) {
      setError("ไม่พบรหัสยืนยัน กรุณาลองใหม่อีกครั้ง");
      return;
    }

    // Exchange code → token via our backend
    fetch("/api/auth/thaid/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth failed");
        return res.json();
      })
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch(() => {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      });
  }, [searchParams, navigate]);

  return (
    <div className="login-root login-root--visible">
      <div className="login-blob login-blob--pink" />
      <div className="login-blob login-blob--purple" />

      <div className="login-card" style={{ gap: "16px" }}>
        {error ? (
          <>
            <div style={{ fontSize: 40 }}>⚠️</div>
            <h2 style={{ color: "#fff", margin: 0, fontFamily: "Space Mono, monospace" }}>
              เกิดข้อผิดพลาด
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", margin: 0 }}>
              {error}
            </p>
            <button
              className="login-btn"
              style={{ marginBottom: 0 }}
              onClick={() => navigate("/login", { replace: true })}
            >
              กลับหน้าเข้าสู่ระบบ
            </button>
          </>
        ) : (
          <>
            <span className="login-btn-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>
              กำลังยืนยันตัวตน...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
