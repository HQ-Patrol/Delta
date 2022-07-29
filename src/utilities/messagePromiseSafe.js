module.exports.safe = (cb) => (async (msg) => {
  try {
    cb(msg);
  } catch (e) {
    console.error(e);
    msg.edit({ content: "Oh no! Something went wrong.", embeds: [] });
  }
});
