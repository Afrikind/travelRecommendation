document.addEventListener('DOMContentLoaded', () => {
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Check if data is fetched correctly
            displayRecommendations(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayRecommendations(data) {
    displayCategory(data.countries, 'countries-content', 'cities');
    displayCategory(data.temples, 'temples-content');
    displayCategory(data.beaches, 'beaches-content');
}

function displayCategory(categoryData, containerId, subCategoryKey) {
    const container = document.getElementById(containerId);
    categoryData.forEach(item => {
        if (subCategoryKey && item[subCategoryKey]) {
            item[subCategoryKey].forEach(subItem => {
                const itemElement = createRecommendationElement(subItem);
                container.appendChild(itemElement);
            });
        } else {
            const itemElement = createRecommendationElement(item);
            container.appendChild(itemElement);
        }
    });
}

function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    const data = window.recommendationData;
    if (!data) return;

    let results = [];

    if (searchInput.includes('beach')) {
        results = results.concat(data.beaches.slice(0, 2)); // Take at least 2 beach recommendations
    } else if (searchInput.includes('temple')) {
        results = results.concat(data.temples.slice(0, 2)); // Take at least 2 temple recommendations
    } else if (searchInput.includes('country')) {
        // Take at least 2 city recommendations from the countries
        data.countries.forEach(country => {
            results = results.concat(country.cities.slice(0, 2));
        });
    }

    // Display at least two results
    results.slice(0, 2).forEach(result => {
        const resultElement = createRecommendationElement(result);
        resultsContainer.appendChild(resultElement);
    });
}

function clearResults() {
    document.getElementById('searchInput').value = ''; // Clear the search input
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
}

function createRecommendationElement(item) {
    const recommendationElement = document.createElement('div');
    recommendationElement.className = 'recommendation';
    recommendationElement.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
    `;
    return recommendationElement;
}
