function logoutUser(event) {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("uname");
  window.location.href = "login.html";
}

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const uname = localStorage.getItem("uname");

async function initializePage() {
  const message = document.getElementById("message");
  message.innerHTML = `Welcome ${uname}`;

  if (!token) {
    alert("You are not logged in.");
    window.location.href = "login.html";
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } else {
    try {
      const response = await fetch("https://thuhtet.com/creator-getVideos", {
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
      alert("You are not authorized to view this page. Please log in.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // window.location.href = `${role}.html`;
      window.location.href = "login.html";
    }
  }
}

const logout = document.getElementById("logout");
logout.addEventListener("click", logoutUser);

async function createChannel(event) {
  event.preventDefault();

  const channelName = document.getElementById("channelName").value.trim();

  try {
    const response = await fetch("http://localhost:5000/creator-startChannel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name: channelName }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      document.getElementById("createChannelForm").reset();
      const createChannelModal = new bootstrap.Modal(
        document.getElementById("createChannelModal")
      );
      createChannelModal.hide();
      populateChannelsDropdown();
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Error creating channel:", error);
    alert("Failed to create channel. Please try again.");
  }
}

async function fetchChannels() {
  try {
    const response = await fetch(
      "http://localhost:5000/creator-getChannelByCreator",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ creatorName: uname }),
      }
    );

    if (response.ok) {
      const channels = await response.json();
      return channels;
    } else {
      throw new Error("Failed to fetch channels");
    }
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
}

async function populateChannelsDropdown() {
  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownMenu.innerHTML = "";

  const channels = await fetchChannels();

  const channelsArray = Object.values(channels);

  channelsArray.forEach((channel) => {
    const menuItem = document.createElement("li");
    menuItem.innerHTML = `<button class="dropdown-item" type="button">${channel.name}</button>`;

    dropdownMenu.appendChild(menuItem);

    menuItem.addEventListener("click", async () => {
      const message = document.getElementById("message");

      message.innerHTML = `${channel.name}`;

      const videoGrid = document.getElementById("videoGrid");
      videoGrid.innerHTML = "";
      try {
        const response = await fetch(
          "http://localhost:5000/creator-getVideoByChannel",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ channelName: channel.name }),
          }
        );

        if (response.ok) {
          const videos = await response.json();
          displayVideos(videos);
        } else {
          throw new Error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    });
  });
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

async function addVideo(event) {
  event.preventDefault();

  const title = document.getElementById("videoTitle").value.trim();
  const url = document.getElementById("videoURL").value.trim();
  const thumbnail = document.getElementById("videoThumbnail").value.trim();
  const description = document.getElementById("videoDescription").value.trim();
  const channelName = document.getElementById("videoChannel").value.trim();

  try {
    const response = await fetch("http://localhost:5000/creator-uploadVideo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: title,
        url: url,
        thumbnail: thumbnail,
        description: description,
        channelName: channelName,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      document.getElementById("upVidForm").reset();
      const upVidModal = new bootstrap.Modal(
        document.getElementById("upVidModal")
      );
      upVidModal.hide();
      const videos = await initializePage();
      displayVideos(videos);
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Error uploading video:", error);
    alert("Failed to upload video. Please try again.");
  }
}

async function deleteChannel(event) {
  event.preventDefault();

  const channelName = document.getElementById("dltChannelName").value;
  console.log(channelName);
  console.log(typeof channelName);

  try {
    const response = await fetch(
      "http://localhost:5000/creator-deleteChannel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name: channelName }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      document.getElementById("deleteChannelForm").reset();
      const deleteChannelModal = new bootstrap.Modal(
        document.getElementById("deleteChannelModal")
      );
      deleteChannelModal.hide();
      populateChannelsDropdown();
      const videos = await initializePage();
      displayVideos(videos);
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Error deleting channel:", error);
    alert("Failed to delete channel. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const createChannelBtn = document.getElementById("createChannel");
  createChannelBtn.addEventListener("click", () => {
    const createChannelModal = new bootstrap.Modal(
      document.getElementById("createChannelModal")
    );
    createChannelModal.show();
  });

  const saveChannelBtn = document.getElementById("saveChannelBtn");
  saveChannelBtn.addEventListener("click", createChannel);

  const home = document.getElementById("homeBtn");
  home.addEventListener("click", async () => {
    const videos = await initializePage();
    const videoGrid = document.getElementById("videoGrid");
    videoGrid.innerHTML = "";
    displayVideos(videos);
  });

  const addVideoBtn = document.getElementById("addVideoBtn");
  addVideoBtn.addEventListener("click", () => {
    const upVidModal = new bootstrap.Modal(
      document.getElementById("upVidModal")
    );
    upVidModal.show();
  });

  const upVidBtn = document.getElementById("upVidBtn");
  upVidBtn.addEventListener("click", addVideo);

  const deleteChannelBtn = document.getElementById("deleteChannelBtn");
  deleteChannelBtn.addEventListener("click", () => {
    const deleteChannelModal = new bootstrap.Modal(
      document.getElementById("deleteChannelModal")
    );
    deleteChannelModal.show();
  });

  const deleteChannelSubmitBtn = document.getElementById(
    "deleteChannelSubmitBtn"
  );
  deleteChannelSubmitBtn.addEventListener("click", deleteChannel);

  populateChannelsDropdown();
});

initializePage().then((videos) => {
  displayVideos(videos);
});
