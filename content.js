chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_TOAST") {
    showToast(msg.message);
  }
});

function showToast(message) {
  if (!document.body) {
    console.warn("Toast cannot be shown: document.body not available");
    return;
  }

  const toast = document.createElement("div");

  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#1F2937",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 999999,
    opacity: "0",
    transform: "translateY(10px)",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, 2000);
}