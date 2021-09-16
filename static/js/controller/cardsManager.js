import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  dragItem:null ,
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    const columns = await dataHandler.getStatusesByBoardId(boardId)
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column)
      const content = columnBuilder(column,boardId)[0]
      const contentContainer = columnBuilder(column,boardId)[1]
      domManager.addChild(`#content-row-container[data-board-id="${boardId}"]`, contentContainer)
      domManager.addChild(`#statuses-row-container[data-board-id="${boardId}"]`, content);
    }
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`#content-columns-container[data-column-id="${card.status_id}"][data-board-id="${card.board_id}"]`, content);
      domManager.addEventListener(
        `#deleteCardButton[data-card-id="${card.id}"]`,
        "click",
        deleteCardButtonHandler
      );
      domManager.addEventListener(
          `.cards[data-card-id="${card.id}"]`,
          "dragstart",
          handleDragStart
      );
      domManager.addEventListener(
          `.cards[data-card-id="${card.id}"]`,
          "dragend",
          handleDragEnd
      );
    }
  },
};

function deleteCardButtonHandler(clickEvent) {
  const cardId = clickEvent.target.dataset.cardId;
  const cardsToDelete = document.getElementsByClassName('cards');
  for (let card of cardsToDelete) {
    if (cardId === card.getAttribute('data-card-id')) {
      card.remove();
      dataHandler.deleteCard(cardId);
    }
  }
}

function handleDragStart(e) {
  cardsManager.dragItem= e.target.outerHTML
  e.target.classList.add("dragged","drag-feedback")
  deferredOriginChanges(this,"drag-feedback")
}

function handleDragEnd(e) {
  e.target.classList.remove("dragged")
  e.target.remove()
}

function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}