const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }

  extractUserData(payload) {
    const user = {
      email: payload.email,
      name: payload.name,
    };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async signup(payload) {
    const user = this.extractUserData(payload);
    user.hash_password = bcrypt.hashSync(payload.password, 10);
    await this.User.insertOne(user);
    return user;
  }

  async comparePassword(hash_password, candidatePassword) {
    return await bcrypt.compare(candidatePassword, hash_password);
  }

  async createSendToken(user) {
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
      "od56493b2ZSBhcAyVDSqU25bAs6FEJR"
    );
    return token;
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}
module.exports = UserService;
