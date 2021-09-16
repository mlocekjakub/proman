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
      domManager.addEventListener(
          `#deleteBoardButton[data-board-id="${board.id}"]`,
          "click",
          deleteBoardButtonHandler
      );
      // do kolumn pozniej
      domManager.addEventListener(
        "#content-row-container",
        "drop",
        handleDrop
      );
      domManager.addEventListener(
        `#content-row-container`,
        "dragover",
        handleDragOver
      );
      domManager.addEventListener(
        `#content-row-container`,
        "dragenter",
        handleDragEnter
      );
      domManager.addEventListener(
        `#content-row-container`,
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

function deleteBoardButtonHandler (clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const rowsToDelete = document.getElementsByClassName('row' && 'bg-light')
  for (let row of rowsToDelete) {
    let rowId = row.getAttribute('data-board-id');
    if (rowId === boardId) {
      row.parentElement.remove();
      dataHandler.deleteBoard(boardId);
    }
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
  div.remove()
  e.target.insertAdjacentHTML("afterend",cardsManager.dragItem)
  console.log(cardsManager.dragItem)
  cardsManager.dragItem= null
  console.log("drop "+e);
}