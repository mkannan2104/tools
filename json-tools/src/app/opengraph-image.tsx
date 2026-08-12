import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "JSON Tools — Free online JSON utilities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #ffffff 0%, #eef0ff 55%, #f8fafc 100%)",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 42,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.03em",
          }}
        >
          JSON <span style={{ color: "#492ffb", marginLeft: 12 }}>Tools</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Free online JSON utilities for developers
          </div>
          <div style={{ fontSize: 28, color: "#475569", maxWidth: 820 }}>
            Format, validate, minify, convert, and more — locally in your browser.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#64748b" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
