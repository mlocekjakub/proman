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
    <div class="col-md-auto margin_header"><button type="button" class="btn btn-outline-dark btn-sm">+ Add Card</button>
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
    return `<div data-card-id="${card.id}" class="cards border border-info rounded">
      ${card.title}
    </div>`;
}

function columnBuilder(column,boardId) {
    document.querySelector(`#statuses-row-container[data-board-id='${boardId}']`).hidden = false
    document.querySelector(`#content-row-container[data-board-id='${boardId}']`).hidden = false
    return [`<div class="col border-right border-secondary" style="background-color: #6F8FAF" data-column-id="${column.id}" data-board-id="${boardId}">
     <div id="status-title">${column.title}</div>
    </div>`, `<div class = "col" data-column-id="${column.id}" id="content-columns-container" data-board-id="${boardId}"></div>`];
    }

