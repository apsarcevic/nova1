const toast = document.getElementById("cta-toast");
const upgradeCta = document.getElementById("upgrade-cta");

const showToast = () => {
  if (!toast) return;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
};

if (upgradeCta) {
  upgradeCta.addEventListener("click", (event) => {
    if (upgradeCta.getAttribute("href") === "#") {
      event.preventDefault();
      showToast();
    }
  });
}

document.querySelectorAll("[data-scroll]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
