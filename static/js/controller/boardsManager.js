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
      domManager.addEventListener("#create-board-button",
          "click",
          openNewBoardModal
      );
      domManager.addEventListener("#add-card",
          "click",
          openNewCardModal
      );
      domManager.addEventListener("#form-board",
          "submit",
          dataHandler.createNewBoard
      );
      domManager.addEventListener("#form-card",
          "submit",
          dataHandler.createNewCard)
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
  const addCardButton = document.querySelector(`#add-card[data-board-id="${boardId}"]`)
  if (element.innerText === "v Show Cards") {
      cardsManager.loadCards(boardId);
      addCardButton.hidden = false
      element.innerText = "^ Hide Cards"
  }
  else {
      addCardButton.hidden = true
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
    console.log(e)
  e.preventDefault()
  let div = document.getElementById("drop-over");
  div.remove()
  e.target.insertAdjacentHTML("afterend",cardsManager.dragItem)
  console.log(cardsManager.dragItem)
  cardsManager.dragItem= null
  console.log("drop "+e);
}


function openNewBoardModal() {
    let newBoardModal = document.getElementById("new-board-modal")
    let newCardForm = document.getElementById("form-card")
    let newBoardForm = document.getElementById("form-board")
    let modalTitle = document.getElementById("exampleModalLabel")
    newBoardForm.hidden = false
    newCardForm.hidden = true
    modalTitle.innerText = "Create new board"
    $(newBoardModal).modal();
}

function openNewCardModal(e) {
  let newCardModal = document.getElementById("new-board-modal")
  let newCardForm = document.getElementById("form-card")
  let newBoardForm = document.getElementById("form-board")
  let modalTitle = document.getElementById("exampleModalLabel")
  let boardId = e.target.dataset.boardId;
  newCardForm.setAttribute("data-board-id", boardId)
  newCardForm.hidden = false
  newBoardForm.hidden = true
  modalTitle.innerText = "Create new card"
  $(newCardModal).modal();


}

