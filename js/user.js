const jwt_decode = require("jwt-decode");

function logoutUser(event) {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

function checkTokenExpiry(token) {
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp < currentTime) {
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  }
}

if (token) {
  checkTokenExpiry(token);
}

async function initializePage() {
  if (!token) {
    alert("You are not logged in");
    window.location.href = "login.html";
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } else {
    try {
      const response = await fetch("https://thuhtet.com/user-getVideos", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Not authorized");
      }
    } catch (error) {
      alert("You are not authorized to access this page");
      // window.location.href = `${role}.html`;
      window.location.href = "login.html";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }
}

function displayVideos(videos) {
  const videoArray = Object.values(videos);

  const videoModal = new bootstrap.Modal(document.getElementById("videoModal"));
  const videoGrid = document.getElementById("videoGrid");

  videoGrid.innerHTML = "";

  videoArray.forEach((video) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const card = document.createElement("div");
    card.className = "card video-card";
    card.innerHTML = `
      <img  class="card-img-top" alt="${video.title}">
      <div class="card-body">
        <h5 class="card-title">${video.title}</h5>
        <p class="card-text">${video.description}</p>
        <p class="card-text">Channel: ${video.channel.name}</p>
      </div>
    `;

    const thumbnailImg = new Image();
    thumbnailImg.src = video.thumbnail;

    thumbnailImg.onload = function () {
      card.querySelector("img").src = thumbnailImg.src;
    };

    thumbnailImg.onerror = function () {
      card.querySelector("img").src = "https://via.placeholder.com/150";
    };

    card.querySelector("img").style.width = "100%";

    card.querySelector("img").style.height = "150px";

    card.addEventListener("click", () => {
      modalVideo.src = video.url;
      videoModal.show();
    });

    col.appendChild(card);
    videoGrid.appendChild(col);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", logoutUser);
});

initializePage().then((videos) => {
  displayVideos(videos);
});
