import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    const columns = await dataHandler.getStatusesByBoardId(boardId)
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column)
      const content = columnBuilder(column,boardId)
      domManager.addChild(`#content-Row[data-board-id="${boardId}"]`, content);
    }
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`.col[data-column-id="${card.status_id}"][data-board-id="${card.board_id}"]`, content);
      domManager.addEventListener(
        `.col border-right border-secondary[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
    }
  },
};

function deleteButtonHandler(clickEvent) {

}
