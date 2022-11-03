const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri:
      process.env.MONGODB_URL ||
      "mongodb+srv://huynhdust123:PzWwHaVK6K5cT85W@cluster0.ryvnbcs.mongodb.net/contactbook",
  },
};
module.exports = config;
