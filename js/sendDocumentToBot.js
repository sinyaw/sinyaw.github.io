const botToken = "6479838036:AAHYlU3DAgqNsDIaC-_FqWMnilcz3PCvx6M";
const chatId = "1564501412"; // Replace with the chat ID where you want to send the content
const messageText = 'Hello, this is a message from your JavaScript code!';

document.getElementById("sendContentButton").addEventListener("click", function() {

    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Log the response from the Telegram API
        })
        .catch((error) => {
            console.error('Error:', error); // Log any errors that occur during the request
        });
});


document.getElementById("pollForUpdates").addEventListener("click", function() {

    const apiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const updates = data.result;
            updates.forEach((update) => {
                if (update.message && update.message.text) {
                    const chatId = update.message.chat.id;
                    const messageText = update.message.text;

                    document.getElementById("telegramContent").textContent = chatId + ": "+ messageText; // Display the content in a <pre> element
                    // Process the messageText and handle it as needed.
                }
            });

            // Continue polling for updates.
            // pollForUpdates();
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors and continue polling.
            // pollForUpdates();
        });
});