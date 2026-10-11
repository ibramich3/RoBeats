const BOOKING_EMAIL = ""; // e.g. "hello@yourdomain.com"

const header = document.querySelector("[data-header]");
const menuBtn = document.querySelector("[data-menu-btn]");
const nav = document.querySelector("[data-nav]");
const form = document.getElementById("booking-form");
const statusEl = document.getElementById("form-status");
const yearEl = document.querySelector("[data-year]");

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const dateInput = form?.querySelector('input[name="date"]');
if (dateInput) {
  dateInput.min = new Date().toISOString().slice(0, 10);
}

function formLines(data) {
  const labels = {
    first: "First name",
    last: "Last name",
    email: "Email",
    phone: "Phone",
    date: "Event date",
    venue: "Venue",
    time: "Start time",
    guests: "Guests",
    service: "Service",
    msg: "Notes",
  };
  return [...data.entries()]
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${labels[key] || key}: ${value}`)
    .join("\n");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    statusEl.textContent = "Please complete the required fields.";
    return;
  }

  const data = new FormData(form);
  const body = formLines(data);
  const subject = `RoBeats booking request: ${data.get("date") || "new date"}`;

  try {
    await navigator.clipboard.writeText(`${subject}\n\n${body}`);
  } catch {
    /* clipboard may be blocked */
  }

  if (BOOKING_EMAIL) {
    const mailto = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    statusEl.textContent = "Your email app should open with the request filled in. The details were also copied to your clipboard.";
    return;
  }

  statusEl.classList.add("ok");
  statusEl.innerHTML =
    'Request copied to your clipboard. Message <a href="https://www.instagram.com/robeats23" target="_blank" rel="noopener noreferrer">@robeats23</a> with the details, or set a booking email in js/main.js to send by email.';
});
