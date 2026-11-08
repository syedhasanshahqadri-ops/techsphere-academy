
/* ==========================================
   TECHSPHERE ACADEMY
   MAIN JAVASCRIPT
   ========================================== */

const $ = (selector, scope = document) =>
  scope.querySelector(selector);

const $$ = (selector, scope = document) =>
  [...scope.querySelectorAll(selector)];

const WA = "923009260391";

const PAYMENT_NUMBERS = {
  easypaisa: "0332-3556402",
  jazzcash: "0315-9262470"
};

const money = amount =>
  "PKR " + Number(amount).toLocaleString("en-US");

let db = null;
let fee = 0;

/* ==========================================
   1. FIREBASE INITIALIZATION
   ========================================== */

if (window.FIREBASE_CONFIG && window.firebase) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.FIREBASE_CONFIG);
    }

    db = firebase.firestore();

  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

const timestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();

async function saveData(collection, data) {
  if (!db) return false;

  await db.collection(collection)
    .doc(data.id)
    .set({
      ...data,
      createdAt: timestamp()
    });

  return true;
}

/* ==========================================
   2. NOTIFICATION MESSAGE
   ========================================== */

function showMessage(element, message, error = false) {
  if (!element) return;

  element.textContent = message;

  element.className = "form-note";

  if (error) {
    element.classList.add("err");
  }
}

/* ==========================================
   3. LIGHT / DARK THEME
   ========================================== */

const themeButton = $("#themeBtn");

function setTheme(theme) {

  document.documentElement.dataset.theme = theme;

  const dark = theme === "dark";

  if (themeButton) {

    themeButton.textContent = dark ? "☀" : "☾";

    themeButton.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme"
    );

    themeButton.title =
      dark ? "Switch to light theme" : "Switch to dark theme";
  }

  try {
    localStorage.setItem("ts_theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
}

setTheme(
  document.documentElement.dataset.theme || "light"
);

themeButton?.addEventListener("click", () => {

  const current =
    document.documentElement.dataset.theme;

  setTheme(current === "dark" ? "light" : "dark");

});

/* ==========================================
   4. MOBILE NAVIGATION
   ========================================== */

const menuButton = $(".menu-btn");
const navigation = $("#primaryNav");

function closeMenu() {

  navigation?.classList.remove("open");

  menuButton?.setAttribute("aria-expanded", "false");

  if (menuButton) {
    menuButton.textContent = "☰";
    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }
}

menuButton?.addEventListener("click", () => {

  const opened =
    navigation.classList.toggle("open");

  menuButton.setAttribute(
    "aria-expanded",
    String(opened)
  );

  menuButton.textContent = opened ? "×" : "☰";

  menuButton.setAttribute(
    "aria-label",
    opened ? "Close navigation menu" : "Open navigation menu"
  );

});

$$(".nav-links a").forEach(link => {

  link.addEventListener("click", closeMenu);

});

/* ==========================================
   5. ALL 12 COURSES
   ========================================== */

const courses = [

  {
    name: "Graphic Designing",
    category: "design",
    tag: "DESIGN",
    duration: "3 Months",
    fee: 18000,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=85",
    description: "Photoshop, Illustrator, branding, social media and professional design workflow."
  },

  {
    name: "Web Development",
    category: "development",
    tag: "DEVELOPMENT",
    duration: "4 Months",
    fee: 25000,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    description: "HTML, CSS, JavaScript, responsive websites and modern development fundamentals."
  },

  {
    name: "Digital Marketing",
    category: "marketing",
    tag: "MARKETING",
    duration: "3 Months",
    fee: 20000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    description: "SEO, social media, content strategy, advertising and analytics."
  },

  {
    name: "Video Editing",
    category: "design",
    tag: "CREATIVE",
    duration: "3 Months",
    fee: 22000,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85",
    description: "Premiere Pro, storytelling, reels and professional video editing."
  },

  {
    name: "UI/UX Design",
    category: "design",
    tag: "DESIGN",
    duration: "3 Months",
    fee: 21000,
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=85",
    description: "Figma, wireframes, prototypes, design systems and user-centered interfaces."
  },

  {
    name: "Python Programming",
    category: "development",
    tag: "PROGRAMMING",
    duration: "3 Months",
    fee: 19000,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=85",
    description: "Python syntax, functions, programming fundamentals, files and real projects."
  },

  {
    name: "Full Stack Development",
    category: "development",
    tag: "DEVELOPMENT",
    duration: "6 Months",
    fee: 40000,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85",
    description: "Frontend, backend, APIs, databases and complete web application development."
  },

  {
    name: "WordPress Development",
    category: "development",
    tag: "WEB",
    duration: "2 Months",
    fee: 15000,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=85",
    description: "Build business websites, themes, plugins and professional websites."
  },

  {
    name: "SEO & Content Writing",
    category: "marketing",
    tag: "CONTENT",
    duration: "2 Months",
    fee: 14000,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
    description: "Keyword research, on-page SEO, blogs, copywriting and content planning."
  },

  {
    name: "Freelancing",
    category: "career",
    tag: "CAREER",
    duration: "6 Weeks",
    fee: 10000,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
    description: "Profiles, proposals, client communication, portfolios and online work."
  },

  {
    name: "Motion Graphics",
    category: "design",
    tag: "CREATIVE",
    duration: "3 Months",
    fee: 24000,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=85",
    description: "Animation principles, After Effects, titles, transitions and visual effects."
  },

  {
    name: "E-Commerce Development",
    category: "development",
    tag: "BUSINESS",
    duration: "3 Months",
    fee: 23000,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
    description: "Online stores, product pages, payment concepts and store management."
  }

];

/* ==========================================
   6. GENERATE COURSE CARDS
   ========================================== */

const courseGrid = $("#courseGrid");

function renderCourses() {

  if (!courseGrid) return;

  courseGrid.innerHTML = courses.map((course, index) => `

    <article class="course-card"
      data-course="${course.name}"
      data-category="${course.category}">

      <div class="course-image">
        <img
          src="${course.image}"
          alt="${course.name}"
          loading="lazy"
          onerror="this.style.opacity='.2'">
      </div>

      <div class="course-body">

        <span class="tag">${course.tag}</span>

        <h3>${course.name}</h3>

        <p>${course.description}</p>

        <div class="course-meta">
          <span>◷ ${course.duration}</span>
          <strong>${money(course.fee)}</strong>
        </div>

        <button
          class="enroll-btn"
          type="button"
          data-course-index="${index}">

          Enroll Now ↗

        </button>

      </div>

    </article>

  `).join("");

}

renderCourses();

/* ==========================================
   7. COURSE SEARCH AND FILTER
   ========================================== */

const searchInput = $("#courseSearch");
const filterButtons = $$(".filter-chip");

const countLabel = $("#courseCount");
const emptyState = $("#courseEmpty");

let activeCategory = "all";

function filterCourses() {

  const keyword =
    (searchInput?.value || "").trim().toLowerCase();

  let visible = 0;

  $$(".course-card").forEach(card => {

    const title =
      card.dataset.course.toLowerCase();

    const description =
      $("p", card).textContent.toLowerCase();

    const category =
      card.dataset.category;

    const matchesText =
      !keyword ||
      title.includes(keyword) ||
      description.includes(keyword);

    const matchesCategory =
      activeCategory === "all" ||
      category === activeCategory;

    const show =
      matchesText && matchesCategory;

    card.hidden = !show;

    if (show) visible++;

  });

  if (countLabel) {
    countLabel.textContent =
      `Showing ${visible} of ${courses.length} courses`;
  }

  if (emptyState) {
    emptyState.hidden = visible !== 0;
  }

}

searchInput?.addEventListener("input", filterCourses);

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    activeCategory = button.dataset.filter;

    filterButtons.forEach(item => {

      const active = item === button;

      item.classList.toggle("active", active);

      item.setAttribute(
        "aria-pressed",
        String(active)
      );

    });

    filterCourses();

  });

});

$("#clearFilters")?.addEventListener("click", () => {

  if (searchInput) searchInput.value = "";

  activeCategory = "all";

  filterButtons.forEach(button => {

    const active = button.dataset.filter === "all";

    button.classList.toggle("active", active);

    button.setAttribute(
      "aria-pressed",
      String(active)
    );

  });

  filterCourses();

});

filterCourses();

/* ==========================================
   8. ENROLLMENT MODAL
   ========================================== */

const modal = $("#enrollModal");

const selectedCourse = $("#selectedCourse");
const courseField = $("#courseField");
const feeText = $("#feeText");

const enrollMessage = $("#enrollMessage");

function openModal(index) {

  const course = courses[index];

  if (!course) return;

  fee = course.fee;

  selectedCourse.textContent = course.name;

  courseField.value = course.name;

  feeText.textContent = money(fee);

  showMessage(enrollMessage, "");

  modal.classList.add("show");

  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("no-scroll");

  updateWallet();

  $(".close-modal")?.focus();

}

/* Event delegation for generated buttons */

courseGrid?.addEventListener("click", event => {

  const button = event.target.closest(".enroll-btn");

  if (!button) return;

  openModal(Number(button.dataset.courseIndex));

});

/* ==========================================
   9. PAYMENT METHOD
   ========================================== */

function updateWallet() {

  const selected =
    $('input[name="pay"]:checked')?.value || "easypaisa";

  const wallet = $("#wallet");
  const cashNote = $("#cashNote");
  const trx = $("#trx");

  const isCash = selected === "cash";

  wallet.hidden = isCash;

  cashNote.hidden = !isCash;

  trx.required = !isCash;

  if (!isCash) {

    const qr = $("#walletQr");

    qr.style.display = "";

    qr.src = `images/payment/${selected}-qr.png`;

    qr.onerror = () => {
      qr.style.display = "none";
    };

    $("#walletNum").textContent =
      PAYMENT_NUMBERS[selected];

    $("#walletAmt").textContent =
      money(fee);

  }

}

$$('input[name="pay"]').forEach(radio => {

  radio.addEventListener("change", updateWallet);

});

/* ==========================================
   10. CLOSE MODAL
   ========================================== */

function closeModal() {

  modal.classList.remove("show");

  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("no-scroll");

}

$(".close-modal")?.addEventListener("click", closeModal);

modal?.addEventListener("click", event => {

  if (event.target === modal) {
    closeModal();
  }

});

document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    modal.classList.contains("show")
  ) {
    closeModal();
  }

});

/* ==========================================
   11. ENROLLMENT FORM
   ========================================== */

$("#enrollForm")?.addEventListener("submit", async event => {

  event.preventDefault();

  const form = event.currentTarget;

  const data =
    Object.fromEntries(new FormData(form));

  const submitButton =
    $('button[type="submit"]', form);

  const application = {

    id: "E" + Date.now().toString(36).toUpperCase(),

    course: courseField.value,

    fee: fee,

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

    trx:
      data.pay === "cash"
        ? ""
        : (data.trx || "").trim(),

    status: "Pending"

  };

  submitButton.disabled = true;

  submitButton.textContent = "Submitting...";

  try {

    const saved = await saveData(
      "courseEnrollments",
      application
    );

    if (!saved) {

      showMessage(
        enrollMessage,
        "Firebase is not connected. Your application has not been submitted.",
        true
      );

      return;
    }

    showMessage(
      enrollMessage,
      `Application ${application.id} received. Please contact admissions to confirm your submission.`
    );

    const message = encodeURIComponent(
      `Hello TechSphere Academy, I applied for ${application.course}. Application ID: ${application.id}.`
    );

    const whatsappLink =
      document.createElement("a");

    whatsappLink.href =
      `https://wa.me/${WA}?text=${message}`;

    whatsappLink.target = "_blank";

    whatsappLink.rel = "noopener noreferrer";

    whatsappLink.textContent = " Contact admissions on WhatsApp";

    enrollMessage.appendChild(whatsappLink);

    form.reset();

    updateWallet();

  } catch (error) {

    console.error("Enrollment error:", error);

    showMessage(
      enrollMessage,
      "Unable to submit your application. Please try again.",
      true
    );

  } finally {

    submitButton.disabled = false;

    submitButton.textContent =
      "Submit Enrollment Application ↗";

  }

});

/* ==========================================
   12. CONTACT FORM
   ========================================== */

$("#contactForm")?.addEventListener("submit", async event => {

  event.preventDefault();

  const form = event.currentTarget;

  const data =
    Object.fromEntries(new FormData(form));

  const message = $("#contactMessage");

  const button =
    $('button[type="submit"]', form);

  const inquiry = {

    id: "Q" + Date.now().toString(36).toUpperCase(),

    name: data.name.trim(),

    email: data.email.trim(),

    phone: data.phone.trim(),

    course: data.course,

    message: data.message.trim(),

    status: "New"

  };

  button.disabled = true;

  button.textContent = "Sending...";

  try {

    const saved = await saveData(
      "courseInquiries",
      inquiry
    );

    if (saved) {

      showMessage(
        message,
        "Thank you! Your inquiry has been received."
      );

      form.reset();

    } else {

      showMessage(
        message,
        "Firebase is not connected. Your inquiry was not delivered.",
        true
      );

    }

  } catch (error) {

    console.error("Contact error:", error);

    showMessage(
      message,
      "Unable to send your message. Please try again.",
      true
    );

  } finally {

    button.disabled = false;

    button.textContent = "Send Inquiry ↗";

  }

});

/* ==========================================
   13. SCROLL REVEAL ANIMATIONS
   ========================================== */

const revealElements = $$(
  ".section-heading, .course-card, .service, " +
  ".about-image, .about-copy, .contact-copy, " +
  ".contact-form, .stats-grid > div"
);

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {

  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("revealed");

        observer.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.12
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });

}

/* ==========================================
   14. SCROLL PROGRESS
   ========================================== */

const progress = $("#scrollProgress");
const backToTop = $("#backToTop");

function updateScroll() {

  const total =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percentage =
    total > 0
      ? (window.scrollY / total) * 100
      : 0;

  if (progress) {
    progress.style.width = percentage + "%";
  }

  backToTop?.classList.toggle(
    "visible",
    window.scrollY > 500
  );

}

window.addEventListener(
  "scroll",
  updateScroll,
  { passive: true }
);

updateScroll();

backToTop?.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});

/* ==========================================
   15. INITIALIZATION
   ========================================== */

console.log(
  "TechSphere Academy loaded successfully."
);
