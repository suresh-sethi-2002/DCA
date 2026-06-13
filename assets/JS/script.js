const pageRoot = window.location.pathname.includes("/PAGES/") ? "../" : "";

function loadComponent(targetId, componentName) {
    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    fetch(`${pageRoot}components/${componentName}.html`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load ${componentName}`);
            }

            return response.text();
        })
        .then((html) => {
            target.innerHTML = html.replaceAll("{{ROOT}}", pageRoot);
        })
        .catch(() => {
            target.textContent = "";
        });
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    return element;
}

function safeExternalUrl(value) {
    try {
        const url = new URL(value, window.location.href);
        return ["http:", "https:", "tel:", "mailto:"].includes(url.protocol)
            ? url.href
            : "#";
    } catch {
        return "#";
    }
}

function addCopyrightBar() {
    const copyright = document.createElement("div");
    copyright.className = "copyright-bar";

    const year = new Date().getFullYear();
    const text = document.createElement("span");
    text.textContent = `Copyright ${year} Dreams Computer Academy. All Rights Reserved.`;

    const credit = document.createElement("span");
    credit.className = "developer-credit";
    credit.textContent = " | Developed By ";

    const creditLink = document.createElement("a");
    creditLink.href = "https://www.linkedin.com/in/suresh-sethi-a71b411b1/";
    creditLink.target = "_blank";
    creditLink.rel = "noopener noreferrer";
    creditLink.textContent = "Suresh Sethi";

    credit.appendChild(creditLink);
    copyright.append(text, credit);
    document.body.appendChild(copyright);
}

function renderOfferCard(offer) {
    const card = createElement("div", "offer-card");
    const badge = createElement("span", "badge", offer.badge || "Offer");
    const title = createElement("h3", "", offer.title || "Latest Offer");
    const description = createElement("p", "", offer.description || "");
    const validity = createElement("p");
    const validityLabel = createElement("strong", "", "Valid Till: ");
    const validityText = document.createTextNode(offer.valid || "Contact office");
    const applyLink = createElement("a", "offer-btn", "Apply Now");

    applyLink.href = `${pageRoot}index.html#contact`;
    validity.append(validityLabel, validityText);
    card.append(badge, title, description, validity, applyLink);

    return card;
}

function loadOffers() {
    const container = document.getElementById("offerContainer");

    if (!container) {
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbwwfDd_FbKbnHHG_l5ACuSDJLueUZvEROyGug2sUvVzqmGJS2nmp4krXtslsWzzQ8Novw/exec?type=offers")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to load offers");
            }

            return response.json();
        })
        .then((data) => {
            container.replaceChildren();

            if (!Array.isArray(data) || data.length === 0) {
                container.appendChild(createElement("p", "empty-state", "No current offers available."));
                return;
            }

            data.forEach((offer) => {
                container.appendChild(renderOfferCard(offer));
            });
        })
        .catch(() => {
            container.replaceChildren(createElement("p", "empty-state", "Offers are temporarily unavailable."));
        });
}

function badgeClass(value) {
    const badge = String(value || "").toUpperCase();

    if (badge === "NEW") {
        return "badge-new";
    }

    if (badge === "HOT") {
        return "badge-hot";
    }

    if (badge === "FREE") {
        return "badge-free";
    }

    return "";
}

function loadUpdates() {
    const marquee = document.getElementById("updates-marquee");

    if (!marquee) {
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbzw33ZxC7X91VBQ2X1Gr0W-QGkwayAAiFpc0TInkFAXPCjAvJY0X3XX0Al4OcwXgUlZMw/exec")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to load updates");
            }

            return response.json();
        })
        .then((data) => {
            marquee.replaceChildren();

            if (!Array.isArray(data) || data.length === 0) {
                marquee.textContent = "No latest updates available.";
                return;
            }

            data.forEach((item) => {
                const link = createElement("a");
                link.href = safeExternalUrl(item.link || `${pageRoot}index.html#contact`);
                link.rel = "noopener noreferrer";
                link.textContent = `${item.title || "Update"} `;

                const badge = createElement("span", `update-badge ${badgeClass(item.badge)}`, item.badge || "");
                link.appendChild(badge);
                marquee.appendChild(link);
            });
        })
        .catch(() => {
            marquee.textContent = "Latest updates are temporarily unavailable.";
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header");
    loadComponent("footer", "footer");
    loadOffers();
    loadUpdates();
    addCopyrightBar();
});
