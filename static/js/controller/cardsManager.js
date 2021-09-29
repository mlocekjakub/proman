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
        const columns = await dataHandler.getStatusesByBoardId(boardId)
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
    let card_id = e.target.getAttribute("data-card-id")
    let previousInput = e.target.innerText
    let isSave = false
    e.target.innerHTML = `<div><input id="change-title" name="title" value="${previousInput}"></div>`

    document.getElementById('change-title').addEventListener("keypress", function (eve) {
        if (eve.key === 'Enter') {
            let title = eve.target.value
            dataHandler.changeCardName(card_id, {'title': title})
            isSave = true
            document.activeElement.blur()
        }
    })
    document.getElementById('change-title').addEventListener("focusout", function (eve) {
        let title = eve.target.value
        if(!isSave) {
            e.target.innerHTML = `${previousInput} <i id="deleteCardButton" data-card-id="${card_id}" class="bi bi-trash2" hidden></i>`
        }else{
            e.target.innerHTML = `${title} <i id="deleteCardButton" data-card-id="${card_id}" class="bi bi-trash2" hidden></i>`
        }})
}


    function deferredOriginChanges(origin, dragFeedbackClassName) {
        setTimeout(() => {
            origin.classList.remove(dragFeedbackClassName);
        });
    }


