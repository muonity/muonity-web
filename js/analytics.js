(() => {
  "use strict";
  if (window.muonityAnalyticsInitialized) return;
  window.muonityAnalyticsInitialized = true;

  const MEASUREMENT_ID = "G-JF7S6KW832";
  const STORAGE_KEY = "muonity.analytics-consent.v1";
  const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`;
  // Local files, localhost and preview hosts never send visits to the live property.
  const isProduction = location.protocol === "https:" && ["muonity.com", "www.muonity.com"].includes(location.hostname);
  const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  const panel = document.querySelector("#analytics-consent");
  const settings = document.querySelector(".privacy-settings");
  const current = document.querySelector("[data-consent-current]");
  const feedback = document.querySelector("[data-consent-feedback]");
  const replaceHistory = history.replaceState.bind(history);
  let preference = null;
  let storageAvailable = true;
  let requested = false;
  let configured = false;
  let expiryTimer;
  let returnFocus = null;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window[DISABLE_KEY] = true;
  // This queue exists locally before any Google script, config or event can run.
  window.gtag("consent", "default", { ...denied });

  function readPreference() {
    let raw;
    try { raw = localStorage.getItem(STORAGE_KEY); }
    catch { storageAvailable = false; return null; }
    try {
      const saved = JSON.parse(raw);
      if (saved?.version === 1 && ["granted", "denied"].includes(saved.analytics) &&
          Number.isFinite(saved.updatedAt) && saved.updatedAt <= Date.now() &&
          Date.now() - saved.updatedAt < CONSENT_LIFETIME) return saved;
    } catch { /* An invalid record is not consent; a later choice can replace it. */ }
    return null;
  }

  function clearAnalyticsCookies() {
    // Delete only this site's GA identifiers, at host and parent-domain scope.
    const names = ["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`];
    const domains = ["", location.hostname, `.${location.hostname}`, "muonity.com", ".muonity.com"];
    for (const name of names) {
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      }
    }
  }

  function hasConsent() {
    return preference?.analytics === "granted" && Date.now() - preference.updatedAt < CONSENT_LIFETIME;
  }

  function prepareMeasurementUrl() {
    // This static page has no query-driven features. Enhanced Measurement's
    // site-search/history detectors read the browser URL, not just page_location.
    const hash = /^#[a-zA-Z0-9_-]+$/.test(location.hash) && document.getElementById(location.hash.slice(1)) ? location.hash : "";
    const clean = location.origin + location.pathname + hash;
    if (clean !== location.href) {
      try { replaceHistory(history.state, "", clean); }
      catch { return false; }
    }
    return true;
  }

  function loadAnalytics() {
    if (!isProduction || !hasConsent() || window[DISABLE_KEY] || requested) return;
    requested = true;
    if (!configured) {
      configured = true;
      // No arbitrary URL query/hash values or full referrer paths are collected.
      let referrer = "";
      try { referrer = new URL(document.referrer).origin + "/"; } catch { /* Direct visit. */ }
      // Override automatic user-provided data collection in Google tag settings.
      window.gtag("set", "user_data", null);
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, {
        // Use only the known canonical pages, never arbitrary path/query input.
        page_location: document.querySelector('link[rel="canonical"]')?.href === "https://muonity.com/privacy/"
          ? "https://muonity.com/privacy/" : "https://muonity.com/",
        page_referrer: referrer,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        user_data: null,
        cookie_domain: location.hostname,
        cookie_path: "/",
        cookie_expires: CONSENT_LIFETIME / 1000,
        cookie_update: false,
        cookie_flags: "SameSite=Lax;Secure"
      });
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.id = "muonity-google-tag";
    script.onerror = () => {
      requested = false;
      script.remove();
      // A later explicit Allow can retry. Keep the single config already queued.
    };
    document.head.append(script);
  }

  function describeChoice() {
    current.textContent = hasConsent() ? "Analytics is currently allowed." :
      preference?.analytics === "denied" ? "Analytics is currently declined." : "Analytics is off until you allow it.";
  }

  function openPanel(fromSettings = false) {
    describeChoice();
    panel.hidden = false;
    settings.setAttribute("aria-expanded", "true");
    if (fromSettings) {
      returnFocus = document.activeElement;
      panel.focus({ preventScroll: true });
    }
  }

  function closePanel() {
    const focusWasInside = panel.contains(document.activeElement);
    panel.hidden = true;
    settings.setAttribute("aria-expanded", "false");
    if (focusWasInside) (returnFocus || settings).focus({ preventScroll: true });
    returnFocus = null;
  }

  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    if (!preference) return;
    const remaining = preference.updatedAt + CONSENT_LIFETIME - Date.now();
    expiryTimer = setTimeout(() => {
      if (Date.now() - preference.updatedAt >= CONSENT_LIFETIME) {
        applyPreference(null);
        openPanel();
      } else scheduleExpiry();
    }, Math.min(Math.max(remaining, 0), 2147483647));
  }

  function applyPreference(value) {
    preference = value;
    // The opt-out flag also stops an already loaded tag after consent withdrawal.
    window[DISABLE_KEY] = !hasConsent() || !isProduction || !prepareMeasurementUrl();
    window.gtag("consent", "update", { ...denied, analytics_storage: hasConsent() ? "granted" : "denied" });
    if (hasConsent()) loadAnalytics();
    else clearAnalyticsCookies();
    describeChoice();
    scheduleExpiry();
  }

  function choose(analytics) {
    const value = { version: 1, analytics, updatedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    applyPreference(value);
    closePanel();
    feedback.textContent = `${analytics === "granted" ? "Analytics allowed." : "Analytics declined."} ${storageAvailable ? "You can change your choice in Privacy settings." : "Browser storage is unavailable; your choice applies to this page only."}`;
  }

  settings.hidden = false;
  settings.addEventListener("click", () => openPanel(true));
  panel.querySelector(".consent-close").addEventListener("click", closePanel);
  panel.querySelectorAll("[data-consent-choice]").forEach(button => {
    button.addEventListener("click", () => choose(button.dataset.consentChoice));
  });
  panel.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closePanel(); }
  });

  // One delegated listener per event type survives main.js replacing card links.
  // Register future released games here only after their real store URL exists.
  const gameEvents = {
    retroStackAttack: {
      name: "retro_stack_attack_google_play_click",
      appId: "com.lukaspokorny.retrostackattack",
      game: "retro_stack_attack"
    }
  };
  function trackBadge(event) {
    if (!event.isTrusted || !hasConsent() || !isProduction || window[DISABLE_KEY]) return;
    if ((event.type === "click" && event.button !== 0) || (event.type === "auxclick" && event.button !== 1)) return;
    const link = event.target.closest("a.game-card-content");
    if (!link) return;
    // Pointer clicks are specific to the badge; Enter activates its parent link.
    if (!event.target.closest(".store-badge") && !(event.type === "click" && event.detail === 0 && event.target === link)) return;
    const game = gameEvents[link.closest("[data-game]")?.dataset.game];
    if (!game) return;
    const url = new URL(link.href);
    if (url.origin !== "https://play.google.com" || url.pathname !== "/store/apps/details" || url.searchParams.get("id") !== game.appId) return;
    window.gtag("event", game.name, { send_to: MEASUREMENT_ID, game: game.game, destination: "google_play" });
  }
  document.addEventListener("click", trackBadge);
  document.addEventListener("auxclick", trackBadge);

  // Normalize old history entries before the Google tag's history listeners run.
  function protectHistoryUrl() {
    if (isProduction && hasConsent() && !prepareMeasurementUrl()) window[DISABLE_KEY] = true;
  }
  window.addEventListener("popstate", protectHistoryUrl, true);
  window.addEventListener("hashchange", protectHistoryUrl, true);

  function restoreChoice() {
    if (!storageAvailable) return;
    const value = readPreference();
    if (JSON.stringify(value) === JSON.stringify(preference)) return;
    applyPreference(value);
    if (!value) openPanel();
  }
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === null) restoreChoice();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") restoreChoice();
  });

  applyPreference(readPreference());
  if (!preference) openPanel();
})();
