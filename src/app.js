const SERVICES = [
  {
    name: "Neighborhood Walk",
    description: "A purposeful walk around your favorite local routes.",
    duration: "30 or 60 minutes",
    icon: "↗"
  },
  {
    name: "Puppy Visit",
    description: "A gentle check-in with play, feeding, and a potty break.",
    duration: "20 or 30 minutes",
    icon: "♡"
  },
  {
    name: "Adventure Hike",
    description: "Extra enrichment and fresh air for dogs who love to roam.",
    duration: "60 or 90 minutes",
    icon: "⌁"
  }
];

export function sanitizeText(value) {
  const element = document.createElement("textarea");
  element.innerHTML = String(value ?? "");
  return element.value.replace(/<[^>]*>/g, "").trim();
}

export function validateBookingForm(formData) {
  const errors = {};
  const name = sanitizeText(formData.name);
  const email = sanitizeText(formData.email);
  const service = sanitizeText(formData.service);

  if (!name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!service) errors.service = "Please choose a service.";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function getVisibleServices(query = "") {
  const normalizedQuery = sanitizeText(query).toLowerCase();
  return SERVICES.filter((service) =>
    `${service.name} ${service.description}`.toLowerCase().includes(normalizedQuery)
  );
}

function renderServices(services) {
  const serviceList = document.querySelector("#service-list");
  const emptyState = document.querySelector("#empty-state");
  serviceList.replaceChildren();

  services.forEach((service) => {
    const article = document.createElement("article");
    article.className = "service-card";
    article.innerHTML = `
      <span class="service-icon" aria-hidden="true">${service.icon}</span>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <span class="service-duration">${service.duration}</span>
    `;
    serviceList.append(article);
  });
  emptyState.hidden = services.length > 0;
}

function setFormErrors(errors) {
  document.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  document.querySelectorAll("[aria-invalid]").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = document.querySelector(`#${fieldName}`);
    const error = document.querySelector(`#${fieldName}-error`);
    field.setAttribute("aria-invalid", "true");
    error.textContent = message;
  });
}

function initializePage() {
  renderServices(SERVICES);

  document.querySelector("#service-search").addEventListener("input", (event) => {
    renderServices(getVisibleServices(event.target.value));
  });

  document.querySelector("#booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const validation = validateBookingForm(formData);
    setFormErrors(validation.errors);
    const status = document.querySelector("#form-status");

    if (!validation.isValid) {
      status.textContent = "Please correct the highlighted fields.";
      status.className = "form-status is-error";
      document.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    status.textContent = "Sending your request…";
    status.className = "form-status is-loading";
    document.querySelector("#submit-button").disabled = true;

    window.setTimeout(() => {
      status.textContent = "Thanks! We’ll be in touch shortly.";
      status.className = "form-status is-success";
      document.querySelector("#submit-button").disabled = false;
      console.log("[Analytics] User interacted with Static Landing Page");
      event.currentTarget.reset();
    }, 700);
  });
}

if (typeof document !== "undefined") {
  if (document.querySelector("#service-list") && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
  } else if (document.querySelector("#service-list")) {
    initializePage();
  }
}
