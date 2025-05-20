// Get the elements
const form = document.getElementById('subscribe-form');
const submitButton = document.getElementById('submit-button');
const spinner = document.getElementById('loading-spinner');

// Add an event listener to the form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission to avoid page reload

    // Show the spinner and hide the button
    submitButton.style.display = 'none';  // Hide the button
    spinner.style.display = 'block';  // Show the spinner
    submitButton.disabled = true;  // Optionally disable the button

    const formData = new FormData(form);

    // Make an AJAX request to submit the form
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())  // Assuming the server returns JSON
        .then(data => {
            console.log('Form Submitted:', data);

            // Remove existing flash messages
            const flashMessageContainer = document.getElementById('flash-messages');
            flashMessageContainer.innerHTML = '';  // Clear previous messages

            // Handle the flash message based on server response
            const flashMessage = document.createElement('div');
            flashMessage.classList.add('flash', data.category);  // Use category for different types of flash messages
            flashMessage.innerText = data.message;  // Set the message text
            flashMessageContainer.appendChild(flashMessage);  // Append to the container

            // Hide the spinner and re-enable the button after the request completes
            spinner.style.display = 'none';
            submitButton.disabled = false;
            submitButton.style.display = 'block'; // Re-enable button if you want
        })
        .catch(error => {
            console.error('Error during form submission:', error);

            // Remove existing flash messages
            const flashMessageContainer = document.getElementById('flash-messages');
            flashMessageContainer.innerHTML = '';  // Clear previous messages

            // Handle error: Show error message with flash-style
            const flashMessage = document.createElement('div');
            flashMessage.classList.add('flash', 'error');  // Use 'error' class for the error message
            flashMessage.innerText = 'An error occurred while processing your request.';
            flashMessageContainer.appendChild(flashMessage);

            // Hide the spinner and re-enable the button after the request completes
            spinner.style.display = 'none';
            submitButton.disabled = false;
            submitButton.style.display = 'block';
        });
});
