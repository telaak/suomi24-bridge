let socketScript = document.createElement("script");
socketScript.setAttribute(
  "src",
  "http://bot-backend:4000/socket.io/socket.io.js"
);
document.head.appendChild(socketScript);

const mainframeLoadPromise = new Promise((resolve, reject) => {
  mainframe.addEventListener("load", (event) => {
    resolve();
  });
});

const timerPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 20 * 1000);
});

Promise.race([mainframeLoadPromise, timerPromise]).then(() => {
  const targetNode = mainframe.document
    .getElementById("body")
    .childNodes[3].contentWindow.document.querySelector("p").parentElement;
  const inputElement = mainframe.document
    .querySelectorAll("frameset")[3]
    .firstElementChild.contentWindow.document.querySelector(".input");
  const inputButton = mainframe.document
    .querySelectorAll("frameset")[3]
    .firstElementChild.contentWindow.document.querySelector(".say");
  const socketConnection = io.connect("http://bot-backend:4000");

  socketConnection.on("message", (messageObject) => {
    const messageJson = JSON.parse(messageObject);
    inputElement.value = messageJson.username + ": " + messageJson.message;
    inputButton.click();
  });

  let inputTimer = setInterval(() => {
    inputElement.value = " ";
    inputButton.click();
  }, 1000 * 60 * 30);

  let username = "";
  let messageBoolean = false;
  let message = "";

  let addedNodesFunction = (addedNodes) => {
    if (
      (addedNodes[0].className === "n" || addedNodes[0].className === "t") &&
      !messageBoolean
    ) {
      messageBoolean = true;
    } else if (messageBoolean) {
      if (addedNodes[0].nodeName === "BR") {
        console.log(username + message);
        if (!username.startsWith("viestisilta")) {
          socketConnection.emit(
            "message",
            JSON.stringify({
              username,
              message,
            })
          );
        }
        messageBoolean = false;
        message = "";
        username = "";
      } else if (addedNodes[0].nodeName === "#text") {
        if (!username) {
          username = addedNodes[0].textContent;
        } else {
          message += addedNodes[0].textContent;
        }
      } else if (addedNodes[0].nodeName === "IMG") {
        message += addedNodes[0].src;
      }
    }
  };

  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        addedNodesFunction(mutation.addedNodes);
      }
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(targetNode, { childList: true, subtree: true });
});
