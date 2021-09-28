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
            `#archiveCardButton[data-card-id="${card_id}"]`,
            "click",
            archiveCardButtonHandler
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
    let buttons = event.target.getElementsByTagName('i')
    for (let button of buttons) {
        button.hidden = false;
    }
}

function hideButton(event) {
    let buttons = event.target.getElementsByTagName('i')
    for (let button of buttons) {
        button.hidden = true;
    }
}

function archiveCardButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const cardsToArchive = document.getElementsByClassName('cards');
    for (let card of cardsToArchive) {
        if (cardId === card.getAttribute('data-card-id')) {
            card.remove();
            const archived_status = true;
            let data = {"archived_status": archived_status};
            dataHandler.archiveCard(cardId, data);
        }
    }
}

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
    let node = e.currentTarget
    cardsManager.dragItem = node
    e.target.classList.add("dragged", "drag-feedback")
    deferredOriginChanges(this, "drag-feedback")
}

function handleDragEnd(e) {
    e.target.classList.remove("dragged")
    cardsManager.dragItem = null
}

function changeNameOfCard(e) {
    let tempInnerHTML = e.target;
    let card_id = tempInnerHTML.getAttribute("data-card-id")
    let value = e.target.innerText
    e.target.innerHTML = `<div><input id="change-title" class="trans" name="title" value="${value}"></div>`
    document.getElementById('change-title').addEventListener("keypress", function (eve) {
        console.log(eve.key)
        if (eve.key === 'Enter') {
            let title = eve.target.value
            dataHandler.changeName(card_id, {'title': title}).then(r => console.log())
            e.target.innerHTML = `${title} <i id="deleteCardButton" data-card-id="${card_id}" class="bi bi-trash2" hidden></i>`
        }

    })
    document.getElementById('change-title').addEventListener("blur", function (eve) {
        e.target.innerHTML = `${value} <i id="deleteCardButton" data-card-id="${card_id}" class="bi bi-trash2" hidden></i>`
    })
}

function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}


