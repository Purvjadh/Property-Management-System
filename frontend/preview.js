//  CHANGE PORT HERE IF YOUR BACKEND USES A DIFFERENT ONE
const API_URL = "http://localhost:8000/api/v1/users";

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        //  VERY IMPORTANT: backend wraps data inside "data"
        const users = result.data;

        renderUsers(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById("tableBody");
    const emptyMessage = document.getElementById("emptyMessage");

    tableBody.innerHTML = "";

    if (!users || users.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${new Date(user.createdAt).toLocaleString()}</td>
            <td>
                <button disabled>Edit</button>
                <button disabled>Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}