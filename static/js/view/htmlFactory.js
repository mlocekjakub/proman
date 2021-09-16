export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.column:
            return columnBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return ` <br><div class="container">
  <div class="row bg-light" id="header-Row" data-board-id="${board.id}">
      <div class="col h3 margin_header" id="board-title">${board.title}
    </div>
    <div class="col-md-auto margin_header"><button type="button" class="btn btn-outline-dark btn-sm" id="deleteBoardButton" data-board-id="${board.id}">Delete Board</button>
    </div>
    <div class="col-md-auto margin_header"><button type="button" data-board-id="${board.id}" class="btn btn-outline-dark btn-sm" id="add-card" hidden>+ Add Card</button>
    </div>
      <div class="col col-lg-2 margin_header"><button type="button" class="btn btn-outline-dark btn-sm" id="showContent" data-board-id="${board.id}">v Show Cards</button>
    </div>
  </div> 
  <div class="row" data-board-id="${board.id}" id ="statuses-row-container" hidden>
  </div>
  <div class="row" data-board-id="${board.id}" id="content-row-container" hidden>
</div>
  </div><br>`;
}

function cardBuilder(card) {
    return `<div draggable="true" data-card-id="${card.id}" data-cardorder-id="${card.card_order}" class="cards border border-info rounded">
      ${card.title} <button type="button" id="deleteCardButton" data-card-id="${card.id}" class="btn btn-link">coś
<!--      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">-->
<!--  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>-->
  </button>
    </div>`;
}

function columnBuilder(column,boardId) {
    document.querySelector(`#statuses-row-container[data-board-id='${boardId}']`).hidden = false
    document.querySelector(`#content-row-container[data-board-id='${boardId}']`).hidden = false
    return [`<div class="col border-right border-secondary" style="background-color: #6F8FAF" data-column-id="${column.id}" data-board-id="${boardId}">
     <div id="status-title">${column.title}</div>
    </div>`, `<div class = "col" data-column-id="${column.id}" id="content-columns-container" data-board-id="${boardId}"><div class="empty">&nbsp</div></div>`];
    }

