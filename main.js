const toast = document.getElementById("drawer-toast");
const upgradeButtons = document.querySelectorAll("[data-upgrade]");
const drawer = document.getElementById("upgrade-drawer");
const overlay = document.querySelector(".drawer-overlay");
const closeButtons = document.querySelectorAll("[data-drawer-close]");
const form = document.getElementById("upgrade-form");
const lemonSqueezyCheckoutUrl = "";

const showToast = () => {
  if (!toast) return;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
};

const openDrawer = () => {
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  const input = drawer.querySelector("input[type='email']");
  if (input) input.focus();
};

const closeDrawer = () => {
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
};

upgradeButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    openDrawer();
  });
});

closeButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    closeDrawer();
  });
});

if (overlay) {
  overlay.addEventListener("click", () => closeDrawer());
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (lemonSqueezyCheckoutUrl) {
      window.location.href = lemonSqueezyCheckoutUrl;
      return;
    }
    showToast();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

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
