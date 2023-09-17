
var data;

// Function to fetch and replace data
async function fetchData() {
    try {
        const response = await fetch('file/json/image.json'); // Replace 'data.json' with the correct path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const newData = await response.json();

        // Replace the existing data with the new data
        data = newData;

        console.log("Data replaced with new data:", data);

        // After fetching data, sort and render it
        sortAndRenderData();
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

// Function to sort and render data
function sortAndRenderData() {
    if (!data) {
        console.error("Data is not available.");
        return;
    }

    // Sort the data by name
    const sortData = data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    });

    // Get a reference to the container div
    const container = document.getElementById("imageContainer");

    // Loop through the sorted data and create HTML elements
    sortData.forEach(item => {
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

// Call the fetchData function to load and replace the data
fetchData();