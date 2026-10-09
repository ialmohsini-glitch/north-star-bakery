const products = [
  { id: "bread", name: "Breads" },
  { id: "pastries", name: "Pastries" },
  { id: "cakes", name: "Cakes" },
  { id: "signature", name: "Signature Loaf" }
];

const storageKey = "northStarFavorites";
let favorites = [];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved)) {
    favorites = products
      .filter(product => saved.includes(product.id))
      .map(product => product.id);
  }
} catch {
  favorites = [];
}

const favoritesList = document.querySelector("#favorites-list");
const statusMessage = document.querySelector("#favorites-status");
const favoriteButtons = document.querySelectorAll("[data-favorite]");

function displayFavorites() {
  favoritesList.replaceChildren();

  if (favorites.length === 0) {
    const item = document.createElement("li");
    item.textContent = "You have no saved favorites yet.";
    favoritesList.append(item);
  }

  products.forEach(product => {
    if (favorites.includes(product.id)) {
      const item = document.createElement("li");
      item.textContent = product.name;
      favoritesList.append(item);
    }
  });

  favoriteButtons.forEach(button => {
    const product = products.find(
      item => item.id === button.dataset.favorite
    );

    if (!product) return;

    const selected = favorites.includes(product.id);
    button.textContent =
      `${selected ? "Remove" : "Save"} ${product.name}`;
    button.setAttribute("aria-pressed", String(selected));
  });
}

function toggleFavorite(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const alreadySaved = favorites.includes(productId);

  if (alreadySaved) {
    favorites = favorites.filter(id => id !== productId);
  } else {
    favorites.push(productId);
  }

  displayFavorites();

  try {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
    statusMessage.textContent = alreadySaved
      ? `${product.name} removed from your favorites.`
      : `${product.name} saved to your favorites.`;
  } catch {
    statusMessage.textContent =
      "Favorites updated, but this browser could not save them for later.";
  }
}

if (favoritesList && statusMessage) {
  favoriteButtons.forEach(button => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.favorite);
    });
  });

  displayFavorites();
}
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const requestField = document.querySelector("#request-type");
  const detailsField = document.querySelector("#details");

  const rules = [
    {
      field: nameField,
      check: () => nameField.value.trim().length >= 2,
      message: "Enter your name using at least 2 characters."
    },
    {
      field: emailField,
      check: () =>
        emailField.value.trim() !== "" &&
        emailField.validity.valid,
      message: "Enter a valid email address, like name@example.com."
    },
    {
      field: requestField,
      check: () => requestField.value !== "",
      message: "Choose a request type."
    },
    {
      field: detailsField,
      check: () => detailsField.value.trim().length >= 10,
      message: "Enter at least 10 characters for your request."
    }
  ];

  const formStatus = document.createElement("p");
  formStatus.setAttribute("role", "status");
  contactForm.append(formStatus);

  rules.forEach(rule => {
    const error = document.createElement("p");
    error.id = `${rule.field.id}-error`;
    error.style.color = "#9B1C1C";
    error.hidden = true;

    rule.field.insertAdjacentElement("afterend", error);
    rule.field.setAttribute("aria-describedby", error.id);
    rule.error = error;

    rule.field.addEventListener("input", () => {
      if (!rule.error.hidden) validateField(rule);
      formStatus.textContent = "";
    });
  });

  function validateField(rule) {
    const valid = rule.check();
    rule.error.textContent = valid ? "" : rule.message;
    rule.error.hidden = valid;
    rule.field.setAttribute("aria-invalid", String(!valid));
    return valid;
  }

  try {
    const savedType = localStorage.getItem("northStarRequestType");

    if (savedType === "preorder" || savedType === "question") {
      requestField.value = savedType;
    }
  } catch {
    // The form still works when browser storage is unavailable.
  }

  requestField.addEventListener("change", () => {
    try {
      localStorage.setItem("northStarRequestType", requestField.value);
    } catch {
      // Continue without saving the selection.
    }
  });

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const invalidRules = rules.filter(rule => !validateField(rule));

    if (invalidRules.length > 0) {
      formStatus.textContent = "Please correct the marked fields.";
      invalidRules[0].field.focus();
      return;
    }

    formStatus.textContent =
      "Your practice request passed all checks. Nothing was sent to a bakery.";
  });
}