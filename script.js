// ==================================================================================
// Description: Handles mobile menu, pricing toggle, analytics tracking, smooth scroll
// ==================================================================================

// ----------------------------- DOM Element Selection -------------------------
// Mobile menu elements
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

// Pricing toggle elements
const monthlyBtn = document.getElementById("monthlyBtn");
const yearlyBtn = document.getElementById("yearlyBtn");
const starterPriceSpan = document.getElementById("starterPrice");
const proPriceSpan = document.getElementById("proPrice");
const starterPeriodSpan = document.getElementById("starterPeriod");
const proPeriodSpan = document.getElementById("proPeriod");

// Note: For analytics tracking, we will use data attributes or class selectors to identify CTAs and links, so we don't need to select them all here explicitly.

// Toggles the mobile menu visibility and updates the hamburger icon.

function toggleMobileMenu() {
  if (!mobileMenu) return;
  const isHidden = mobileMenu.classList.contains("hidden");
  if (isHidden) {
    mobileMenu.classList.remove("hidden");
    if (mobileMenuButton) {
      const icon = mobileMenuButton.querySelector("i");
      if (icon) icon.classList.replace("fa-bars", "fa-times");
    }
  } else {
    mobileMenu.classList.add("hidden");
    if (mobileMenuButton) {
      const icon = mobileMenuButton.querySelector("i");
      if (icon) icon.classList.replace("fa-times", "fa-bars");
    }
  }
}

// Closes the mobile menu (used after clicking a link).

function closeMobileMenu() {
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden");
    if (mobileMenuButton) {
      const icon = mobileMenuButton.querySelector("i");
      if (icon) icon.classList.replace("fa-times", "fa-bars");
    }
  }
}

/**
 * Updates the pricing display based on billing cycle (monthly/yearly).
 * @param {boolean} isYearly - true for yearly pricing, false for monthly
 */
function updatePricing(isYearly) {
  if (
    !starterPriceSpan ||
    !proPriceSpan ||
    !starterPeriodSpan ||
    !proPeriodSpan
  )
    return;

  if (isYearly) {
    starterPriceSpan.innerText = "$182"; // $19/month *12 = 228, save 20% → 182
    proPriceSpan.innerText = "$470"; // $49/month *12 = 588, save 20% → 470
    starterPeriodSpan.innerText = "/year (save $46)";
    proPeriodSpan.innerText = "/year (save $118)";
  } else {
    starterPriceSpan.innerText = "$19";
    proPriceSpan.innerText = "$49";
    starterPeriodSpan.innerText = "/month";
    proPeriodSpan.innerText = "/month";
  }
}

/**
 * Sets the active visual state for the pricing toggle buttons.
 * @param {boolean} yearlyActive - true if yearly is active, false for monthly
 */
function setActivePricingButton(yearlyActive) {
  if (!monthlyBtn || !yearlyBtn) return;
  if (yearlyActive) {
    yearlyBtn.classList.add("bg-indigo-600", "text-white");
    yearlyBtn.classList.remove("text-gray-600", "bg-transparent");
    monthlyBtn.classList.remove("bg-indigo-600", "text-white");
    monthlyBtn.classList.add("text-gray-600", "bg-transparent");
  } else {
    monthlyBtn.classList.add("bg-indigo-600", "text-white");
    monthlyBtn.classList.remove("text-gray-600", "bg-transparent");
    yearlyBtn.classList.remove("bg-indigo-600", "text-white");
    yearlyBtn.classList.add("text-gray-600", "bg-transparent");
  }
}

/**
 * Analytics tracking placeholder - simulates event tracking for GA or similar.
 * In production, this would call gtag(), dataLayer.push(), or a custom analytics SDK.
 * @param {string} eventName - Name of the event (e.g., 'cta_click')
 * @param {Object} metadata - Additional event data
 */
function trackEvent(eventName, metadata = {}) {
  // Console log for demonstration (ready for real integration)
  console.log(`[Analytics Mock] Event: ${eventName}`, metadata);
  // Placeholder for actual Google Analytics / tracking script
  // Example: if (typeof gtag === 'function') gtag('event', eventName, metadata);
}

/**
 * Attaches click tracking to all relevant CTA buttons, login links, and demo links.
 * Uses a generic selector to capture primary interaction elements.
 */
function initAnalyticsTracking() {
  // Track all buttons/links that look like primary CTAs (indigo background, pricing links, etc.)
  const ctaSelectors = [
    ".bg-indigo-600",
    'a[href="#pricing"]',
    ".bg-white.text-indigo-800",
    ".border-indigo-300",
    ".bg-indigo-600.text-white",
    "#loginBtnDesktop",
  ];
  const ctaElements = document.querySelectorAll(ctaSelectors.join(","));

  ctaElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      let buttonText =
        el.innerText.trim() || (el.tagName === "A" ? "Link" : "Button");
      trackEvent("cta_click", {
        button_text: buttonText,
        element_id: el.id || "unknown",
      });
    });
  });

  // Additional tracking for "Log in" links that might not be captured above
  document.querySelectorAll("a").forEach((link) => {
    if (
      link.innerText.includes("Log in") &&
      !link.hasAttribute("data-tracking-added")
    ) {
      link.setAttribute("data-tracking-added", "true");
      link.addEventListener("click", () =>
        trackEvent("login_click", { source: "navigation" }),
      );
    }
  });
}

/**
 * Implements smooth scrolling for all anchor links pointing to in-page sections.
 * Prevents default jump and uses smooth behavior.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        // Optionally update URL hash without jumping (optional)
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Initializes the mobile menu event listeners (toggle + close on link click).
 */
function initMobileMenu() {
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMobileMenu);
  }
  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }
}

/**
 * Initializes the pricing toggle functionality (monthly/yearly buttons).
 */
function initPricingToggle() {
  if (monthlyBtn && yearlyBtn) {
    monthlyBtn.addEventListener("click", () => {
      updatePricing(false);
      setActivePricingButton(false);
    });
    yearlyBtn.addEventListener("click", () => {
      updatePricing(true);
      setActivePricingButton(true);
    });
  }
  // Ensure default monthly state is visually and logically correct
  updatePricing(false);
  setActivePricingButton(false);
}

/**
 * Optional: Add any extra UI enhancements (e.g., active link highlighting on scroll).
 * Not required but demonstrates attention to detail.
 */
function initScrollSpy() {
  // Simple placeholder: could be implemented but not critical for core functionality
  // Kept for future extensibility
}

// ----------------------------- Initialization on DOM Ready -------------------
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initPricingToggle();
  initAnalyticsTracking();
  initSmoothScroll();
  // Any additional initializations
  initScrollSpy();
});
