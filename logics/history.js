function getHistoryVideo() {
  let userName = localStorage.getItem("currentUser");
  let historyVideos = JSON.parse(
    localStorage.getItem("historyData" + userName)
  );
  historyVideoData(historyVideos);
}

getHistoryVideo();
//=====>Home page function<======
function historyVideoData(data) {
  let videoContainer = document.getElementById("video-container");
  videoContainer.setAttribute("class", "videoContainer");
  videoContainer.innerHTML = "";
  console.log(data);
  let thumbnailStatic = "";
  let title = "";
  let videoId = "";
  let channelTitle = "";
  let uploadDate = "";
  let videoIdObject = {};
  let videoBoxes = [];
  let deleteHistoryBoxes = [];
  let dropDownBoxes = [];
  let alertMessage = document.getElementById("alertMessage");
  if (data == null || data.length == 0) {
    alertMessage.innerText = "You does't have any liked videos";
  } else {
    alertMessage.innerText = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i].id.videoId != undefined) {
        //=====>Set required detaisl<=====
        thumbnailStatic = data[i].snippet.thumbnails.high.url;
        title = data[i].snippet.title.slice(0, 80) + "....";
        if (title.includes("&#39;")) {
          title = title.replaceAll("&#39;", "'");
        } else if (title.includes("&amp;")) {
          title = title.replaceAll("&amp;", "&");
        } else if (title.includes("&34;")) {
          title = title.replaceAll("&34;", "&");
        } else if (title.includes("&amp")) {
          title = title.replaceAll("&amp", "&");
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
        // videoLinkBox.setAttribute("href", "../static/video_page.html");
        videoLinkBox.addEventListener("click", function () {
          window.location.href = "../static/video_page.html";
        });
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

        let dropDown = document.createElement("img");
        dropDown.setAttribute("src", "../photos/caret-down-solid.svg");
        dropDown.setAttribute("id", i);
        dropDownBoxes.push(dropDown);
        let deleteHistoryBox = document.createElement("div");
        deleteHistoryBox.setAttribute("id", i);
        deleteHistoryBoxes.push(deleteHistoryBox);
        thumbnailBox.append(dropDown, deleteHistoryBox);
        let deleteMessage = document.createElement("p");
        deleteMessage.textContent = "Delete from history";
        deleteHistoryBox.appendChild(deleteMessage);
        deleteHistoryBox.style.visibility = "hidden";
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
        deleteWatchLater(dropDown, deleteHistoryBox, videoId);
      }
    }
  }
  videoBoxes.length == 1
    ? (alertMessage.innerText = videoBoxes.length + " History video")
    : (alertMessage.innerText = videoBoxes.length + " History videos");
  getVideoId(videoIdObject, videoBoxes);
  hideDeleteWatchLater(deleteHistoryBoxes);
}

function deleteWatchLater(dropDown, deleteHistoryBox, videoId) {
  let userName = localStorage.getItem("currentUser");
  dropDown.addEventListener("click", function (event) {
    event.stopPropagation();
    if (deleteHistoryBox.style.visibility == "hidden") {
      deleteHistoryBox.style.visibility = "visible";
    } else {
      deleteHistoryBox.style.visibility = "hidden";
    }
  });
  deleteHistoryBox.addEventListener("click", function (event) {
    event.stopPropagation();
    let historyLocal = JSON.parse(localStorage.getItem("historyData"+userName));
    historyLocal = historyLocal.filter((element) => {
      if (element.id.videoId != videoId) {
        return element;
      }
    });
    localStorage.setItem(
      "historyData" + userName,
      JSON.stringify(historyLocal)
    );
    historyVideoData(historyLocal);
  });
}

function hideDeleteWatchLater(deleteHistoryBoxes) {
  window.addEventListener("click", function () {
    for (let i of deleteHistoryBoxes) {
      i.style.visibility = "hidden";
    }
  });
}

function getVideoId(videoIds, videoBoxes) {
  console.log(videoIds);
  console.log(videoBoxes);
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
window.addEventListener("load", function () {
  let getLikedVideoButton = document.getElementById("history");
  getLikedVideoButton.setAttribute("class", "selected-menu selected-menu-font");
});

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
  let userName = localStorage.getItem("currentUser");

  let queryArray = [];
  let queryArrayLocal = JSON.parse(
    localStorage.getItem("queryArray" + userName)
  );
  if (queryArrayLocal != null) {
    queryArray = queryArrayLocal;
  }
  let searchBox = document.getElementById("search-query");
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

