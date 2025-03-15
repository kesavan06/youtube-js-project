const apiKeyOne = "AIzaSyCJkSCR8wE-bXN_BPtgresX8NnhS9LFfe0";
const apiKeyTwo = "AIzaSyCr-3dp1IWIksitDUl7Y9sr4rClGhgdzcY";
const apiKeyThree = "AIzaSyBD97IewxsBL1R3mE-CBVgYxFNFDspsnSI";
const apiKeyFour = "AIzaSyCH3KDJLRNdeX5BL30fCdpa_l2e9GJBbnU";
const apiKeyFive = "AIzaSyCHqe_YJZB4WiK3ifoden_CH1Wg2Z0C17A";
const apiKeySix = "AIzaSyAOCLr66hqI2aqVe74jbn-ENbkr8bXDEn8";
const apiKeySeven = "AIzaSyCmerL3HqlMU2z_ki1693v1GoCzBjTWukc";
const apiKeyEight = "AIzaSyAZs26mqUoplb57DcK4pR75mWHM636Dmmw";
const apiKeyNine = "AIzaSyBCHrvTeuBtmbGE7_sbv4Ausr68WCSF0xg";
const apiKeyTen = "AIzaSyBwPjh4VksgSRYXWHcXMeHUIE16i_rTjdQ";
const apiKeyEleven = "AIzaSyBVaNM4uAfDePBVMGegfScI0xNyN_dBBns";
const apiKeyTwelve = "AIzaSyCNLKnxLrpmAsgRMeCaeiI-Loo4--4xPj8";
//======> API fetch <======
const apiKeyArray = [
  apiKeyOne,
  apiKeyTwo,
  apiKeyThree,
  apiKeyFive,
  apiKeySix,
  apiKeySeven,
  apiKeyEight,
  apiKeyNine,
  apiKeyTen,
  apiKeyEleven,
  apiKeyTwelve,
];

let apiKeyIndex = 0;

let query = "";
let localStorageQuery = localStorage.getItem("query");
if (localStorageQuery != null) {
  query = localStorage.getItem("query");
}

function getCurrentApiKey() {
  return apiKeyArray[apiKeyIndex];
}

function switchToNextApiKey() {
  apiKeyIndex = (apiKeyIndex + 1) % apiKeyArray.length;
}

function fetchYouTubeData(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${getCurrentApiKey()}&maxResults=3`;

  fetch(url)
    .then((response) => {
      if (response.status == 403) {
        switchToNextApiKey();
        return fetchYouTubeData(query);
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        console.log(data);
        document.addEventListener("load", homePageData(data));
      }
    })
    .catch((error) => console.log("Error fetching data:", error));
}

function getQueryFromSuggestion() {
  let suggustionBox = document.querySelector(".suggestion-bar");
  let suggustionButtons = suggustionBox.childNodes;
  suggustionButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      query = event.target.textContent;
      localStorage.setItem("query", query);
      fetchYouTubeData(query);
      deleteClickEffect();
      deleteMenuEffect();
      document.getElementById("search-query").value = "";

      event.target.classList.add("clicked-suggestion");
    });
  });
}
getQueryFromSuggestion();

function getQuery() {
  let userName = localStorage.getItem("currentUser");
  if (query == "") {
    query = "tamil nadu";
  }
  let queryArray = [];
  let queryArrayLocal = JSON.parse(
    localStorage.getItem("queryArray" + userName)
  );
  if (queryArrayLocal != null) {
    queryArray = queryArrayLocal;
    createSuggustion(queryArray);
  }
  let searchBox = document.getElementById("search-query");
  searchBox.addEventListener("change", function () {
    const alphabet = RegExp(/[a-z0-9]/i);
    if (alphabet.test(searchBox.value)) {
      query = searchBox.value;
      deleteClickEffect();
      deleteMenuEffect();
      localStorage.setItem("query", query);
      queryArray.push(query);
      localStorage.setItem("queryArray" + userName, JSON.stringify(queryArray));
      createSuggustion(queryArray);
      fetchYouTubeData(query);
    }
  });
  searchBox.value = localStorage.getItem("query");
  return query;
}
function createSuggustion(queryArray) {
  let userName = localStorage.getItem("currentUser");
  if (queryArray.length > 15) {
    queryArray.shift();
  }
  localStorage.setItem("queryArray" + userName, JSON.stringify(queryArray));

  let suggestionContainer = document.getElementById("suggestion-bar");
  suggestionContainer.innerHTML = "";
  for (let i in queryArray) {
    if (queryArray[i] != "") {
      suggestionContainer.innerHTML += `<button id="suggestion-button${i}">${queryArray[i]}</button>`;
    }
  }
  let suggestionBox = document.querySelector(".suggestion-bar");
  let suggestButtons = suggestionBox.childNodes;
  suggestButtons.forEach((element) => {
    let closeImg = document.createElement("img");
    element.appendChild(closeImg);
    element.addEventListener("mouseover", function () {
      closeImg.setAttribute("src", "../photos/cross.png");
      closeImg.classList.add("closeImage");
      closeImg.classList.remove("closeImage1");
    });
    element.addEventListener("mouseleave", function () {
      closeImg.classList.add("closeImage1");
      closeImg.classList.remove("closeImage");
    });
  });
  deleteSuggestButton();
  getQueryFromSuggestion();
}

function deleteSuggestButton() {
  let userName = localStorage.getItem("currentUser");
  let suggestButton = document.querySelectorAll(".suggestion-bar img");
  let queryArrayLocal = JSON.parse(
    localStorage.getItem("queryArray" + userName)
  );
  let queryArray = queryArrayLocal;
  for (let img of suggestButton) {
    img.addEventListener("click", function (event) {
      event.stopPropagation();
      let parentElement = img.parentNode;
      let suggestWord = parentElement.textContent;
      parentElement.style.display = "none";
      queryArray = queryArray.filter((element) => {
        if (element != suggestWord) {
          console.log(suggestWord, element);
          return element;
        }
      });
      console.log(queryArray);
      localStorage.setItem("queryArray" + userName, JSON.stringify(queryArray));
      getQuery();
    });
  }
}

function deleteClickEffect() {
  document
    .querySelector(".clicked-suggestion")
    ?.classList.remove("clicked-suggestion");
}

fetchYouTubeData(getQuery());

//=====>Home page function<======
function homePageData(data) {
  let videoContainer = document.getElementById("video-container");
  videoContainer.setAttribute("class", "videoContainer");
  videoContainer.innerHTML = "";
  let pageVideos = data.items;
  localStorage.setItem("PageVideos", JSON.stringify(pageVideos));
  console.log(pageVideos);
  let thumbnailStatic = "";
  let title = "";
  let videoId = "";
  let channelTitle = "";
  let uploadDate = "";
  let videoIdObject = {};
  let videoBoxes = [];
  let deleteWatchLaterBoxes = [];
  let dropDownBoxes = [];
  for (let i = 0; i < pageVideos.length; i++) {
    if (pageVideos[i].id.videoId != undefined) {
      //=====>Set required detaisl<=====
      thumbnailStatic = pageVideos[i].snippet.thumbnails.high.url;
      title = pageVideos[i].snippet.title.slice(0, 80) + "....";
      if (title.includes("&#39;")) {
        title = title.replaceAll("&#39;", "'");
      } else if (title.includes("&amp;")) {
        title = title.replaceAll("&amp;", "&");
      } else if (title.includes("&34;")) {
        title = title.replaceAll("&34;", "&");
      } else if (title.includes("&amp")) {
        title = title.replaceAll("&amp", "&");
      }
      videoId = pageVideos[i].id.videoId;
      channelTitle = "Channel: " + pageVideos[i].snippet.channelTitle;
      uploadDate =
        pageVideos[i].snippet.publishTime.slice(8, 10) +
        "/" +
        pageVideos[i].snippet.publishTime.slice(5, 7) +
        "/" +
        pageVideos[i].snippet.publishTime.slice(0, 4);
      //=====>Video boxes creation<======
      let videoBox = document.createElement("div");
      let videoLinkBox = document.createElement("a");
      // videoLinkBox.setAttribute("href", "../static/video_page.html");
      videoLinkBox.addEventListener("click", function () {
        window.location.href = "../static/video_page.html";
      });
      videoLinkBox.setAttribute("id", i);
      videoBoxes.push(videoLinkBox);
      videoIdObject[i] = pageVideos[i];
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
      let deleteWatchLaterBox = document.createElement("div");
      deleteWatchLaterBox.setAttribute("id", i);
      deleteWatchLaterBoxes.push(deleteWatchLaterBox);
      thumbnailBox.append(dropDown, deleteWatchLaterBox);
      let deleteMessage = document.createElement("p");
      deleteMessage.textContent = "Add to watch later";
      deleteWatchLaterBox.appendChild(deleteMessage);
      deleteWatchLaterBox.style.visibility = "hidden";
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
      deleteWatchLater(dropDown, deleteWatchLaterBox, videoId, pageVideos[i]);
    }
  }
  getVideoId(videoIdObject, videoBoxes);
  hideDeleteWatchLater(deleteWatchLaterBoxes);
}

function deleteWatchLater(dropDown, deleteWatchLaterBox, videoId, pageVideo) {
  let message = document.getElementById("msg");
  let userName = localStorage.getItem("currentUser");
  dropDown.addEventListener("click", function (event) {
    event.stopPropagation();
    if (deleteWatchLaterBox.style.visibility == "hidden") {
      deleteWatchLaterBox.style.visibility = "visible";
    } else {
      deleteWatchLaterBox.style.visibility = "hidden";
    }
  });
  deleteWatchLaterBox.addEventListener("click", function (event) {
    event.stopPropagation();
    let watchLaterLocal = JSON.parse(
      localStorage.getItem("watchLaterArray" + userName)
    );
    let count = 0;
    for (let i in watchLaterLocal) {
      if (watchLaterLocal[i].id.videoId == videoId) {
        count += 1;
        break;
      }
    }
    if (count == 0) {
      message.innerText = "Video added to list";
      message.style.visibility = "visible";
      message.classList.add("msgAnimation");

      setTimeout(function () {
        message.style.visibility = "hidden";
        message.classList.remove("msgAnimation");
      }, 4000);

      watchLaterLocal.push(pageVideo);
    } else {
      message.innerText = "Video already added to list";
      message.style.visibility = "visible";
      message.classList.add("msgAnimation");
      console.log(message.style.visibility);
      setTimeout(function () {
        message.style.visibility = "hidden";
        message.classList.remove("msgAnimation");
      }, 4000);
    }
    localStorage.setItem(
      "watchLaterArray" + userName,
      JSON.stringify(watchLaterLocal.reverse())
    );
    deleteWatchLaterBox.style.visibility = "hidden";
  });
}

function hideDeleteWatchLater(deleteWatchLaterBoxes) {
  window.addEventListener("click", function () {
    for (let i of deleteWatchLaterBoxes) {
      i.style.visibility = "hidden";
    }
  });
}

function getVideoId(videoIds, videoBoxes) {
  let currentIframe = null;
  let currentBox = null;

  for (let box of videoBoxes) {
    box.addEventListener("click", function () {
      for (let id in videoIds) {
        if (id == box.id) {
          localStorage.setItem(
            "clickedVideoObject",
            JSON.stringify(videoIds[id])
          );
        }
      }
    });

    let timeoutId;
    box.addEventListener("mouseenter", function () {
      timeoutId = setTimeout(() => {
        for (let id in videoIds) {
          if (id == box.id) {
            let childBox = box.childNodes[0];
            let thumbnailBox = childBox.childNodes[0];
            let iframeBox = document.createElement("iframe");
            iframeBox.setAttribute("frameborder", "0");
            iframeBox.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            );
            iframeBox.setAttribute(
              "referrerpolicy",
              "strict-origin-when-cross-origin"
            );
            iframeBox.setAttribute(
              "src",
              "https://www.youtube.com/embed/" +
                videoIds[id].id.videoId +
                "?controls=1&modestbranding=1&rel=0&showinfo=0&autoplay=1"
            );
            iframeBox.setAttribute("controls", "0");
            thumbnailBox.replaceWith(iframeBox);

            currentIframe = iframeBox;
            currentBox = box;
          }
        }
      }, 3000);
    });

    box.addEventListener("mouseleave", function () {
      clearTimeout(timeoutId);
      if (currentIframe && currentBox === box) {
        let thumbnailBox = document.createElement("div");
        thumbnailBox.setAttribute("id", "thumpnail");
        thumbnailBox.setAttribute("class", "thumpnail");

        for (let id in videoIds) {
          if (id == box.id) {
            thumbnailBox.style.backgroundImage = `url(${videoIds[id].snippet.thumbnails.high.url})`;
          }
        }

        currentIframe.replaceWith(thumbnailBox);
        currentIframe = null;
        currentBox = null;
      }
    });
  }
}
window.addEventListener("load", function () {
  let getHomeButton = document.getElementById("homeButton");
  getHomeButton.setAttribute("class", "selected-menu selected-menu-font");
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

function redirectPage(menuEle, imgArray) {
  for (let ele of menuEle) {
    ele.addEventListener("click", function () {
      switch (ele.innerText) {
        case "Home":
          localStorage.removeItem("query");
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
