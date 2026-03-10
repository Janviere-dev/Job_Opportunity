(() => {
    const searchInput = document.getElementById("opportunity-search");
    const listEl = document.getElementById("opportunity-list");
    const emptyEl = document.getElementById("opportunity-empty");
    const countEl = document.getElementById("open-opportunities-count");

    let allOpportunities = [];

    const escapeHtml = (value) =>
        String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");

    const formatDate = (value) => {
        if (!value) {
            return "Not specified";
        }

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return "Not specified";
        }

        return parsed.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    function createCard(opportunity) {
        const designation = opportunity.degisination || opportunity.name || "Untitled";
        const location = opportunity.location || "Not specified";
        const profession = opportunity.profession || "Not specified";
        const postedOn = formatDate(opportunity.posted_on);
        const closedOn = formatDate(opportunity.closed_on);

        const card = document.createElement("article");
        card.className = "opportunity-card";
        card.innerHTML = `
            <h3>${escapeHtml(designation)}</h3>
            <p><strong>Profession:</strong> ${escapeHtml(profession)}</p>
            <p><strong>Location:</strong> ${escapeHtml(location)}</p>
            <p><strong>Open Date:</strong> ${escapeHtml(postedOn)}</p>
            <p><strong>Close Date:</strong> ${escapeHtml(closedOn)}</p>
            <div class="card-actions">
                <a class="apply-btn" href="/volunteer-signup?opportunity=${encodeURIComponent(designation)}">Apply</a>
            </div>
        `;

        return card;
    }

    function render(list) {
        listEl.innerHTML = "";

        if (!list.length) {
            emptyEl.hidden = false;
            return;
        }

        emptyEl.hidden = true;
        list.forEach((opportunity) => listEl.appendChild(createCard(opportunity)));
    }

    function filterAndRender() {
        const term = (searchInput.value || "").toLowerCase().trim();
        if (!term) {
            render(allOpportunities);
            return;
        }

        const filtered = allOpportunities.filter((item) => {
            const haystack = [
                item.degisination,
                item.location,
                item.profession,
                item.status,
                item.name
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(term);
        });

        render(filtered);
    }

    function updateOpenCount() {
        if (countEl) {
            const count = allOpportunities.length;
            const label = count === 1 ? "opportunity" : "opportunities";
            countEl.textContent = `${count} ${label}`;
        }
    }

    async function loadOpenOpportunities() {
        try {
            const response = await fetch("/api/method/onerc.api.get_open_opportunities?limit=100");

            if (!response.ok) {
                throw new Error("Could not load opportunities");
            }

            const payload = await response.json();
            const records = payload?.message?.opportunities || [];
            allOpportunities = records;
            updateOpenCount();
            filterAndRender();
        } catch (error) {
            allOpportunities = [];
            updateOpenCount();
            filterAndRender();
            console.error("Failed to load opportunities", error);
        }
    }

    searchInput.addEventListener("input", filterAndRender);
    loadOpenOpportunities();
})();
