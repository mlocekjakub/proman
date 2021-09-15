import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  dragItem:null ,
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
      domManager.addEventListener(
          `.card[data-card-id="${card.id}"]`,
          "dragstart",
          handleDragStart
      );
      domManager.addEventListener(
          `.card[data-card-id="${card.id}"]`,
          "dragend",
          handleDragEnd
      );
    }
  },
};

function deleteButtonHandler(clickEvent) {
  console.log("click")
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