import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `#showContent[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
      // do kolumn pozniej
      domManager.addEventListener(
        `#content-row-container[data-board-id="${board.id}"]`,
        "drop",
        handleDrop
      );
      domManager.addEventListener(
        `#content-row-container[data-board-id="${board.id}"]`,
        "dragover",
        handleDragOver
      );
      domManager.addEventListener(
        `#content-row-container[data-board-id="${board.id}"]`,
        "dragenter",
        handleDragEnter
      );
      domManager.addEventListener(
        `#content-row-container[data-board-id="${board.id}"]`,
        "dragleave",
        handleDragLeave
      );
    }
  },
};

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const element = document.querySelector(`#showContent[data-board-id='${boardId}']`)
  const contentToHide = document.querySelector(`#content-row-container[data-board-id="${boardId}"]`)
  const statusesToHide = document.querySelector(`#statuses-row-container[data-board-id="${boardId}"]`)
  if (element.innerText === "v Show Cards") {
      cardsManager.loadCards(boardId);
      element.innerText = "^ Hide Cards"
  }
  else {
      contentToHide.hidden = true
      contentToHide.innerHTML = ""
      statusesToHide.innerHTML = ""
      element.innerText = "v Show Cards"
  }
}

let i = 0
function handleDragOver(e) {
  e.preventDefault();
  if(i==0) {
    i++;
    e.target.insertAdjacentHTML("afterend", `<div id="drop-over">&nbsp</div>`);
  }
}

function handleDragEnter(e) {
}

function handleDragLeave(e) {
  if(i==1){
    i--;
    let div = document.getElementById("drop-over");
    div.remove()
  }
}

function handleDrop(e) {
  e.preventDefault()
  let div = document.getElementById("drop-over");
  div.parentNode.insertBefore(cardsManager.dragItem,div)

  console.log(div.parentNode["data-column-id"])
  div.remove()
  // changeStatus()
  cardsManager.dragItem = null
}

function changeStatus(card_id, status_id){
  return fetch('/api/change-status/'+card_id+"/"+status_id, {
        method: 'PUT'
    }).then(response => "")
}