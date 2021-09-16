import { boardsManager } from "./controller/boardsManager.js";
import { dataHandler } from "./data/dataHandler.js";

function init() {
  boardsManager.loadBoards();
}

init();
