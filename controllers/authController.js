exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false
  });
};

exports.getSignUp = (req,res,next) => {
  res.render("auth/signUp",{
    pageTitle: "SignUp",
    currentPage: "SignUp",
    isLoggedIn: false
  })
}

exports.postSignUp = (req, res, next) => {
  console.log(req.body);
  //res.cookie("isLoggedIn", true);
  //req.isLoggedIn = true;
  res.redirect("/login");
}

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  req.session.isLoggedIn = true;
  //res.cookie("isLoggedIn", true);
  //req.isLoggedIn = true;
  res.redirect("/");
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
}
