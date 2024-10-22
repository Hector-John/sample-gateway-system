document.getElementById("checkout-button").addEventListener("click", () => {
    fetch("http://localhost:3000/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: [
                {id: 1, quantity: 3},
                {id: 2, quantity: 2},
               
            ]
        })
    })
    .then((response) => {
        // Check if the response is okay (status 200-299)
        if (!response.ok) {
            return Promise.reject(new Error(`HTTP status ${response.status}: ${response.statusText}`));
        }
        return response.json();
    })
    .then((data) => {
        if (data.url) {
            window.location = data.url; 
        } else {
            console.error("Checkout session creation failed.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});
