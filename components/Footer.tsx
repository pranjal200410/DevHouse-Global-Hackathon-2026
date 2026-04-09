export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-12 py-6"
      style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-xs" style={{ color: "rgba(248,249,251,0.28)" }}>
        Subscription Cancellation Guarantee
      </span>
      <span className="text-xs" style={{ color: "rgba(248,249,251,0.28)" }}>
        Built by{" "}
        <span style={{ color: "#5DCAA5" }}>
          pranjal · bhavani · yashaswini · vishwas
        </span>
      </span>
    </footer>
  );
}
