import fetch from "node-fetch";
import { JSDOM } from "jsdom";

async function fetchPage() {
  const html = await fetch(
    "http://chatserver.suomi24.fi:8080/search/?nick=all"
  ).then((response) => response.text());
  return html;
}

export const getAllUserData = async () => {
  const htmlText = await fetchPage();
  const dom = new JSDOM(htmlText);
  const document = dom.window.document;
  const userRows = Array.from(document.querySelectorAll("tbody")[3].childNodes)
    .filter((node) => node.nodeName !== "#text")
    .slice(1);
  const userDataList = userRows.map((userRow) => getUserData(userRow));
  return userDataList;
};

const getUserData = (userRow) => {
  const userRowData = Array.from(userRow.childNodes).filter(
    (n) => n.nodeName !== "#text"
  );
  const username = userRowData[0].textContent;
  const roomName = userRowData[1].textContent;
  const gender = userRowData[2].textContent;
  const onlineTime = userRowData[3].textContent;
  return {
    username,
    roomName,
    gender,
    onlineTime,
  };
};
