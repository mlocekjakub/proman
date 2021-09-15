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
