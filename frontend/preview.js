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
                <button onclick="editUser('${user._id}')">Edit</button>

                <button onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

async function deleteUser(userId) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Failed to delete user");
            return;
        }

        alert("User deleted successfully");

        // Refresh list after delete
        fetchUsers();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error while deleting user");
    }
}

function editUser(userId) {
    // redirect to form in EDIT mode
    window.location.href = `login/login.html?id=${userId}`;
}