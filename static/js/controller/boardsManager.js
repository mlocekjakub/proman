import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    domManager.addEventListener(`#create-board-button`,
          "click",
          openNewBoardModal
      );
    domManager.addEventListener("#form-board",
          "submit",
          dataHandler.createNewBoard
      );
    domManager.addEventListener("#form-card",
        "submit",
        dataHandler.createNewCard)
    domManager.addEventListener("#board-title",
        "click",
        removeNotValidStyleBoard)
    domManager.addEventListener("#card-title",
        "click",
        removeNotValidStyleCard)
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
      domManager.addEventListener(`#add-card[data-board-id="${board.id}"]`,
          "click",
          openNewCardModal
      );
      domManager.addEventListener(
          `#deleteBoardButton[data-board-id="${board.id}"]`,
          "click",
          deleteBoardButtonHandler
      );
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
  const addCardButton = document.querySelector(`#add-card[data-board-id="${boardId}"]`)
  if (element.innerHTML === "<i class=\"bi bi-chevron-double-down\"></i> Show") {
    cardsManager.loadCards(boardId);
    addCardButton.parentNode.hidden = false
    element.innerHTML = "<i class=\"bi bi-chevron-double-up\"></i> Hide"
  } else {
    addCardButton.parentNode.hidden = true
    contentToHide.hidden = true
    contentToHide.innerHTML = ""
    statusesToHide.innerHTML = ""
    element.innerHTML = "<i class=\"bi bi-chevron-double-down\"></i> Show"
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
    if (e.target.id !== "content-columns-container" && e.target.id !== "content-row-container" && e.target.id !== "deleteCardButton") {
      e.target.insertAdjacentHTML("afterend", `<div id="drop-over">&nbsp</div>`);
    }
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
  e.preventDefault();
  let div = document.getElementById("drop-over");
  div.parentNode.insertBefore(cardsManager.dragItem,div);
  let status_id = div.parentNode.getAttribute("data-column-id");
  let board_id = div.parentNode.getAttribute("data-board-id");
  let card_order = null
  if(div.nextSibling){
    card_order = div.nextSibling.getAttribute("data-cardorder-id");
  }
  else{
    card_order = parseInt(div.previousSibling.getAttribute("data-cardorder-id")) + 1;
  }

  let card_id = cardsManager.dragItem.getAttribute("data-card-id");
  let data = {"status_id": status_id, "card_order": card_order, "board_id":board_id}
  dataHandler.changeStatus(card_id, data).then(r =>{});
  div.remove();
  cardsManager.dragItem = null;
}


function openNewBoardModal() {
    let newBoardModal = document.getElementById("new-board-modal")
    let newCardForm = document.getElementById("form-card")
    let newBoardForm = document.getElementById("form-board")
    let modalTitle = document.getElementById("exampleModalLabel")
    let inputModal = document.getElementById("board-title")
    newBoardForm.hidden = false
    newCardForm.hidden = true
    modalTitle.style.color = "black"
    modalTitle.innerHTML = "Create new board"
    inputModal.classList.remove("not_valid")
    inputModal.value = ""
    $(newBoardModal).modal();
}

function openNewCardModal(e) {
  let newCardModal = document.getElementById("new-board-modal")
  let newCardForm = document.getElementById("form-card")
  let newBoardForm = document.getElementById("form-board")
  let modalTitle = document.getElementById("exampleModalLabel")
  let inputModal = document.getElementById("card-title")
  let boardId = e.target.dataset.boardId;
  newCardForm.setAttribute("data-board-id", boardId)
  newCardForm.hidden = false
  newBoardForm.hidden = true
  modalTitle.style.color = "black"
  modalTitle.innerHTML = "Create new card"
  inputModal.classList.remove("not_valid")
  inputModal.value = ""
  $(newCardModal).modal();
}
function removeNotValidStyleBoard() {
    let fieldToRemoveStyle = document.getElementById("board-title")
    fieldToRemoveStyle.classList.remove("not_valid")
}
function removeNotValidStyleCard() {
    let fieldToRemoveStyle = document.getElementById("card-title")
    fieldToRemoveStyle.classList.remove("not_valid")
}

