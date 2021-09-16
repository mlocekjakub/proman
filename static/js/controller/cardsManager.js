import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    initEvents: function (card_id) {
        domManager.addEventListener(
            `.cards[data-card-id="${card_id}"]`,
            "dragstart",
            handleDragStart
        );
        domManager.addEventListener(
            `.cards[data-card-id="${card_id}"]`,
            "dragend",
            handleDragEnd
        );
        domManager.addEventListener(
                `#deleteCardButton[data-card-id="${card_id}"]`,
                "click",
                deleteCardButtonHandler
            );
        domManager.addEventListener(
            `.cards[data-card-id="${card_id}"]`,
            "mouseover",
            showButton
        );
        domManager.addEventListener(
            `.cards[data-card-id="${card_id}"]`,
            "mouseleave",
            hideButton
        );
        domManager.addEventListener(
            `.cards[data-card-id="${card_id}"]`,
            "dblclick",
            changeNameOfCard
        );
    },
    dragItem: null,
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const columns = await dataHandler.getStatusesByBoardId()
        console.log(boardId);
        console.log(columns);
        for (let column of columns) {
            const columnBuilder = htmlFactory(htmlTemplates.column)
            const content = columnBuilder(column, boardId)[0]
            const contentContainer = columnBuilder(column, boardId)[1]
            domManager.addChild(`#content-row-container[data-board-id="${boardId}"]`, contentContainer)
            domManager.addChild(`#statuses-row-container[data-board-id="${boardId}"]`, content);
        }
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`#content-columns-container[data-column-id="${card.status_id}"][data-board-id="${card.board_id}"]`, content);

            this.initEvents(card.id)
        }
    },
};
function showButton(event) {
    let buttons = event.target.getElementsByTagName('button')
    for (let button of buttons) {
        button.style.display = 'inline';
    }
}

function hideButton(event) {
    let buttons = event.target.getElementsByTagName('button')
    for (let button of buttons) {
        button.style.display = 'none';
    }
}

function deleteCardButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const cardsToDelete = document.getElementsByClassName('cards');
    for (let card of cardsToDelete) {
        if (cardId === card.getAttribute('data-card-id')) {
            card.remove();
            dataHandler.deleteCard(cardId).then(r => console.log(r));
        }
    }
}

function handleDragStart(e) {
    let node = e.currentTarget
    cardsManager.dragItem = node
    e.target.classList.add("dragged", "drag-feedback")
    deferredOriginChanges(this, "drag-feedback")
}

function handleDragEnd(e) {
    e.target.classList.remove("dragged")
    cardsManager.dragItem = null
}

function changeNameOfCard(e){
    let tempInnerHTML = e.target;
    let card_id = tempInnerHTML.getAttribute("data-card-id")
    let value = e.target.innerText
    e.target.innerHTML = `<div><form action="/api/board/cards/name/${card_id}" method="post" ><input class="trans" name="title" value="${value}"></form></div>`
}

function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}

