// When the "Get Server Status" button is clicked, fetch server status
document.getElementById("getStatus").addEventListener("click", () => {
	fetch("http://localhost:3000/status")
		.then((response) => response.json())
		.then((data) => {
			alert(`Server Time: ${data.serverTime}`);
		})
		.catch((error) => {
			alert("Error fetching status");
		});
});

// When the "Send Data" button is clicked, send a POST request with JSON data
document.getElementById("sendData").addEventListener("click", () => {
	const data = {
		name: "Alice",
		age: 25,
	};

	fetch("http://localhost:3000/data", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			alert(`Server Response: ${data.message}`);
		})
		.catch((error) => {
			alert("Error sending data");
		});
});
