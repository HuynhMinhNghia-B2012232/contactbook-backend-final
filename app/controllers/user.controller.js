const UserService = require("./../services/user.service");
const ApiError = require("./../api-error");
const jwt = require("jsonwebtoken");
const MongoDB = require("./../utils/mongodb.util");
const { promisify } = require("util");

exports.signup = async (req, res, next) => {
  try {
    const newuser = req.body;
    const userService = new UserService(MongoDB.client);
    var user = await userService.find({ email: newuser.email });
    user = user[0];
    if (user) {
      console.log(user);
      return next(new ApiError(409, "Email is valid"));
    }
    const documents = await userService.signup(req.body);
    return res.send(documents);
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An error while creating user"));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userService = new UserService(MongoDB.client);
    var user = await userService.find({ email });
    user = user[0];

    if (!user) {
      return next(new ApiError(404, "Not found user"));
    } else if (user) {
      const checkPassword = await userService.comparePassword(
        user.hash_password,
        password
      );
      if (!checkPassword) {
        return next(new ApiError(401, "Wrong password"));
      } else {
        const token = await userService.createSendToken(user);
        res.cookie("jwt", token);
        return res.json({
          message: "Success",
          token,
          user: {
            user,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An error while Signing"));
  }
};

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "loggedout");
    res.status(200).json({ status: "success logout" });
  } catch (err) {
    console.log(err);
  }
};

exports.protect = async function (req, res, next) {
  const userService = new UserService(MongoDB.client);
  var token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("header");
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(req.headers);
  console.log("check token");
  console.log(token);

  if (!token) {
    return next(
      new ApiError(401, "You are not logged in. Please log in to get access")
    );
  }

  //Xac thuc token
  //do no lam ham bat dong bo, promisify giup no tro thanh mot promise
  console.log(`check token: ${token}`);
  const decoded = await promisify(jwt.verify)(
    token,
    "od56493b2ZSBhcAyVDSqU25bAs6FEJR"
  );

  //Kiem tra user con ton tai khong
  const currentUser = await userService.findById(decoded._id);

  if (!currentUser) {
    return next(
      new ApiError(
        401,
        "The user belonging to this token does no longer exist."
      )
    );
  }

  //protect thanh cong
  req.user = currentUser;
  console.log("da kiem tra yeu cau dang nhap");
  next();
};
