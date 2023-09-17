var data;

// Function to fetch and replace data
async function fetchData() {
    try {
        const response = await fetch('file/json/image.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const newData = await response.json();

        // Replace the existing data with the new data
        data = newData;

        console.log("Data replaced with new data:", data);

        // After fetching data, sort and render it
        sortAndRenderData(0);
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

// Function to sort and render data
function sortAndRenderData(sortIndex) {

    if (sortIndex == 2) {
        sortByStar();
    }else if (sortIndex == 1){
        sortByName();
    } else{
        sortByName();
    }

    // Get a reference to the container div
    const container = document.getElementById("imageContainer");
    // Clear the existing content in the container
    container.innerHTML = '';

    // Loop through the sorted data and create HTML elements
    data.forEach(item => {
        const imageElement = document.createElement("img");
        imageElement.src = item.image;
        imageElement.alt = item.name;

        imageElement.addEventListener("load", function () {
            const nameElement = document.createElement("p");
            nameElement.textContent = item.name;

            // Create a container div for each item
            const itemContainer = document.createElement("div");
            itemContainer.className = "item-container"; // Add the CSS class

            // Append the image element to the image container
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container"; // Add the CSS class
            imageContainer.appendChild(imageElement);

            // Append the image container and name element to the item container
            itemContainer.appendChild(imageContainer);
            itemContainer.appendChild(nameElement);

            // Append the container div to the main container
            container.appendChild(itemContainer);
        });
    });
}

// Function to sort and render data by 'star'
function sortByStar() {
    // Sort the data array by the 'star' property
    data.sort((a, b) => b.star - a.star);
}

// Function to sort and render data by 'name'
function sortByName() {
    // Sort the data array by the 'name' property
    data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
    });
}

// Event listeners for sorting buttons
document.getElementById("sortByName").addEventListener("click", sortByName);
document.getElementById("sortByStar").addEventListener("click", sortByStar);

// Initial fetch and render data
fetchData();
