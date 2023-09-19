// Define db in the global scope
let db;
let tableName = "myData";

/**
 * Function to open the IndexedDB database
 */
function openDatabase() {
    const dbName = "MyDatabase";
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result; // Assign db in the global scope

        // Create an object store (table) to store data
        const objectStore = db.createObjectStore("myData", {keyPath: "id", autoIncrement: true});

        // Define the structure of your data
        objectStore.createIndex("name", "name", {unique: false});
        objectStore.createIndex("email", "email", {unique: true});
    };

    request.onsuccess = function (event) {
        db = event.target.result; // Assign db in the global scope
        console.log("Database opened successfully");
    };
}

// Call the openDatabase function to open the database
openDatabase();

/**
 * Function to insert to the IndexedDB database
 */
const dataForm = document.getElementById("dataForm");
dataForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting

    // Start a transaction to interact with the database
    const transaction = db.transaction(["myData"], "readwrite");

    // Access the object store
    const objectStore = transaction.objectStore("myData");

    // Prepare the data you want to insert from the form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const newData = {name, email};

    // Add data to the object store
    const addRequest = objectStore.add(newData);

    addRequest.onsuccess = function (event) {
        console.log("Data inserted successfully:", event.target.result);
        showAllData();
    };

    addRequest.onerror = function (event) {
        console.error("Error inserting data:", event.target.error);
    };

    // Complete the transaction
    transaction.oncomplete = function () {
        console.log("Transaction completed");
    };

    transaction.onerror = function (event) {
        console.error("Transaction error:", event.target.error);
    };
});


/**
 * Function to show all data from IndexedDB
 */
// Add event listener to the show all data button
const showAllButton = document.getElementById("showAllButton");
showAllButton.addEventListener("click", showAllData);
function showAllData() {
    // Call a function to retrieve and display all data from IndexedDB
    const transaction = db.transaction(["myData"], "readonly");
    const objectStore = transaction.objectStore("myData");

    const displayData = document.getElementById("displayData");
    displayData.innerHTML = ``;

    // Open a cursor to iterate over all items in the object store
    const cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            // Display data in the UI (you can customize how you want to display it)

            displayData.innerHTML += `
                        <p><strong>Id:</strong> ${cursor.value.id},<strong>Name:</strong> ${cursor.value.name}, <strong>Email:</strong> ${cursor.value.email}</p>
                    `;
            // console.log("Data displayed:", cursor.value)
            // Move to the next item in the cursor
            cursor.continue();
        } else {
            console.log("All data displayed");
        }
    };

    cursorRequest.onerror = function (event) {
        console.error("Error retrieving data:", event.target.error);
    };
};


/**
 * Function to delete data from IndexedDB
 */
function deleteDataById() {
    const id = parseInt(document.getElementById("deleteByIdInput").value);
    const transaction = db.transaction(["myData"], "readwrite");
    const objectStore = transaction.objectStore("myData");

    const deleteRequest = objectStore.delete(id);

    deleteRequest.onsuccess = function (event) {
        console.log("Data with ID " + id + " deleted successfully");
        showAllData();
    };

    deleteRequest.onerror = function (event) {
        console.error("Error deleting data with ID " + id + ": " + event.target.error);
    };

}
function deleteDataByEmail(email) {
    const transaction = db.transaction(["myData"], "readwrite");
    const objectStore = transaction.objectStore("myData");
    const emailIndex = objectStore.index("email");

    const getRequest = emailIndex.getKey(email);

    getRequest.onsuccess = function (event) {
        const id = event.target.result;

        if (id !== undefined) {
            const deleteRequest = objectStore.delete(id);

            deleteRequest.onsuccess = function (event) {
                console.log("Data with email " + email + " deleted successfully");
                showAllData();
            };

            deleteRequest.onerror = function (event) {
                console.error("Error deleting data with email " + email + ": " + event.target.error);
            };
        } else {
            console.log("No data found with email " + email);
        }
    };

    getRequest.onerror = function (event) {
        console.error("Error finding data by email: " + event.target.error);
    };
}

/**
 * Function to update data from IndexedDB
 */
function updateDataById() {
    // Get form input values
    const id = parseInt(document.getElementById("idForUpdate").value);
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const transaction = db.transaction(["myData"], "readwrite");
    const objectStore = transaction.objectStore("myData");

    // Retrieve the existing data based on the ID
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function (event) {
        const existingData = event.target.result;

        if (existingData) {
            // Update the existing data with the new values
            existingData.name = name;
            existingData.email = email;

            // Use the `put` method to update the data
            const updateRequest = objectStore.put(existingData);

            updateRequest.onsuccess = function (event) {
                console.log("Data with ID " + id + " updated successfully");
                showAllData(); // Refresh the displayed data
            };

            updateRequest.onerror = function (event) {
                console.error("Error updating data with ID " + id + ": " + event.target.error);
            };
        } else {
            console.error("Data with ID " + id + " not found");
        }
    };

    getRequest.onerror = function (event) {
        console.error("Error retrieving data with ID " + id + ": " + event.target.error);
    };
}
