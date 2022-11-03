const ContactService = require("./../services/contact.service");
const ApiError = require("./../api-error");
const MongoDB = require("./../utils/mongodb.util");

exports.create = async (req, res, next) => {
  console.log("running");
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.create(req.body, req.user);

    return res.status(200).json({
      message: "Da tao contact",
      documents,
    });
  } catch (err) {
    return next(new ApiError(500, "An error while creating the contact"));
  }
};

exports.findAll = async (req, res) => {
  let documents = [];

  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findbyName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (err) {
    return next(new ApiError(500, "An error while retrieving the contacts"));
  }

  return res.send(documents);
};

exports.findAllOfMe = async (req, res) => {
  let documents = [];

  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findbyName(name);
    }
    documents = await contactService.find({ authorContact: req.user._id });
  } catch (err) {
    return next(new ApiError(500, "An error while retrieving the contacts"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.status(200).send(document);
  } catch (err) {
    return next(
      new ApiError(500, "Error retirving contact with id " + req.params.id)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was updated successfully" });
  } catch (err) {
    return next(
      new ApiError(500, "Error updating contact with id: " + req.params.id)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, "Could not delete contact with id: " + req.params.id)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({
      message: deletedCount + " contacts were deleted successfully",
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

exports.deleteAllOfMe = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteMany({
      authorContact: _req.user.authorContact,
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

exports.findAllFavorite = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};
