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
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
      // do kolumn pozniej
      domManager.addEventListener(
        ".board",
        "drop",
        handleDrop
      );
      domManager.addEventListener(
        `.board`,
        "dragover",
        handleDragOver
      );
      domManager.addEventListener(
        `.board`,
        "dragenter",
        handleDragEnter
      );
      domManager.addEventListener(
        `.board`,
        "dragleave",
        handleDragLeave
      );
    }
  },
};

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  cardsManager.loadCards(boardId);
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
  div.remove()
  e.target.insertAdjacentHTML("afterend",cardsManager.dragItem)
  console.log(cardsManager.dragItem)
  cardsManager.dragItem= null
  console.log("drop "+e);
}