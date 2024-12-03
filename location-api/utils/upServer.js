function upServer(
  app,
  serverName,
  serverPort,
  onSuccessMessage,
  onFailMessage
) {
  const server = app.listen(serverPort, () => {
    console.log(onSuccessMessage);
  });

  server.on('error', (error) => {
    console.error(onFailMessage + ' ' + error.message);
  });
}

module.exports = upServer;
