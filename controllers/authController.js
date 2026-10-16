const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors:[],
    oldInput:{},
    user:{}
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp",
    currentPage: "SignUp",
    isLoggedIn: false,
    errors: [],
    oldInput: {},
    user:{}
  })
}

exports.postSignUp = [
  //FirstName validation
  check('firstName')
    .trim()
    .isLength({ min: 2 }).withMessage("First Name should have atleast two characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("firstName should have only letters"),

  check('lastName')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("LastName should have only letters"),

  check('email')
    .isEmail().withMessage("enter proper email"),

  check('Password')
    .isLength({ min: 8 }).withMessage("Password should have min length of 8")
    .matches(/[A-Z]/).withMessage("Password must contain atleat one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain atleat one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain atleat one number ")
    .matches(/[&*#@_]/).withMessage("Password must contain atleat one special character")
    .trim(),

  check('ConfirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.Password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  check('userType')
    .notEmpty().withMessage("Pls select a user Type")
    .isIn(['guest', 'host']).withMessage("Invalid User type"),

  check('terms')
    .notEmpty().withMessage('You must accept terms and conditions')
    .bail()
    .custom((value) => {
      if (value !== 'on') {
        throw new Error('You must accept terms and conditions')
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, Password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signUp', {
        pageTitle: "SignUp",
        currentPage: "SignUp",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, Password, userType },
        user:{}
      });
    }
    bcrypt.hash(Password,10).then(hashedPassword => {
      const user = new User({ firstName, lastName, email, Password:hashedPassword, userType });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render('auth/signUp', {
        pageTitle: "SignUp",
        currentPage: "SignUp",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: { firstName, lastName, email, Password, userType },
        user:{}
      });
    });
  }
]

exports.postLogin = async (req, res, next) => {
  console.log(req.body);

  const { email, Password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render('auth/login', {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User doesn't exist"],
      oldInput: { email },
      user:{}
    })
  }
  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) {
    return res.status(422).render('auth/login', {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid credentials"],
      oldInput: { email },
      user:{}
    })
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save();
  //res.cookie("isLoggedIn", true);
  //req.isLoggedIn = true;
  res.redirect("/");
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
}
