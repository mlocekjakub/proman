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
    return ` <div class="container">
  <div class="row justify-content-md-between bg-light" id="header-Row" data-board-id="${board.id}">
      <div class="col col-lg-2"><button type="button" class="btn btn-outline-dark"> Cards</button>
    </div>
    <div class="col-lg-2 h4">${board.title}
    </div>
      <div class="col col-lg-2"><button type="button" class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
    </div>
  </div> 
  <div class="row" data-board-id="${board.id}" id ="content-Row" hidden>
  </div>
  </div>`;
}

function cardBuilder(card) {
    // document.querySelector(`.col[data-board-id='${card.board_id}']`).hidden = false
    return `<div class="col border-right border-secondary" id=data-card-id="${card.id}">
      ${card.title}
    </div>`;
}

function columnBuilder(column,boardId) {
    document.querySelector(`#content-Row[data-board-id='${boardId}']`).hidden = false
    return `<div class="col border-right border-secondary" data-column-id="${column.id}" data-board-id="${boardId}">
      ${column.title}
    </div>`;
}

