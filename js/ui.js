function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  mobileMenu.classList.toggle("menu-open");

  if (mobileMenu.classList.contains("menu-open")) {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  } else {
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  }
}

function smoothScroll(event, targetId, btn) {
  event.preventDefault();
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const offset = 75;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  if (btn && btn.parentElement) {
    const btns = btn.parentElement.querySelectorAll(".segmented-btn");
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

function openTab(tabName, btn) {
  const aboutSection = document.getElementById("about");
  const tabContents = aboutSection.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.add("hidden");
  });

  document.getElementById(tabName).classList.remove("hidden");

  if (btn && btn.parentElement) {
    const btns = btn.parentElement.querySelectorAll(".segmented-btn");
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

function openFunTab(tabName, btn) {
  const funSection = document.getElementById("fun-things");
  const tabContents = funSection.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.add("hidden");
  });

  document.getElementById(tabName).classList.remove("hidden");

  if (btn && btn.parentElement) {
    const btns = btn.parentElement.querySelectorAll(".segmented-btn");
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
}
