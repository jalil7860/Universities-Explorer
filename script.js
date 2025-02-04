const btn = document.getElementById("searchBtn");
const loading = document.querySelector(".loading");
const listContainer = document.querySelector(".list-container");

btn.addEventListener("click", async () => {
  const country = document.getElementById("Input").value.trim();
  if (!country) return;

  loading.style.display = "block";
  listContainer.style.opacity = "0.5";

  try {
    const colleges = await getData(country);
    showCol(colleges);
  } catch (err) {
    showError(err.message);
  } finally {
    loading.style.display = "none";
    listContainer.style.opacity = "1";
  }
});

function showCol(colleges) {
  const list = document.querySelector("#list");
  list.innerHTML = "";

  if (!colleges.length) {
    showError("No universities found for this country");
    return;
  }

  colleges.forEach((col) => {
    const card = document.createElement("li");
    card.className = "university-card";
    card.innerHTML = `
      <h3 class="university-name">${col.name}</h3>
      <div class="university-details">
        ${col["state-province"] ? `<p>State: ${col["state-province"]}</p>` : ""}
        <p>Country: ${col.country}</p>
        ${
          col.web_pages[0]
            ? `<a href="${col.web_pages[0]}" class="website-link" target="_blank">Visit Website <i class="fas fa-external-link-alt"></i></a>`
            : ""
        }
      </div>
    `;
    list.appendChild(card);
  });
}

function showError(message) {
  const list = document.querySelector("#list");
  list.innerHTML = `<div class="error">${message}</div>`;
}

async function getData(country) {
  try {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/http://universities.hipolabs.com/search?country=${encodeURIComponent(
        country
      )}`
    );
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    throw new Error("Failed to fetch data. Please try again.");
  }
}
