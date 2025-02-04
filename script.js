const btn = document.getElementById("searchBtn");
const loading = document.querySelector(".loading");
const listContainer = document.querySelector(".list-container");

btn.addEventListener("click", async () => {
  const country = document.getElementById("Input").value.trim();
  if (!country) return;

  // Show skeleton loading
  document.getElementById("skeleton-loading").style.display = "block";
  listContainer.style.opacity = "0.5";
  document.getElementById("list").innerHTML = "";

  try {
    const colleges = await getData(country);
    showCol(colleges);
  } catch (err) {
    showError(err.message);
  } finally {
    // Hide skeleton loading
    document.getElementById("skeleton-loading").style.display = "none";
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
        ${
          col["state-province"]
            ? `<p>State: ${col["state-province"]}</p>`
            : ""
        }
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
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    throw new Error('Failed to fetch data. Please try again.');
  }
}
let searchHistory = JSON.parse(localStorage.getItem('universitySearchHistory')) || [];

function updateSearchHistory(country) {
    if (!searchHistory.includes(country)) {
        searchHistory.unshift(country);
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem('universitySearchHistory', JSON.stringify(searchHistory));
    }
    renderSearchHistory();
}

function renderSearchHistory() {
    const historyItems = document.getElementById("history-items");
    historyItems.innerHTML = searchHistory
        .map(country => `
            <div class="history-item" onclick="searchFromHistory('${country}')">
                ${country}
                <span class="remove-history" onclick="removeHistoryItem('${country}', event)">×</span>
            </div>
        `)
        .join("");
}

function searchFromHistory(country) {
    document.getElementById("Input").value = country;
    btn.click();
}

function removeHistoryItem(country, event) {
    event.stopPropagation();
    searchHistory = searchHistory.filter(item => item !== country);
    localStorage.setItem('universitySearchHistory', JSON.stringify(searchHistory));
    renderSearchHistory();
}

document.addEventListener('DOMContentLoaded', renderSearchHistory);

btn.addEventListener('click', async () => {
    const country = document.getElementById("Input").value.trim();
    if (!country) return;
    updateSearchHistory(country);
});

// List of countries for auto-complete
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
  "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", 
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", 
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", 
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
  "Yemen", "Zambia", "Zimbabwe"
];

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('Input');
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('autocomplete-container');
  input.parentNode.insertBefore(autocompleteContainer, input.nextSibling);

  input.addEventListener('input', function() {
      const inputValue = this.value.toLowerCase();
      const matchedCountries = countries.filter(country => 
          country.toLowerCase().startsWith(inputValue)
      );

      autocompleteContainer.innerHTML = '';
      if (inputValue && matchedCountries.length) {
          matchedCountries.slice(0, 5).forEach(country => {
              const suggestion = document.createElement('div');
              suggestion.textContent = country;
              suggestion.classList.add('autocomplete-item');
              suggestion.addEventListener('click', () => {
                  input.value = country;
                  autocompleteContainer.innerHTML = '';
              });
              autocompleteContainer.appendChild(suggestion);
          });
      }
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
      if (!autocompleteContainer.contains(e.target) && e.target !== input) {
          autocompleteContainer.innerHTML = '';
      }
  });
});

