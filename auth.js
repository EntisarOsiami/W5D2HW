document.addEventListener("DOMContentLoaded", function () {
  let currentUser = localStorage.getItem("currentUser");
  currentUser = currentUser ? JSON.parse(currentUser) : null;

  let path = window.location.pathname;
  let isMainPage = path.endsWith("index.html");

  // redirect to login if the user is on main page and not logged in
  if (isMainPage && !currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (currentUser && window.location.pathname.includes("login.html")) {
    window.location.href = "index.html";
    return;
  }

  let signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("كلمة المرور غير متطابقة");
        return;
      }

      let usersData = localStorage.getItem("users") || "[]";
      users = JSON.parse(usersData);
      console.log(users);
      if (users.some((user) => user.email === email)) {
        alert("البريد الالكتروني مستخدم بالفعل");
        return;
      }

      let newUser = {
        name,
        email,
        password,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("تم التسجيل بنجاح! يمكنك الان تسجيل الدخول.");
      window.location.href = "login.html";
    });
  }

  let loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      let users = JSON.parse(localStorage.getItem("users") || "[]");
      let user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            name: user.name,
            email: user.email,
          })
        );

        window.location.href = "index.html";
      } else {
        alert("البريد الالكتروني أو كلمة المرور غير صحيحة");
      }
    });
  }
});
