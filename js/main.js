(() => {
  "use strict";

  const config = window.MUONITY_CONFIG || {};
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#primary-menu");
  const mobile = window.matchMedia("(max-width: 820px)");

  function setMenu(open, restoreFocus = false) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menu.classList.toggle("is-open", open);
    if (restoreFocus) toggle.focus();
  }

  header.classList.add("has-menu");
  toggle.hidden = !mobile.matches;
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", event => {
    const link = event.target.closest("a[href^='#']");
    if (!link || !mobile.matches) return;
    setMenu(false);
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!header.contains(document.activeElement)) setMenu(false);
    });
  });
  mobile.addEventListener("change", () => {
    if (!mobile.matches && document.activeElement === toggle) menu.querySelector("a").focus();
    toggle.hidden = !mobile.matches;
    setMenu(false);
  });

  function httpsUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password ? url : null;
    } catch { return null; }
  }

  document.querySelectorAll("[data-game]").forEach(card => {
    const url = httpsUrl(config.games?.[card.dataset.game]?.googlePlayUrl);
    const content = card.querySelector(".game-card-content");
    const available = !!url && url.hostname === "play.google.com" && url.pathname === "/store/apps/details" && !!url.searchParams.get("id");
    const element = document.createElement(available ? "a" : "div");
    const title = card.querySelector("h3").textContent;
    element.className = content.className;
    if (available) {
      element.href = url.href;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      element.setAttribute("aria-label", `Get ${title} on Google Play (opens in a new tab)`);
    }
    element.append(...content.childNodes);
    content.replaceWith(element);
    card.classList.toggle("is-linked", available);
    const badge = card.querySelector(".store-availability");
    badge.classList.toggle("is-unavailable", !available);
    if (available) {
      badge.removeAttribute("aria-disabled");
      badge.removeAttribute("aria-label");
      badge.removeAttribute("role");
      card.removeAttribute("aria-describedby");
    } else {
      badge.setAttribute("role", "group");
      badge.setAttribute("aria-disabled", "true");
      badge.setAttribute("aria-label", `${title} on Google Play — coming soon`);
    }
    const note = card.querySelector("[data-release-label]");
    note.textContent = available ? "" : "Coming soon";
    note.setAttribute("aria-hidden", String(available));
  });

  if (typeof config.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    document.querySelectorAll("[data-contact-email]").forEach(link => {
      link.textContent = config.email;
      link.href = `mailto:${config.email}`;
    });
  }

  const icons = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M14 22V13h3l.6-4H14V7c0-1.2.4-2 2-2h2V1.4A22 22 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9"/>',
    x: '<path d="m3 3 14 18h4L7 3Zm0 18 7-8m4-2 7-8"/>',
  };
  const labels = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", x: "X" };
  const socials = document.querySelector("[data-social-links]");
  socials.replaceChildren();
  Object.entries(labels).forEach(([key, label]) => {
    const url = httpsUrl(config.socials?.[key]);
    if (!url) return;
    const link = document.createElement("a");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${label} (opens in a new tab)`);
    link.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
    socials.append(link);
  });
  socials.hidden = !socials.childElementCount;
})();
