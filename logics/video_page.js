function getClickedVideo() {
  let videoData = JSON.parse(localStorage.getItem("PageVideos"));
  let clickedVideoObject = JSON.parse(
    localStorage.getItem("clickedVideoObject")
  );
  console.log(clickedVideoObject);
  videoPageData(videoData, clickedVideoObject);
  let userName = localStorage.getItem("currentUser");
  let historyLocal = JSON.parse(localStorage.getItem("historyData" + userName));
  if (historyLocal != null) {
    historyLocal = historyLocal.filter((element) => {
      if (element.id.videoId != clickedVideoObject.id.videoId) {
        return element;
      }
    });
    localStorage.setItem(
      "historyData" + userName,
      JSON.stringify(historyLocal.reverse())
    );
  }
  historyVideo(clickedVideoObject);
}

getClickedVideo();
function videoPageData(data, clickedVideo) {
  let video = document.getElementById("videoIframe");
  video.setAttribute(
    "src",
    "https://www.youtube.com/embed/" +
      clickedVideo.id.videoId +
      "?controls=1&modestbranding=1&rel=0&showinfo=0&autoplay=0"
  );

  let clickedVideoTitle = document.getElementById("clickedVideoTitle");
  let videoTitle = clickedVideo.snippet.title;
  if (videoTitle.includes("&#39;")) {
    videoTitle = videoTitle.replaceAll("&#39;", "'");
  } else if (videoTitle.includes("&amp;")) {
    videoTitle = videoTitle.replaceAll("&amp;", "&");
  } else if (videoTitle.includes("&34;")) {
    videoTitle = videoTitle.replaceAll("&34;", "&");
  } else if (videoTitle.includes("&amp;")) {
    videoTitle = videoTitle.replaceAll("&amp;", '"');
  } else if (videoTitle.includes("&amp")) {
    videoTitle = videoTitle.replaceAll("&amp", "&");
  }

  clickedVideoTitle.innerText = videoTitle;
  let videoContainer = document.getElementById("video-container");
  videoContainer.setAttribute("class", "videoContainer-2");
  videoContainer.innerHTML = "";
  localStorage.setItem("PageVideos", JSON.stringify(data));
  let thumbnailStatic = "";
  let title = "";
  let videoId = "";
  let channelTitle = "";
  let uploadDate = "";
  let videoIdObject = {};
  let videoBoxes = [];
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].id.videoId != undefined &&
      data[i].id.videoId != clickedVideo.id.videoId
    ) {
      //=====>Set required detaisl<=====
      thumbnailStatic = data[i].snippet.thumbnails.high.url;
      title = data[i].snippet.title.slice(0, 80) + "....";
      if (title.includes("&#39;")) {
        title = title.replaceAll("&#39;", "'");
      }
      videoId = data[i].id.videoId;
      channelTitle = "Channel: " + data[i].snippet.channelTitle;
      uploadDate =
        data[i].snippet.publishTime.slice(8, 10) +
        "/" +
        data[i].snippet.publishTime.slice(5, 7) +
        "/" +
        data[i].snippet.publishTime.slice(0, 4);
      //=====>Video boxes creation<======
      let videoBox = document.createElement("div");
      let videoLinkBox = document.createElement("a");
      videoLinkBox.setAttribute("href", "../static/video_page.html");
      videoLinkBox.setAttribute("id", i);
      videoBoxes.push(videoLinkBox);
      videoIdObject[i] = data[i];
      videoContainer.appendChild(videoLinkBox);
      videoBox.setAttribute("class", "video-boxes");
      videoLinkBox.appendChild(videoBox);
      let thumbnailBox = document.createElement("div");
      thumbnailBox.setAttribute("id", "thumpnail");
      thumbnailBox.setAttribute("class", "thumpnail");
      thumbnailBox.style.backgroundImage = `url(${thumbnailStatic})`;
      let titleBox = document.createElement("div");
      titleBox.setAttribute("class", "title");
      let videoDetailsBox = document.createElement("div");
      videoDetailsBox.setAttribute("class", "video-details");
      videoBox.append(thumbnailBox, titleBox, videoDetailsBox);
      let titleWords = document.createElement("h4");
      titleWords.textContent = title;
      titleBox.appendChild(titleWords);
      let viewsBox = document.createElement("div");
      viewsBox.setAttribute("class", "channelTitle");
      viewsBox.textContent = channelTitle;
      let uploadDateBox = document.createElement("div");
      uploadDateBox.setAttribute("class", "upload-date");
      uploadDateBox.textContent = "Date: " + uploadDate;
      videoDetailsBox.append(viewsBox, uploadDateBox);
    }

    getVideoId(videoIdObject, videoBoxes);
  }
  getLikedVideo(clickedVideo);
  getWatchLaterVideo(clickedVideo);
}

function getVideoId(videoIds, videoBoxes) {
  for (let box of videoBoxes) {
    box.addEventListener("click", function () {
      for (let id in videoIds) {
        console.log(id, box.id);
        if (id == box.id) {
          localStorage.setItem(
            "clickedVideoObject",
            JSON.stringify(videoIds[id])
          );
        }
      }
    });
  }
}
function getMenuElements() {
  let menu = document.querySelector(".menu");
  let menuElements = menu.childNodes;
  let homeImg = document.getElementById("homeImg");
  let historyImg = document.getElementById("historyImg");
  let watchLaterImg = document.getElementById("watchLaterImg");
  let likeVideoImg = document.getElementById("likeVideoImg");

  let imgArray = [homeImg, historyImg, watchLaterImg, likeVideoImg];
  for (let ele of menuElements) {
    ele.addEventListener("click", function () {
      deleteMenuEffect();
      ele.classList.add("selected-menu");
      ele.classList.add("selected-menu-font");
    });
  }
  redirectPage(menuElements, imgArray);
}

function deleteMenuEffect() {
  document.querySelector(".selected-menu")?.classList.remove("selected-menu");
  document
    .querySelector(".selected-menu-font")
    ?.classList.remove("selected-menu-font");
}

getMenuElements();

function getQuery() {
  let searchBox = document.getElementById("search-query");
  let userName = localStorage.getItem("currentUser");

  let queryArray = [];
  let queryArrayLocal = JSON.parse(
    localStorage.getItem("queryArray" + userName)
  );
  if (queryArrayLocal != null) {
    queryArray = queryArrayLocal;
  }
  searchBox.addEventListener("change", function () {
    let query = "";
    const alphabet = RegExp(/[a-z0-9]/i);
    if (alphabet.test(searchBox.value)) {
      query = searchBox.value;
      localStorage.setItem("query", query);
      queryArray.push(query);
      localStorage.setItem("queryArray" + userName, JSON.stringify(queryArray));
      window.location.href = "../index.html";
    }
  });
}

getQuery();

function getLikedVideo(likedData) {
  let likedVideosArray = [];
  let userName = localStorage.getItem("currentUser");
  console.log(userName);
  let likedVideoLocal = JSON.parse(
    localStorage.getItem("likedVideoData" + userName)
  );
  if (likedVideoLocal != null) {
    likedVideosArray = likedVideoLocal;
  }
  if (JSON.parse(localStorage.getItem("likedVideoData" + userName))) {
    likedVideosArray = JSON.parse(
      localStorage.getItem("likedVideoData" + userName)
    );
  }
  let likedElement = document.getElementById("likedVideo");
  likedElement.addEventListener("click", function () {
    if (likedElement.src.endsWith("/photos/heart-regular.svg")) {
      likedElement.setAttribute("src", "../photos/heart-solid.svg");
      likedElement.classList.add("likeAnimation");
      likedVideosArray.push(likedData);
      localStorage.setItem(
        "likedVideoData" + userName,
        JSON.stringify(likedVideosArray.reverse())
      );
    } else {
      likedElement.setAttribute("src", "../photos/heart-regular.svg");
      likedElement.classList.remove("likeAnimation");
      likedVideosArray = likedVideosArray.filter((value) => {
        if (value.id.videoId != likedData.id.videoId) {
          return value;
        }
      });
      localStorage.setItem(
        "likedVideoData" + userName,
        JSON.stringify(likedVideosArray)
      );
    }
  });
  changeLikeLink(likedData, likedVideosArray);
}

function changeLikeLink(likedData, likedVideosArray) {
  let likedElement = document.getElementById("likedVideo");
  for (let i = 0; i < likedVideosArray.length; i++) {
    if (likedVideosArray[i].id.videoId == likedData.id.videoId) {
      likedElement.setAttribute("src", "../photos/heart-solid.svg");
    }
  }
}

function getWatchLaterVideo(watchLaterData) {
  let watchLaterArray = [];
  let userName = localStorage.getItem("currentUser");
  let watchLaterLocal = JSON.parse(
    localStorage.getItem("watchLaterArray" + userName)
  );
  if (watchLaterLocal != null) {
    watchLaterArray = watchLaterLocal;
  }
  let watchLaterElement = document.getElementById("watchLater");
  watchLaterElement.addEventListener("click", function () {
    if (watchLaterElement.src.endsWith("/photos/clock-regular.svg")) {
      watchLaterElement.setAttribute("src", "../photos/clock-solid.svg");
      watchLaterElement.classList.add("likeAnimation");
      watchLaterArray.push(watchLaterData);
      localStorage.setItem(
        "watchLaterArray" + userName,
        JSON.stringify(watchLaterArray.reverse())
      );
    } else {
      watchLaterElement.setAttribute("src", "../photos/clock-regular.svg");
      watchLaterElement.classList.remove("likeAnimation");
      watchLaterArray = watchLaterArray.filter((value) => {
        if (value.id.videoId != watchLaterData.id.videoId) {
          return value;
        }
      });
      localStorage.setItem(
        "watchLaterArray" + userName,
        JSON.stringify(watchLaterArray)
      );
    }
  });
  changeWatchLaterImg(watchLaterData, watchLaterArray);
}

function changeWatchLaterImg(likedData, watchLaterArray) {
  let watchlLaterElement = document.getElementById("watchLater");
  for (let i = 0; i < watchLaterArray.length; i++) {
    if (watchLaterArray[i].id.videoId == likedData.id.videoId) {
      watchlLaterElement.setAttribute("src", "../photos/clock-solid.svg");
    }
  }
}

function historyVideo(clickedVideo) {
  console.log(clickedVideo);
  let userName = localStorage.getItem("currentUser");
  let historyVideoArray = [];
  let historyLocal = JSON.parse(localStorage.getItem("historyData" + userName));
  if (historyLocal != null) {
    historyVideoArray = historyLocal;
  }
  historyVideoArray.push(clickedVideo);
  console.log(historyVideoArray);
  localStorage.setItem(
    "historyData" + userName,
    JSON.stringify(historyVideoArray.reverse())
  );
}

function redirectPage(menuEle, imgArray) {
  for (let ele of menuEle) {
    ele.addEventListener("click", function () {
      switch (ele.innerText) {
        case "Home":
          window.location.href = "../index.html";
          break;
        case "Liked videos":
          window.location.href = "../static/liked_video.html";
          break;
        case "Watch later":
          window.location.href = "../static/watch_later.html";
          break;
        case "History":
          window.location.href = "../static/history.html";
          break;
      }
    });
  }
  for (let img of imgArray) {
    img.addEventListener("click", function () {
      switch (img.id) {
        case "homeImg":
          localStorage.removeItem("query");
          window.location.href = "../index.html";
          break;
        case "historyImg":
          window.location.href = "../static/history.html";
          break;
        case "watchLaterImg":
          window.location.href = "../static/watch_later.html";
          break;
        case "likeVideoImg":
          window.location.href = "../static/liked_video.html";
          console.log("gello");
      }
    });
  }
}

function getUserName() {
  let userNameElement = document.getElementById("userName");
  let userNameLocal = localStorage.getItem("currentUser");
  if (userNameLocal != null) {
    userNameElement.innerText = "Hello " + userNameLocal + "!";
  } else {
    userNameElement.innerText = "Login";
  }
}

getUserName();
