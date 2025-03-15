function checkUserName() {
  let userNameInput = document.getElementById("userNameInput");
  let userNameErrorMsg = document.getElementById("userMessage");

  userNameInput.addEventListener("change", function () {
    let userArray = [];
    let userArrayLocal = JSON.parse(localStorage.getItem("userArray"));
    let userName = document.getElementById("userNameInput").value;
    if (userArrayLocal != null) {
      userArray = userArrayLocal;
    }
    let userNameArray = [];
    for (let userObj of userArray) {
      userNameArray.push(userObj["userName"]);
    }
    console.log(userArray.includes(userName));
    console.log(userName);
    console.log(userArray);
    if (!/^[a-zA-Z][a-zA-Z0-9\ ]*$/.test(userNameInput.value)) {
      userNameErrorMsg.innerText =
        "User name does't  start with numbers and does't contain any special characters.";
      userNameErrorMsg.style.color = "red";
    } else if (userNameArray.includes(userName)) {
      userNameErrorMsg.innerText = "Username already exist.";
    } else {
      userNameErrorMsg.innerText = "Username is valid!";
      userNameErrorMsg.style.color = "green";
    }
  });
}

function checkPassword() {
  let passwordInput = document.getElementById("passwordInput");
  let userPasswordErrorMsg = document.getElementById("passwordMessage");
  passwordInput.addEventListener("change", function () {
    console.log(passwordInput.value);
    if (passwordInput.value.length < 8) {
      userPasswordErrorMsg.innerText =
        "Password must be at least 8 character length.";
      userPasswordErrorMsg.style.color = "red";
    } else if (!/[a-z]/.test(passwordInput.value)) {
      userPasswordErrorMsg.innerText =
        "Password must contain at least one lowercase letter.";
      userPasswordErrorMsg.style.color = "red";
    } else if (!/[A-Z]/.test(passwordInput.value)) {
      userPasswordErrorMsg.innerText =
        "Password must contain at least one uppercase letter.";
      userPasswordErrorMsg.style.color = "red";
    } else if (!/\d/.test(passwordInput.value)) {
      userPasswordErrorMsg.innerText =
        "Password must contain at least one digit.";
      userPasswordErrorMsg.style.color = "red";
    } else if (!/[!@#$%^&*_]/.test(passwordInput.value)) {
      userPasswordErrorMsg.innerText =
        "Password must contain at least one special character.";
      userPasswordErrorMsg.style.color = "red";
    } else {
      userPasswordErrorMsg.innerText = "Password is strong!";
      userPasswordErrorMsg.style.color = "green";
      confirmPassword(passwordInput.value);
    }
  });
}

function confirmPassword(passwordValue) {
  let confirmPassword = document.getElementById("confirmPasswordInput");
  let confirmPasswordMessage = document.getElementById(
    "confirmPasswordMessage"
  );
  confirmPassword.addEventListener("change", function () {
    if (passwordValue != confirmPassword.value) {
      confirmPasswordMessage.innerText = "Password does't matched";
      confirmPasswordMessage.style.color = "red";
    } else {
      confirmPasswordMessage.innerText = "Password matched!";
      confirmPasswordMessage.style.color = "green";
    }
  });
}

function redirectHomePage() {
  let siginBtn = document.getElementById("signInBtn");
  let userArray = [];
  let userArrayLocal = JSON.parse(localStorage.getItem("userArray"));
  if (userArrayLocal != null) {
    userArray = userArrayLocal;
  }
  siginBtn.addEventListener("click", function () {
    console.log("jbknml,");
    let userMsg = document.getElementById("userMessage").textContent;
    let passwordMsg = document.getElementById("passwordMessage").textContent;
    let confirmPassword = document.getElementById(
      "confirmPasswordMessage"
    ).textContent;
    if (
      userMsg == "Username is valid!" &&
      passwordMsg == "Password is strong!" &&
      confirmPassword == "Password matched!"
    ) {
      let userName = document.getElementById("userNameInput").value;
      let OriginalpassWord = document.getElementById("passwordInput").value;
      let encryptedPassword = encryptPassword(OriginalpassWord, 3);
      userArray.push({ userName: userName, password: encryptedPassword });
      localStorage.setItem("currentUser", userName);
      localStorage.setItem("userArray", JSON.stringify(userArray));
      window.location.href = "../index.html";
    }
  });
}

function encryptPassword(normalPassword, shift) {
  return normalPassword
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + shift))
    .join("");
}

checkPassword();

checkUserName();

redirectHomePage();
