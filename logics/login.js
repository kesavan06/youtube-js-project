function checkUserName() {
  let inputUserName = document.getElementById("userNameInput");
  inputUserName.addEventListener("change", function () {
    let userMessage = document.getElementById("userMessage");

    let userNameArrayLocal = JSON.parse(localStorage.getItem("userArray"));
    if (userNameArrayLocal == null) {
      userMessage.innerText = "Username is invalid!";
      userMessage.style.color = "red";
      return;
    }
    let count = 0;
    for (let userObg of userNameArrayLocal) {
      console.log(userObg);
      for (let name in userObg) {
        console.log(userObg[name], inputUserName.value);
        if (userObg[name] == inputUserName.value) {
          count += 1;
        }
      }
      if (count == 1) {
        console.log();
        userMessage.innerText = "Username is valid!";
        userMessage.style.color = "green";
        checkPassword(inputUserName.value);
      } else {
        console.log(count);
        userMessage.innerText = "Username is invalid!";
        userMessage.style.color = "red";
      }
    }
  });
}

function checkPassword(username) {
  let password = "";
  let inputPassword = document.getElementById("passwordInput");
  inputPassword.addEventListener("change", function () {
    let passwordMessage = document.getElementById("passwordMessage");
    let userNameArrayLocal = JSON.parse(localStorage.getItem("userArray"));
    for (let userObj of userNameArrayLocal) {
      console.log(userObj);
      for (let [key, value] of Object.entries(userObj)) {
        console.log(value, username);
        if (value == username) {
          password = userObj["password"];
        }
      }
    }

    console.log(password);
    let decryptedPassword = decryptPassword(password, 3);

    console.log(decryptedPassword);
    if (inputPassword.value == decryptedPassword) {
      passwordMessage.innerText = "Password is valid!";
      passwordMessage.style.color = "green";
    } else {
      passwordMessage.innerText = "password is invalid";
      passwordMessage.style.color = "red";
    }
  });
}

function decryptPassword(password, shift) {
  return password
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - shift))
    .join("");
}

function redirectHomePage() {
  let loginBtn = document.getElementById("loginToHome");
  loginBtn.addEventListener("click", function () {
    let userMessage = document.getElementById("userMessage").textContent;
    let passwordMessage =
      document.getElementById("passwordMessage").textContent;
    if (
      userMessage == "Username is valid!" &&
      passwordMessage == "Password is valid!"
    ) {
      let userName = document.getElementById("userNameInput").value;
      localStorage.setItem("currentUser", userName);
      window.location.href = "../index.html";
    }
  });
}

redirectHomePage();

checkUserName();
