const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const PAY = { easypaisa: "Easypaisa", jazzcash: "JazzCash", cash: "Cash at the academy" };
const NUM = { easypaisa: "0332-3556402", jazzcash: "0315-9262470" };
const WA = "923009260391";
const money = n => "PKR " + Number(n).toLocaleString("en-US");

let db = null;
let fee = 0;

if (window.FIREBASE_CONFIG && window.firebase) {
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

const stamp = () => firebase.firestore.FieldValue.serverTimestamp();
const save = async (collection, item) => {
  if (!db) return false;
  await db.collection(collection).doc(item.id).set({ ...item, createdAt: stamp() });
  return true;
};

const note = (element, html, isError = false) => {
  if (!element) return;
  element.className = "form-note" + (isError ? " err" : "");
  element.innerHTML = html;
};

/* Theme: remember the visitor's choice and keep the button accessible. */
const themeButton = $("#themeBtn");
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  if (themeButton) {
    themeButton.innerHTML = `<span aria-hidden="true">${isDark ? "☀" : "☾"}</span>`;
    themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeButton.title = `Switch to ${isDark ? "light" : "dark"} theme`;
  }
  try { localStorage.setItem("ts_theme", theme); } catch (error) {}
}
setTheme(document.documentElement.dataset.theme || "light");
themeButton?.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* Mobile navigation */
const menuButton = $(".menu-btn");
const navLinks = $(".nav-links");
menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  menuButton.innerHTML = `<span aria-hidden="true">${open ? "×" : "☰"}</span>`;
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuButton) {
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = '<span aria-hidden="true">☰</span>';
  }
}));

/* Course search and category filters */
const searchInput = $("#courseSearch");
const filterButtons = $$(".filter-chip");
const courseCards = $$(".course-card");
const courseCount = $("#courseCount");
const emptyState = $("#courseEmpty");
let activeCategory = "all";

function filterCourses() {
  const term = (searchInput?.value || "").trim().toLowerCase();
  let visible = 0;
  courseCards.forEach(card => {
    const title = (card.dataset.course || "").toLowerCase();
    const description = ($("p", card)?.textContent || "").toLowerCase();
    const category = card.dataset.category || "all";
    const matchesText = !term || title.includes(term) || description.includes(term);
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });
  if (courseCount) {
    courseCount.textContent = `Showing ${visible} of ${courseCards.length} courses`;
  }
  if (emptyState) emptyState.hidden = visible !== 0;
}
searchInput?.addEventListener("input", filterCourses);
filterButtons.forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter || "all";
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  filterCourses();
}));
$("#clearCourseFilters")?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  activeCategory = "all";
  filterButtons.forEach(button => {
    const active = button.dataset.filter === "all";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  filterCourses();
});

/* Enrollment modal and payment details */
const modal = $("#enrollModal");
const selectedCourse = $("#selectedCourse");
const courseField = $("#courseField");
const enrollMessage = $("#enrollMessage");

function wallet() {
  const selectedPayment = $('input[name="pay"]:checked')?.value || "easypaisa";
  const needsTransfer = selectedPayment !== "cash";
  const walletPanel = $("#wallet");
  const cashNote = $("#cashNote");
  const transactionInput = $("#trx");

  if (walletPanel) walletPanel.hidden = !needsTransfer;
  if (cashNote) cashNote.hidden = needsTransfer;
  if (transactionInput) transactionInput.required = needsTransfer;

  if (needsTransfer) {
    const qr = $("#walletQr");
    if (qr) {
      qr.style.display = "";
      qr.src = `images/payment/${selectedPayment}-qr.png`;
      qr.onerror = () => { qr.style.display = "none"; };
    }
    $("#walletNum").textContent = NUM[selectedPayment];
    $("#walletAmt").textContent = money(fee);
  }
}

$$('input[name="pay"]').forEach(radio => radio.addEventListener("change", wallet));

function openModal(courseCard) {
  const course = courseCard.dataset.course || "Selected course";
  const priceText = $(".course-meta strong", courseCard)?.textContent || "";
  fee = parseInt(priceText.replace(/\D/g, ""), 10) || 0;

  selectedCourse.textContent = course;
  courseField.value = course;
  $("#feeText").textContent = money(fee);
  note(enrollMessage, "");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  wallet();
  $(".close-modal")?.focus();
}
$$(".enroll-btn").forEach(button => {
  button.addEventListener("click", () => openModal(button.closest(".course-card")));
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}
$(".close-modal")?.addEventListener("click", closeModal);
modal?.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal?.classList.contains("show")) closeModal();
});

/* Enrollment submission */
$("#enrollForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const submitButton = $('button[type="submit"]', form);

  const application = {
    id: "E" + Date.now().toString(36).toUpperCase(),
    course: courseField.value,
    fee,
    student: {
      name: data.name.trim(),
      mobile: data.mobile.trim(),
      email: data.email.trim(),
      cnic: data.cnic.trim(),
      dob: data.dob,
      city: data.city.trim(),
      education: data.education.trim(),
      reason: (data.reason || "").trim()
    },
    payment: data.pay,
    trx: data.pay === "cash" ? "" : (data.trx || "").trim(),
    status: "Pending"
  };

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  try {
    const saved = await save("courseEnrollments", application);
    if (saved) {
      const message = encodeURIComponent(
        `Hello TechSphere Academy, I applied for ${application.course} (application ${application.id}).`
      );
      note(
        enrollMessage,
        `Application <b>${application.id}</b> received for ${application.course}. We will contact you on ${application.student.mobile}. <a href="https://wa.me/${WA}?text=${message}" target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>`
      );
      form.reset();
      wallet();
    } else {
      note(enrollMessage, "Demo mode: Firebase is not connected yet, so the academy has not received this application.", true);
    }
  } catch (error) {
    console.error("Enrollment submission failed:", error);
    note(enrollMessage, "We could not submit your application. Please try again or contact admissions.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Enrollment Application →";
  }
});

/* Contact inquiry */
$("#contactForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const message = $("#contactMessage");
  const submitButton = $('button[type="submit"]', form);
  const inquiry = {
    id: "Q" + Date.now().toString(36).toUpperCase(),
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    course: data.course,
    message: data.message.trim(),
    status: "New"
  };

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  try {
    const saved = await save("courseInquiries", inquiry);
    note(
      message,
      saved ? "Thanks! Your inquiry has been sent. We will get back to you soon." : "Demo mode: Firebase is not connected yet, so your inquiry has not been delivered.",
      !saved
    );
    if (saved) form.reset();
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    note(message, "We could not send your inquiry. Please try again.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Inquiry →";
  }
});

/* Reveal sections as they enter the viewport */
const revealTargets = $$(".section-heading, .course-card, .service, .about-image, .about-copy, .contact-copy, .contact-form, .stats-grid > div");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach(element => element.classList.add("reveal"));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => revealObserver.observe(element));
}

/* Reading progress and back-to-top */
const progressBar = $("#scrollProgress");
const backToTop = $("#backToTop");
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  backToTop?.classList.toggle("visible", window.scrollY > 550);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
