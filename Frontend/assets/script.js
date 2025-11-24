// // ===============================
// // Base API URL
// // ===============================
// const API_BASE = "http://127.0.0.1:8000"; // Change if deployed

// // ===============================
// // Utility: JWT token
// // ===============================
// function getToken() {
//     return localStorage.getItem("access_token");
// }

// function isLoggedIn() {
//     return !!getToken();
// }

// // ===============================
// // API request helper
// // ===============================
// async function apiRequest(path, method = "GET", body = null, isAuth = true) {
//     const headers = { "Content-Type": "application/json" };
//     if (isAuth) headers["Authorization"] = `Bearer ${getToken()}`;
//     const res = await fetch(API_BASE + path, {
//         method,
//         headers,
//         body: body ? JSON.stringify(body) : null
//     });
//     return res.json();
// }

// // ===============================
// // Format 24h time to 12h AM/PM
// // ===============================
// function formatTime24to12(time24) {
//     const [hour, minute] = time24.split(":");
//     let h = parseInt(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     h = h % 12 || 12;
//     return `${h}:${minute} ${ampm}`;
// }

// // ===============================
// // Navbar: toggle links based on login & role
// // ===============================
// window.addEventListener("DOMContentLoaded", () => {
//     const token = getToken();
//     const loginBtn = document.getElementById("loginLink") || document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerLink") || document.getElementById("registerBtn");
//     const logoutBtn = document.getElementById("logoutBtn");
//     const viewDoctorsNav = document.getElementById("doctorsNav") || document.getElementById("heroDoctorsBtn");
//     const adminNav = document.getElementById("adminNav");

//     if (token) {
//         if (loginBtn) loginBtn.classList.add("hidden");
//         if (registerBtn) registerBtn.classList.add("hidden");
//         if (logoutBtn) logoutBtn.classList.remove("hidden");
//         if (viewDoctorsNav) viewDoctorsNav.classList.remove("hidden");

//         try {
//             const payload = JSON.parse(atob(token.split(".")[1]));
//             if (payload.role === "ADMIN") {
//                 if (adminNav) adminNav.classList.remove("hidden");
//                 if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
//             }
//         } catch (e) {
//             console.error("Invalid token", e);
//         }
//     } else {
//         if (loginBtn) loginBtn.classList.remove("hidden");
//         if (registerBtn) registerBtn.classList.remove("hidden");
//         if (logoutBtn) logoutBtn.classList.add("hidden");
//         if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
//         if (adminNav) adminNav.classList.add("hidden");
//     }
// });

// // ===============================
// // Logout
// // ===============================
// document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     localStorage.removeItem("access_token");
//     alert("Logged out successfully!");
//     window.location.reload();
// });

// // ===============================
// // Page protection
// // ===============================
// document.addEventListener("DOMContentLoaded", () => {
//     const token = getToken();
//     const adminPages = ["dashboard.html","add-doctor.html","schedule.html","bookings.html"];
//     const patientPages = ["index.html","doctors.html","doctor-detail.html","book.html","appointments.html"];
//     const page = window.location.pathname.split("/").pop();

//     if (patientPages.includes(page) && !token) {
//         alert("Please login first!");
//         window.location.href = "login.html";
//     }
//     if (adminPages.includes(page) && !token) {
//         alert("Please login first!");
//         window.location.href = "../login.html";
//     }
// });

// // ===============================
// // Auth Pages
// // ===============================
// if (document.getElementById("registerForm")) {
//     document.getElementById("registerForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const role = document.getElementById("role").value;
//         const data = await apiRequest("/auth/register", "POST", { name, email, password, role }, false);
//         if (data.user_id) {
//             alert("Registered successfully! Please login.");
//             window.location.href = "login.html";
//         } else alert(data.detail || "Registration failed");
//     };
// }

// if (document.getElementById("loginForm")) {
//     document.getElementById("loginForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const data = await apiRequest("/auth/login", "POST", { email, password }, false);
//         if (data.access_token) {
//             localStorage.setItem("access_token", data.access_token);
//             alert("Login successful!");
//             window.location.href = "index.html";
//         } else alert(data.detail || "Login failed");
//     };
// }

// // ===============================
// // Patient Pages
// // ===============================

// // Load doctors
// if (document.getElementById("doctorsList")) {
//     async function loadDoctors() {
//         const data = await apiRequest("/doctors", "GET", false);
//         const doctors = data.doctors || data;
//         const container = document.getElementById("doctorsList");
//         container.innerHTML = "";
//         doctors.forEach(doc => {
//             const div = document.createElement("div");
//             div.className = "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer";
//             div.innerHTML = `
//                 <h3 class="text-xl font-bold">${doc.name}</h3>
//                 <p class="text-gray-600">${doc.specialty}</p>
//                 <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="viewDoctor(${doc.id})">View Details</button>
//             `;
//             container.appendChild(div);
//         });
//     }
//     loadDoctors();
// }

// function viewDoctor(id) {
//     localStorage.setItem("selected_doctor_id", id);
//     window.location.href = "doctor-detail.html";
// }

// if (document.getElementById("doctorDetail")) {
//     const id = localStorage.getItem("selected_doctor_id");
//     async function loadDoctorDetail() {
//         const doctor = await apiRequest(`/doctors/${id}`, "GET", false);
//         document.getElementById("doctorName").innerText = doctor.name;
//         document.getElementById("doctorSpecialty").innerText = doctor.specialty;
//     }
//     loadDoctorDetail();
// }

// // Book appointment
// if (document.getElementById("bookForm")) {
//     document.getElementById("bookForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const doctor_id = localStorage.getItem("selected_doctor_id");
//         const date = document.getElementById("date").value;
//         const time = document.getElementById("time").value;
//         const data = await apiRequest("/appointments", "POST", { doctor_id, date, time });
//         if (data.id) {
//             alert("Appointment booked successfully!");
//             window.location.href = "appointments.html";
//         } else alert(data.detail || "Booking failed");
//     };
// }

// // Load my appointments (patient)
// if (document.getElementById("myAppointmentsList")) {
//     async function loadMyAppointments() {
//         const appointments = await apiRequest("/appointments/me");
//         const container = document.getElementById("myAppointmentsList");
//         container.innerHTML = "";
//         if (!appointments.length) {
//             container.innerHTML = "<p class='text-gray-500'>No appointments found.</p>";
//             return;
//         }
//         appointments.forEach(appt => {
//             const div = document.createElement("div");
//             div.className = "bg-white p-4 rounded shadow flex justify-between items-center mb-2";
//             div.innerHTML = `
//                 <div>
//                     <p class="font-bold">Dr. ${appt.doctor.name}</p>
//                     <p>Patient: ${appt.patient.name}</p>
//                     <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
//                 </div>
//                 <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onclick="cancelAppointment(${appt.id})">Cancel</button>
//             `;
//             container.appendChild(div);
//         });
//     }
//     loadMyAppointments();
// }

// // Cancel appointment
// async function cancelAppointment(id) {
//     const data = await apiRequest(`/appointments/${id}`, "DELETE");
//     if (data.message) {
//         alert(data.message);
//         loadMyAppointments();
//         loadAllAppointments(); // admin view
//     } else alert(data.detail || "Cancel failed");
// }

// // ===============================
// // Admin Pages
// // ===============================

// // Add doctor
// if (document.getElementById("addDoctorForm")) {
//     document.getElementById("addDoctorForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const specialty = document.getElementById("specialty").value;
//         const data = await apiRequest("/doctors", "POST", { name, email, specialty });
//         if (data.doctor_id) alert("Doctor added successfully!");
//         else alert(data.detail || "Failed to add doctor");
//     };
// }

// // Add schedule
// if (document.getElementById("addScheduleForm")) {
//     document.getElementById("addScheduleForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const doctor_id = parseInt(document.getElementById("doctor_id").value);
//         const day = document.getElementById("day").value;
//         const start_time = document.getElementById("start_time").value;
//         const end_time = document.getElementById("end_time").value;

//         const data = await apiRequest(`/doctors/${doctor_id}/schedule`, "POST", { day, start_time, end_time });
//         if (data.schedule_id) alert("Schedule added successfully!");
//         else alert(data.detail || "Failed to add schedule");
//     };
// }

// // Load all appointments (admin)
// if (document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")) {
//     async function loadAllAppointments() {
//         const appointments = await apiRequest("/appointments/all");
//         const container = document.getElementById("allAppointmentsList") || document.getElementById("bookingsList");
//         container.innerHTML = "";
//         if (!appointments.length) {
//             container.innerHTML = "<p class='text-gray-500'>No appointments found.</p>";
//             return;
//         }
//         appointments.forEach(appt => {
//             const div = document.createElement("div");
//             div.className = "bg-white p-4 rounded shadow mb-2";
//             div.innerHTML = `
//                 <div>
//                     <p class="font-bold">Dr. ${appt.doctor.name}</p>
//                     <p>Patient: ${appt.patient.name}</p>
//                     <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
//                 </div>
//             `;
//             container.appendChild(div);
//         });
//     }
//     loadAllAppointments();
// }





// ===============================
// Base API URL
// ===============================
const API_BASE = "http://127.0.0.1:8000";

// ===============================
// Utility: JWT token
// ===============================
function getToken() {
    return localStorage.getItem("access_token");
}

function isLoggedIn() {
    return !!getToken();
}

// ===============================
// API request helper
// ===============================
async function apiRequest(path, method = "GET", body = null, includeAuth = true) {
    const headers = { "Content-Type": "application/json" };
    if (includeAuth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(API_BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    let data;
    try {
        data = await res.json();
    } catch (e) {
        data = { detail: "Invalid server response" };
    }
    return data;
}

// ===============================
// Format 24h time to 12h
// ===============================
function formatTime24to12(time24) {
    const [hour, minute] = time24.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
}

// ===============================
// Navbar setup
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    const loginBtn = document.getElementById("loginLink") || document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerLink") || document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminNav = document.getElementById("adminNav");
    const doctorsNav = document.getElementById("doctorsNav") || document.getElementById("heroDoctorsBtn");

    if (token) {
        if (loginBtn) loginBtn.classList.add("hidden");
        if (registerBtn) registerBtn.classList.add("hidden");
        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (doctorsNav) doctorsNav.classList.remove("hidden");

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.role === "ADMIN") {
                if (adminNav) adminNav.classList.remove("hidden");
                if (doctorsNav) doctorsNav.classList.add("hidden");
            }
        } catch (e) {
            console.log("Invalid token");
        }
    } else {
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (doctorsNav) doctorsNav.classList.add("hidden");
        if (adminNav) adminNav.classList.add("hidden");
    }
});

// ===============================
// Logout
// ===============================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("access_token");
    alert("Logged out!");
    window.location.href = "login.html";
});

// ===============================
// Page Protection
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    const page = window.location.pathname.split("/").pop();

    const adminPages = ["dashboard.html", "add-doctor.html", "schedule.html", "bookings.html"];
    const patientPages = ["doctor-detail.html", "book.html", "appointments.html"];

    if (!token) {
        if (adminPages.includes(page) || patientPages.includes(page)) {
            alert("Please login first!");
            window.location.href = "login.html";
        }
    }
});

// ===============================
// Register
// ===============================
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const data = await apiRequest("/auth/register", "POST", { name, email, password, role }, false);
        if (data.user_id) {
            alert("Registered! Please login.");
            window.location.href = "login.html";
        } else alert(data.detail || "Registration failed");
    };
}

// ===============================
// Login
// ===============================
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const data = await apiRequest("/auth/login", "POST", { email, password }, false);
        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert(data.detail || "Login failed");
        }
    };
}

// ===============================
// PATIENT: Load Doctors
// ===============================
if (document.getElementById("doctorsList")) {
    async function loadDoctors() {
        const data = await apiRequest("/doctors/all", "GET", null, false);
        const container = document.getElementById("doctorsList");
        container.innerHTML = "";

        data.forEach(doc => {
            container.innerHTML += `
                <div class="bg-white p-6 rounded shadow cursor-pointer">
                    <h3 class="text-xl font-bold">${doc.name}</h3>
                    <p class="text-gray-600">${doc.specialty}</p>
                    <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        onclick="viewDoctor(${doc.id})">View Details</button>
                </div>
            `;
        });
    }
    loadDoctors();
}

function viewDoctor(id) {
    localStorage.setItem("selected_doctor_id", id);
    window.location.href = "doctor-detail.html";
}

// ===============================
// PATIENT: Doctor Detail + Show Booking
// ===============================
if (document.getElementById("doctorDetail")) {
    const id = localStorage.getItem("selected_doctor_id");
    const bookForm = document.getElementById("bookForm");

    async function loadDoctorDetail() {
        const doctor = await apiRequest(`/doctors/${id}`, "GET", false);
        document.getElementById("doctorName").innerText = doctor.name;
        document.getElementById("doctorSpecialty").innerText = doctor.specialty;

        // Only show book form if logged in as patient
        if (!isLoggedIn()) {
            bookForm?.classList.add("hidden");
        } else {
            try {
                const payload = JSON.parse(atob(getToken().split(".")[1]));
                if (payload.role === "ADMIN") {
                    bookForm?.classList.add("hidden"); // Admin cannot book
                } else {
                    bookForm?.classList.remove("hidden");
                }
            } catch (e) {
                bookForm?.classList.add("hidden");
            }
        }

        // Optional: show doctor's schedules
        if (doctor.schedules && doctor.schedules.length > 0) {
            const schedDiv = document.createElement("div");
            schedDiv.className = "my-4 p-4 bg-gray-100 rounded";
            schedDiv.innerHTML = "<h3 class='font-bold mb-2'>Available Schedules:</h3>";
            doctor.schedules.forEach(s => {
                schedDiv.innerHTML += `<p>${s.day}: ${formatTime24to12(s.start_time)} - ${formatTime24to12(s.end_time)}</p>`;
            });
            bookForm?.parentNode.insertBefore(schedDiv, bookForm);
        }
    }

    loadDoctorDetail();
}

// ===============================
// PATIENT: Book Appointment
// ===============================
if (document.getElementById("bookForm")) {
    document.getElementById("bookForm").onsubmit = async (e) => {
        e.preventDefault();
        const doctor_id = parseInt(localStorage.getItem("selected_doctor_id"));
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        const data = await apiRequest("/appointments", "POST", { doctor_id, date, time });
        if (data.id) {
            alert("Appointment booked!");
            window.location.href = "appointments.html";
        } else alert(data.detail || "Booking failed");
    };
}

// ===============================
// PATIENT: My Appointments
// ===============================
if (document.getElementById("myAppointmentsList")) {
    async function loadMyAppointments() {
        const appointments = await apiRequest("/appointments/me");
        const container = document.getElementById("myAppointmentsList");
        container.innerHTML = "";

        if (!appointments.length) {
            container.innerHTML = "<p>No appointments yet.</p>";
            return;
        }

        appointments.forEach(appt => {
            container.innerHTML += `
                <div class="bg-white p-4 rounded shadow mb-2 flex justify-between">
                    <div>
                        <p class="font-bold">Dr. ${appt.doctor.name}</p>
                        <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
                    </div>
                    <button class="bg-red-600 text-white px-3 py-1 rounded"
                        onclick="cancelAppointment(${appt.id})">
                        Cancel
                    </button>
                </div>
            `;
        });
    }

    loadMyAppointments();
}

// Cancel Appointment
async function cancelAppointment(id) {
    const data = await apiRequest(`/appointments/${id}`, "DELETE");
    if (data.message) {
        alert(data.message);
        location.reload();
    } else {
        alert(data.detail || "Cancel failed");
    }
}

// ===============================
// ADMIN: Add Doctor
// ===============================
if (document.getElementById("addDoctorForm")) {
    document.getElementById("addDoctorForm").onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const specialty = document.getElementById("specialty").value;

        const data = await apiRequest("/doctors", "POST", { name, email, specialty });
        if (data.doctor_id) alert("Doctor added!");
        else alert(data.detail || "Failed");
    };
}

// ===============================
// ADMIN: Add Schedule
// ===============================
if (document.getElementById("addScheduleForm")) {
    document.getElementById("addScheduleForm").onsubmit = async (e) => {
        e.preventDefault();
        const doctor_id = Number(document.getElementById("doctor_id").value);
        const day = document.getElementById("day").value;
        const start_time = document.getElementById("start_time").value;
        const end_time = document.getElementById("end_time").value;

        const data = await apiRequest(`/doctors/${doctor_id}/schedule`, "POST", { day, start_time, end_time });
        if (data.schedule_id) alert("Schedule added!");
        else alert(data.detail || "Failed to add");
    };
}

// ===============================
// ADMIN: Load All Appointments
// ===============================
if (document.getElementById("bookingsList") || document.getElementById("allAppointmentsList")) {
    async function loadAllAppointments() {
        const appointments = await apiRequest("/appointments/all");
        const container = document.getElementById("bookingsList") || document.getElementById("allAppointmentsList");
        container.innerHTML = "";

        appointments.forEach(appt => {
            container.innerHTML += `
                <div class="bg-white p-4 rounded shadow mb-2">
                    <p class="font-bold">Dr. ${appt.doctor.name}</p>
                    <p>Patient: ${appt.patient.name}</p>
                    <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
                </div>
            `;
        });
    }

    loadAllAppointments();
}





























// //2----------------------------------------------------------------------------------------------------------

// // ===============================
// // Base API URL
// // ===============================
// const API_BASE = "http://127.0.0.1:8000";

// // ===============================
// // Utility: JWT token
// // ===============================
// function getToken() {
//     return localStorage.getItem("access_token");
// }

// function isLoggedIn() {
//     return !!getToken();
// }

// // ===============================
// // API request helper
// // ===============================
// async function apiRequest(path, method = "GET", body = null, includeAuth = true) {
//     const headers = { "Content-Type": "application/json" };

//     if (includeAuth) {
//         const token = getToken();
//         if (token) headers["Authorization"] = `Bearer ${token}`;
//     }

//     const res = await fetch(API_BASE + path, {
//         method,
//         headers,
//         body: body ? JSON.stringify(body) : null,
//     });

//     let data;
//     try {
//         data = await res.json();
//     } catch (e) {
//         data = { detail: "Invalid server response" };
//     }

//     return data;
// }

// // ===============================
// // Format 24h time to 12h
// // ===============================
// function formatTime24to12(time24) {
//     const [hour, minute] = time24.split(":");
//     let h = parseInt(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     h = h % 12 || 12;
//     return `${h}:${minute} ${ampm}`;
// }

// // ===============================
// // Navbar setup
// // ===============================
// window.addEventListener("DOMContentLoaded", () => {
//     const token = getToken();
//     const loginBtn = document.getElementById("loginLink") || document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerLink") || document.getElementById("registerBtn");
//     const logoutBtn = document.getElementById("logoutBtn");
//     const adminNav = document.getElementById("adminNav");

//     if (token) {
//         if (loginBtn) loginBtn.classList.add("hidden");
//         if (registerBtn) registerBtn.classList.add("hidden");
//         if (logoutBtn) logoutBtn.classList.remove("hidden");

//         try {
//             const payload = JSON.parse(atob(token.split(".")[1]));
//             if (payload.role === "ADMIN") {
//                 if (adminNav) adminNav.classList.remove("hidden");
//             }
//         } catch (e) {
//             console.log("Invalid token");
//         }
//     } else {
//         if (logoutBtn) logoutBtn.classList.add("hidden");
//     }
// });

// // ===============================
// // Logout
// // ===============================
// document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     localStorage.removeItem("access_token");
//     alert("Logged out!");
//     window.location.href = "login.html";
// });

// // ===============================
// // Page Protection
// // ===============================
// document.addEventListener("DOMContentLoaded", () => {
//     const token = getToken();
//     const page = window.location.pathname.split("/").pop();

//     const adminPages = ["dashboard.html", "add-doctor.html", "schedule.html", "bookings.html"];
//     const patientPages = ["doctor-detail.html", "book.html", "appointments.html"];

//     if (!token) {
//         if (adminPages.includes(page) || patientPages.includes(page)) {
//             alert("Please login first!");
//             window.location.href = "login.html";
//         }
//     }
// });

// // ===============================
// // Register
// // ===============================
// if (document.getElementById("registerForm")) {
//     document.getElementById("registerForm").onsubmit = async (e) => {
//         e.preventDefault();

//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const role = document.getElementById("role").value;

//         const data = await apiRequest("/auth/register", "POST", {
//             name,
//             email,
//             password,
//             role
//         }, false);

//         if (data.user_id) {
//             alert("Registered! Please login.");
//             window.location.href = "login.html";
//         } else alert(data.detail || "Registration failed");
//     };
// }

// // ===============================
// // Login
// // ===============================
// if (document.getElementById("loginForm")) {
//     document.getElementById("loginForm").onsubmit = async (e) => {
//         e.preventDefault();

//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;

//         const data = await apiRequest("/auth/login", "POST", {
//             email,
//             password
//         }, false);

//         if (data.access_token) {
//             localStorage.setItem("access_token", data.access_token);
//             alert("Login successful!");
//             window.location.href = "index.html";
//         } else {
//             alert(data.detail || "Login failed");
//         }
//     };
// }

// // ===============================
// // PATIENT: Load Doctors
// // ===============================
// if (document.getElementById("doctorsList")) {
//     async function loadDoctors() {
//         const data = await apiRequest("/doctors", "GET", null, false);
//         const doctors = data.doctors || data;

//         const container = document.getElementById("doctorsList");
//         container.innerHTML = "";

//         doctors.forEach(doc => {
//             container.innerHTML += `
//                 <div class="bg-white p-6 rounded shadow cursor-pointer">
//                     <h3 class="text-xl font-bold">${doc.name}</h3>
//                     <p class="text-gray-600">${doc.specialty}</p>
//                     <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//                         onclick="viewDoctor(${doc.id})">
//                         View Details
//                     </button>
//                 </div>
//             `;
//         });
//     }
//     loadDoctors();
// }

// function viewDoctor(id) {
//     localStorage.setItem("selected_doctor_id", id);
//     window.location.href = "doctor-detail.html";
// }

// // ===============================
// // PATIENT: Doctor Detail
// // ===============================
// if (document.getElementById("doctorDetail")) {
//     const id = localStorage.getItem("selected_doctor_id");

//     async function loadDoctorDetail() {
//         const doctor = await apiRequest(`/doctors/${id}`, "GET", null, false);

//         document.getElementById("doctorName").innerText = doctor.name;
//         document.getElementById("doctorSpecialty").innerText = doctor.specialty;
//     }

//     loadDoctorDetail();
// }

// // ===============================
// // PATIENT: Book Appointment
// // ===============================
// if (document.getElementById("bookForm")) {
//     document.getElementById("bookForm").onsubmit = async (e) => {
//         e.preventDefault();

//         const doctor_id = parseInt(localStorage.getItem("selected_doctor_id"));
//         const date = document.getElementById("date").value;
//         const time = document.getElementById("time").value;

//         const data = await apiRequest("/appointments", "POST", {
//             doctor_id,
//             date,
//             time
//         });

//         if (data.id) {
//             alert("Appointment booked!");
//             window.location.href = "appointments.html";
//         } else {
//             alert(data.detail || "Booking failed");
//         }
//     };
// }

// // ===============================
// // PATIENT: My Appointments
// // ===============================
// if (document.getElementById("myAppointmentsList")) {
//     async function loadMyAppointments() {
//         const appointments = await apiRequest("/appointments/me");

//         const container = document.getElementById("myAppointmentsList");
//         container.innerHTML = "";

//         if (!appointments.length) {
//             container.innerHTML = "<p>No appointments yet.</p>";
//             return;
//         }

//         appointments.forEach(appt => {
//             container.innerHTML += `
//                 <div class="bg-white p-4 rounded shadow mb-2 flex justify-between">
//                     <div>
//                         <p class="font-bold">Dr. ${appt.doctor.name}</p>
//                         <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
//                     </div>
//                     <button class="bg-red-600 text-white px-3 py-1 rounded"
//                         onclick="cancelAppointment(${appt.id})">
//                         Cancel
//                     </button>
//                 </div>
//             `;
//         });
//     }

//     loadMyAppointments();
// }

// // Cancel Appointment
// async function cancelAppointment(id) {
//     const data = await apiRequest(`/appointments/${id}`, "DELETE");

//     if (data.message) {
//         alert(data.message);
//         location.reload();
//     } else {
//         alert(data.detail || "Cancel failed");
//     }
// }

// // ===============================
// // ADMIN: Add Doctor
// // ===============================
// if (document.getElementById("addDoctorForm")) {
//     document.getElementById("addDoctorForm").onsubmit = async (e) => {
//         e.preventDefault();

//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const specialty = document.getElementById("specialty").value;

//         const data = await apiRequest("/doctors", "POST", {
//             name,
//             email,
//             specialty
//         });

//         if (data.doctor_id) alert("Doctor added!");
//         else alert(data.detail || "Failed");
//     };
// }

// // ===============================
// // ADMIN: Add Schedule
// // ===============================
// if (document.getElementById("addScheduleForm")) {
//     document.getElementById("addScheduleForm").onsubmit = async (e) => {
//         e.preventDefault();

//         const doctor_id = Number(document.getElementById("doctor_id").value);
//         const day = document.getElementById("day").value;
//         const start_time = document.getElementById("start_time").value;
//         const end_time = document.getElementById("end_time").value;

//         const data = await apiRequest(`/doctors/${doctor_id}/schedule`, "POST", {
//             day, start_time, end_time
//         });

//         if (data.schedule_id) alert("Schedule added!");
//         else alert(data.detail || "Failed to add");
//     };
// }

// // ===============================
// // ADMIN: Load All Appointments
// // ===============================
// if (document.getElementById("bookingsList") || document.getElementById("allAppointmentsList")) {
//     async function loadAllAppointments() {
//         const appointments = await apiRequest("/appointments/all");

//         const container = document.getElementById("bookingsList") ||
//             document.getElementById("allAppointmentsList");

//         container.innerHTML = "";

//         appointments.forEach(appt => {
//             container.innerHTML += `
//                 <div class="bg-white p-4 rounded shadow mb-2">
//                     <p class="font-bold">Dr. ${appt.doctor.name}</p>
//                     <p>Patient: ${appt.patient.name}</p>
//                     <p>${appt.date} at ${formatTime24to12(appt.time)}</p>
//                 </div>
//             `;
//         });
//     }

//     loadAllAppointments();
// }





// // // ===============================
// // // Base API URL
// // // ===============================
// // const API_BASE = "http://127.0.0.1:8000"; // Change if deployed

// // // ===============================
// // // JWT Token Utility
// // // ===============================
// // function getToken() {
// //     return localStorage.getItem("access_token");
// // }

// // function isLoggedIn() {
// //     return !!getToken();
// // }

// // // ===============================
// // // API Request Utility
// // // ===============================
// // async function apiRequest(path, method = "GET", body = null, isAuth = true) {
// //     const headers = { "Content-Type": "application/json" };
// //     if (isAuth) headers["Authorization"] = `Bearer ${getToken()}`;
// //     const res = await fetch(API_BASE + path, {
// //         method,
// //         headers,
// //         body: body ? JSON.stringify(body) : null
// //     });
// //     return res.json();
// // }

// // // ===============================
// // // Time Formatting
// // // ===============================
// // function formatTime24to12(time24) {
// //     if (!time24) return "";
// //     const [hour, minute] = time24.split(":");
// //     let h = parseInt(hour);
// //     const ampm = h >= 12 ? "PM" : "AM";
// //     h = h % 12 || 12;
// //     return `${h}:${minute} ${ampm}`;
// // }

// // // ===============================
// // // Navbar & Logout
// // // ===============================
// // window.addEventListener("DOMContentLoaded", () => {
// //     const token = getToken();
// //     const loginBtn = document.getElementById("loginLink") || document.getElementById("loginBtn");
// //     const registerBtn = document.getElementById("registerLink") || document.getElementById("registerBtn");
// //     const logoutBtn = document.getElementById("logoutBtn");
// //     const viewDoctorsNav = document.getElementById("doctorsNav") || document.getElementById("heroDoctorsBtn");
// //     const adminNav = document.getElementById("adminNav");

// //     if (token) {
// //         if (loginBtn) loginBtn.classList.add("hidden");
// //         if (registerBtn) registerBtn.classList.add("hidden");
// //         if (logoutBtn) logoutBtn.classList.remove("hidden");
// //         if (viewDoctorsNav) viewDoctorsNav.classList.remove("hidden");

// //         try {
// //             const payload = JSON.parse(atob(token.split(".")[1]));
// //             if (payload.role === "ADMIN") {
// //                 if (adminNav) adminNav.classList.remove("hidden");
// //                 if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
// //             }
// //         } catch (e) {
// //             console.error("Invalid token", e);
// //         }
// //     } else {
// //         if (loginBtn) loginBtn.classList.remove("hidden");
// //         if (registerBtn) registerBtn.classList.remove("hidden");
// //         if (logoutBtn) logoutBtn.classList.add("hidden");
// //         if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
// //         if (adminNav) adminNav.classList.add("hidden");
// //     }
// // });

// // document.getElementById("logoutBtn")?.addEventListener("click", () => {
// //     localStorage.removeItem("access_token");
// //     alert("Logged out successfully!");
// //     window.location.reload();
// // });

// // // ===============================
// // // Auth Pages
// // // ===============================
// // if (document.getElementById("registerForm")) {
// //     document.getElementById("registerForm").onsubmit = async (e) => {
// //         e.preventDefault();
// //         const name = document.getElementById("name").value;
// //         const email = document.getElementById("email").value;
// //         const password = document.getElementById("password").value;
// //         const role = document.getElementById("role").value;
// //         const data = await apiRequest("/auth/register", "POST", { name, email, password, role }, false);
// //         if (data.user_id) {
// //             alert("Registered successfully! Please login.");
// //             window.location.href = "login.html";
// //         } else alert(data.detail || "Registration failed");
// //     };
// // }

// // if (document.getElementById("loginForm")) {
// //     document.getElementById("loginForm").onsubmit = async (e) => {
// //         e.preventDefault();
// //         const email = document.getElementById("email").value;
// //         const password = document.getElementById("password").value;
// //         const data = await apiRequest("/auth/login", "POST", { email, password }, false);
// //         if (data.access_token) {
// //             localStorage.setItem("access_token", data.access_token);
// //             alert("Login successful!");
// //             window.location.href = "index.html";
// //         } else alert(data.detail || "Login failed");
// //     };
// // }

// // // ===============================
// // // Admin: Add Doctor
// // // ===============================
// // if (document.getElementById("addDoctorForm")) {
// //     document.getElementById("addDoctorForm").onsubmit = async (e) => {
// //         e.preventDefault();
// //         const name = document.getElementById("name").value;
// //         const email = document.getElementById("email").value;
// //         const specialty = document.getElementById("specialty").value;

// //         // Correct endpoint for admin doctors
// //         const data = await apiRequest("/doctors", "POST", { name, email, specialty });

// //         if (data.doctor_id) alert("Doctor added successfully!");
// //         else alert(data.detail || "Failed to add doctor");
// //     };
// // }

// // // ===============================
// // // Admin: Set Doctor Schedule
// // // ===============================
// // if (document.getElementById("addScheduleForm")) {
// //     document.getElementById("addScheduleForm").onsubmit = async (e) => {
// //         e.preventDefault();
// //         const doctor_id = document.getElementById("doctor_id").value;
// //         const day = document.getElementById("day").value;
// //         const start_time = document.getElementById("start_time").value;
// //         const end_time = document.getElementById("end_time").value;

// //         const data = await apiRequest(`/doctors/${doctor_id}/schedule`, "POST", {
// //             day: parseInt(day),
// //             start_time,
// //             end_time
// //         });

// //         if (data.schedule_id) alert("Schedule added!");
// //         else alert(data.detail || "Failed to add schedule");
// //     };
// // }

// // // ===============================
// // // Load All Doctors
// // // ===============================
// // if (document.getElementById("doctorsList")) {
// //     async function loadDoctors() {
// //         const data = await apiRequest("/doctors", "GET", null, false);
// //         const doctors = data.doctors || data;
// //         const container = document.getElementById("doctorsList");
// //         container.innerHTML = "";
// //         doctors.forEach(doc => {
// //             const div = document.createElement("div");
// //             div.className = "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer";
// //             div.innerHTML = `
// //                 <h3 class="text-xl font-bold">${doc.name}</h3>
// //                 <p class="text-gray-600">${doc.specialty}</p>
// //                 <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="viewDoctor(${doc.id})">View Details</button>
// //             `;
// //             container.appendChild(div);
// //         });
// //     }
//     loadDoctors();
// }

// // ===============================
// // Appointments (Patient + Admin)
// // ===============================
// async function loadAppointments(isAdmin = false) {
//     let endpoint = isAdmin ? "/appointments/all" : "/appointments/me";
//     const data = await apiRequest(endpoint);
//     const appointments = data.appointments || data || [];
//     const container = isAdmin
//         ? document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")
//         : document.getElementById("myAppointmentsList");

//     if (!container) return;
//     container.innerHTML = "";

//     if (!appointments.length) {
//         container.innerHTML = "<p class='text-gray-500'>No appointments found.</p>";
//         return;
//     }

//     appointments.forEach(appt => {
//         const doctorName = appt.doctor?.name || "Unknown";
//         const patientName = appt.patient?.name || "Unknown";
//         const date = appt.date || "";
//         const time = formatTime24to12(appt.time || "");

//         const div = document.createElement("div");
//         div.className = "bg-white p-4 rounded shadow flex justify-between items-center mb-2";
//         div.innerHTML = `
//             <div>
//                 <p class="font-bold">Dr. ${doctorName}</p>
//                 <p>Patient: ${patientName}</p>
//                 <p>${date} at ${time}</p>
//             </div>
//             ${!isAdmin ? `<button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onclick="cancelAppointment(${appt.id})">Cancel</button>` : ""}
//         `;
//         container.appendChild(div);
//     });
// }

// // Load appointments automatically
// if (document.getElementById("myAppointmentsList")) loadAppointments(false);
// if (document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")) loadAppointments(true);

// // ===============================
// // Cancel Appointment
// // ===============================
// async function cancelAppointment(id) {
//     const data = await apiRequest(`/appointments/${id}`, "DELETE");
//     if (data.message) {
//         alert(data.message);
//         if (document.getElementById("myAppointmentsList")) loadAppointments(false);
//         if (document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")) loadAppointments(true);
//     } else alert(data.detail || "Cancel failed");

// }

























// // // ===============================
// // // Base API URL
// // // ===============================
// // const API_BASE = "http://127.0.0.1:8000";

// // // ===============================
// // // JWT Token Utility
// // // ===============================
// // function getToken() {
// //     return localStorage.getItem("access_token");
// // }

// // function isLoggedIn() {
//     return !!getToken();
// }

// // ===============================
// // API Request Utility
// // ===============================
// async function apiRequest(path, method = "GET", body = null, isAuth = true) {
//     const headers = { "Content-Type": "application/json" };
//     if (isAuth) headers["Authorization"] = `Bearer ${getToken()}`;
//     const res = await fetch(API_BASE + path, {
//         method,
//         headers,
//         body: body ? JSON.stringify(body) : null
//     });
//     return res.json();
// }

// // ===============================
// // Time Formatting
// // ===============================
// function formatTime24to12(time24) {
//     if (!time24) return "";
//     const [hour, minute] = time24.split(":");
//     let h = parseInt(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     h = h % 12 || 12;
//     return `${h}:${minute} ${ampm}`;
// }

// // ===============================
// // Navbar & Logout
// // ===============================
// window.addEventListener("DOMContentLoaded", () => {
//     const token = getToken();
//     const loginBtn = document.getElementById("loginLink") || document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerLink") || document.getElementById("registerBtn");
//     const logoutBtn = document.getElementById("logoutBtn");
//     const viewDoctorsNav = document.getElementById("doctorsNav") || document.getElementById("heroDoctorsBtn");
//     const adminNav = document.getElementById("adminNav");

//     if (token) {
//         if (loginBtn) loginBtn.classList.add("hidden");
//         if (registerBtn) registerBtn.classList.add("hidden");
//         if (logoutBtn) logoutBtn.classList.remove("hidden");
//         if (viewDoctorsNav) viewDoctorsNav.classList.remove("hidden");

//         try {
//             const payload = JSON.parse(atob(token.split(".")[1]));
//             if (payload.role === "ADMIN") {
//                 if (adminNav) adminNav.classList.remove("hidden");
//                 if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
//             }
//         } catch (e) {
//             console.error("Invalid token", e);
//         }
//     } else {
//         if (loginBtn) loginBtn.classList.remove("hidden");
//         if (registerBtn) registerBtn.classList.remove("hidden");
//         if (logoutBtn) logoutBtn.classList.add("hidden");
//         if (viewDoctorsNav) viewDoctorsNav.classList.add("hidden");
//         if (adminNav) adminNav.classList.add("hidden");
//     }
// });

// document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     localStorage.removeItem("access_token");
//     alert("Logged out successfully!");
//     window.location.reload();
// });

// // ===============================
// // Auth Pages
// // ===============================
// if (document.getElementById("registerForm")) {
//     document.getElementById("registerForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const role = document.getElementById("role").value;
//         const data = await apiRequest("/auth/register", "POST", { name, email, password, role }, false);
//         if (data.user_id) {
//             alert("Registered successfully! Please login.");
//             window.location.href = "login.html";
//         } else alert(data.detail || "Registration failed");
//     };
// }

// if (document.getElementById("loginForm")) {
//     document.getElementById("loginForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const data = await apiRequest("/auth/login", "POST", { email, password }, false);
//         if (data.access_token) {
//             localStorage.setItem("access_token", data.access_token);
//             alert("Login successful!");
//             window.location.href = "index.html";
//         } else alert(data.detail || "Login failed");
//     };
// }

// // ===============================
// // Admin: Add Doctor
// // ===============================
// if (document.getElementById("addDoctorForm")) {
//     document.getElementById("addDoctorForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const specialty = document.getElementById("specialty").value;

//         const data = await apiRequest("/doctors", "POST", { name, email, specialty });
//         if (data.id) alert("Doctor added successfully!");
//         else alert(data.detail || "Failed to add doctor");
//     };
// }

// // ===============================
// // Admin: Set Doctor Schedule
// // ===============================
// if (document.getElementById("addScheduleForm")) {
//     document.getElementById("addScheduleForm").onsubmit = async (e) => {
//         e.preventDefault();
//         const doctor_id = parseInt(document.getElementById("doctor_id").value);
//         const dayIndex = parseInt(document.getElementById("day").value); // 0-6
//         const days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
//         const day = days[dayIndex];

//         const start_time = document.getElementById("start_time").value;
//         const end_time = document.getElementById("end_time").value;

//         const data = await apiRequest(`/doctors/${doctor_id}/schedule`, "POST", { day, start_time, end_time });
//         if (data.id) alert("Schedule added successfully!");
//         else alert(data.detail || "Failed to add schedule");
//     };
// }

// // ===============================
// // Load All Doctors
// // ===============================
// if (document.getElementById("doctorsList")) {
//     async function loadDoctors() {
//         const data = await apiRequest("/doctors", "GET", null, false);
//         const doctors = data || [];
//         const container = document.getElementById("doctorsList");
//         container.innerHTML = "";

//         doctors.forEach(doc => {
//             const div = document.createElement("div");
//             div.className = "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer";
//             div.innerHTML = `
//                 <h3 class="text-xl font-bold">${doc.name}</h3>
//                 <p class="text-gray-600">${doc.specialty}</p>
//                 <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="viewDoctor(${doc.id})">View Details</button>
//             `;
//             container.appendChild(div);
//         });
//     }
//     loadDoctors();
// }

// function viewDoctor(id) {
//     localStorage.setItem("selected_doctor_id", id);
//     window.location.href = "doctor-detail.html";
// }

// // ===============================
// // Load Appointments (Patient + Admin)
// // ===============================
// async function loadAppointments(isAdmin = false) {
//     const endpoint = isAdmin ? "/appointments/all" : "/appointments/me";
//     const data = await apiRequest(endpoint) || [];
//     const appointments = data.appointments || data || [];
//     const container = isAdmin 
//         ? document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")
//         : document.getElementById("myAppointmentsList");

//     if (!container) return;
//     container.innerHTML = "";

//     if (!appointments.length) {
//         container.innerHTML = "<p class='text-gray-500'>No appointments found.</p>";
//         return;
//     }

//     appointments.forEach(appt => {
//         const doctorName = appt.doctor?.name || "Unknown";
//         const patientName = appt.patient?.name || "Unknown";
//         const date = appt.date || "";
//         const time = formatTime24to12(appt.time || "");

//         const div = document.createElement("div");
//         div.className = "bg-white p-4 rounded shadow flex justify-between items-center mb-2";
//         div.innerHTML = `
//             <div>
//                 <p class="font-bold">Dr. ${doctorName}</p>
//                 <p>Patient: ${patientName}</p>
//                 <p>${date} at ${time}</p>
//             </div>
//             ${!isAdmin ? `<button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onclick="cancelAppointment(${appt.id})">Cancel</button>` : ""}
//         `;
//         container.appendChild(div);
//     });
// }

// // Load appointments automatically
// if (document.getElementById("myAppointmentsList")) loadAppointments(false);
// if (document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")) loadAppointments(true);

// // ===============================
// // Cancel Appointment
// // ===============================
// async function cancelAppointment(id) {
//     const data = await apiRequest(`/appointments/${id}`, "DELETE");
//     if (data.message) {
//         alert(data.message);
//         if (document.getElementById("myAppointmentsList")) loadAppointments(false);
//         if (document.getElementById("allAppointmentsList") || document.getElementById("bookingsList")) loadAppointments(true);
//     } else alert(data.detail || "Cancel failed");
// }
