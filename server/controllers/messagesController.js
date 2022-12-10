const { response } = require('express');
const Messages = require('../models/MessageModel');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: 'Message ajouté en BDD' });
    return res.json({ msg: "Echec de l'enregistrement du message" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({ users: { $all: [from, to] } }).sort({
      updateAt: 1,
    });
    const projectMessage = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessage);
  } catch (ex) {
    next(ex);
  }
};
