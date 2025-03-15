// =====> User menu <======
function createUserMenu() {
  let parentOfMenu = document.getElementById("sideMenu-header");
  parentOfMenu.innerHTML = ` <div class="userImg" id="menuUser">
            <img id="userImg" src="../photos/user-regular.svg" alt="theme" />
          </div>
          <div style="display: none" class="userMenu" id="userMenu">
           <p id="logoutBtn">Logout</p>
            <p id="changeTheme">Dark mode</p>
           
          </div>`;
  logoutAccount();
}

function logoutAccount() {
  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn == null) {
    return;
  }
  logoutBtn.addEventListener("click", function (event) {
    console.log(event);
    event.stopPropagation();
    window.location.href = "../static/login.html";
  });
}

createUserMenu();
function userMenuOpenClose() {
  let userImgElement = document.getElementById("menuUser");
  let userImg = document.getElementById("userImg");
  let userMenu = document.getElementById("userMenu");
  userImgElement.addEventListener("click", function (event) {
    event.stopPropagation();
    userMenu.classList.add("openUserMenu");
    userMenu.classList.remove("closeUserMenu");
    if (userImg.src == "http://127.0.0.1:5501/photos/user-regular.svg") {
      userImg.src = "../photos/xmark-solid.svg";
      userMenu.style.display = "flex";
      userMenu.style.transition = "margin-right 2s";
    } else {
      userImg.src = "../photos/user-regular.svg";
      userMenu.style.display = "none";
    }
  });
  window.addEventListener("click", function () {
    userMenu.style.display = "none";
    userMenu.classList.add("closeUserMenu");
    userImg.src = "../photos/user-regular.svg";
    userMenu.classList.remove("openUserMenu");
  });

  function changeTheme() {
    let userName = localStorage.getItem("currentUser");
    let themeElement = document.getElementById("changeTheme");
    if (themeElement == null) {
      return;
    }
    themeElement.addEventListener("click", function (event) {
      event.stopPropagation();
      userMenu.style.display = "none";
      userImg.src = "../photos/user-regular.svg";
      let theme = themeElement.innerText == "Dark mode" ? "Dark" : "Light";
      localStorage.setItem("themeColor" + userName, theme);
      changeThemeToDarkOrLight(theme);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    let userName = localStorage.getItem("currentUser");
    let theme = localStorage.getItem("themeColor" + userName) || "Light";
    changeThemeToDarkOrLight(theme);
  });

  function changeThemeToDarkOrLight(theme) {
    let themeElement = document.getElementById("changeTheme");
    if (theme == "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    if (themeElement != null) {
      if (theme == "Dark") {
        themeElement.innerText = "Light mode";
      } else {
        themeElement.innerText = "Dark mode";
      }
    }
  }

  changeTheme();
}

userMenuOpenClose();
