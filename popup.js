document.addEventListener("DOMContentLoaded", () => {
  const summary = document.getElementById("summary");
  const bars = document.getElementById("bars");

  chrome.storage.local.get(["usage"], (res) => {
    const usage = res.usage || {};
    const values = Object.values(usage).map(sec => Math.floor(sec / 60));

    const total = values.reduce((a, b) => a + b, 0);
    const productive = Math.floor(total * 0.6);
    const score = total ? Math.floor((productive / total) * 100) : 0;

    summary.innerHTML = `
      <b>Total:</b> ${total} min<br>
      <b>Productive:</b> ${productive} min<br>
      <b>Score:</b> ${score}%
    `;

    bars.innerHTML = "";
    values.slice(0, 7).forEach(min => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = min * 3 + "px";
      bar.textContent = min;
      bars.appendChild(bar);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.clear(() => location.reload());
  });
});