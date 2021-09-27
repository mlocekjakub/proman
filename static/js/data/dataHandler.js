import {boardsManager} from "../controller/boardsManager.js";

export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatusesByBoardId: async function () {
        const response = await apiGet(`/api/statuses`);
        return response;
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status

    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
        ``
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    deleteBoard: async function (boardId) {
        const response = await apiDelete(`/api/boards/${boardId}`);
    },
    deleteCard: async function (card_id) {
        const response = await apiDelete(`/api/boards/cards/${card_id}`);
    },
    createNewBoard: async function (e) {
        e.preventDefault()
        let title = document.getElementById("board-title")
        let boardHeader = document.getElementById("exampleModalLabel")
        const form = e.currentTarget
        const url = form.action;
        if (!title.value) {
            title.classList.add("not_valid")
            return;
        }
        try {
            await apiPost(url, title.value)
                .then(() => {
                    document.getElementById("form-board").hidden = true
                    boardHeader.innerHTML = "successfully added board <i class=\"bi bi-check2-all\"></i>"
                    boardHeader.style.color = "#3cb371"
                    setTimeout(function () {
                        dataHandler.reloadBoards();
                    }, 1000);
                });
        } catch (error) {
            console.log(error);
        }
    },
    reloadBoards: async function () {
        let page = document.getElementById("root")
        let modal = document.getElementById("new-board-modal")
        page.innerHTML = ""
        $(modal).modal('hide')
        await boardsManager.loadBoards()
    },
    createNewCard: async function (e) {
        e.preventDefault()
        let title = document.getElementById("card-title")
        let cardHeader = document.getElementById("exampleModalLabel")
        const form = e.currentTarget
        let boardId = form.getAttribute("data-board-id")
        const url = form.action;
        let formData = {"cardTitle": title.value, "boardId": boardId}
        if (!title.value) {
            title.classList.add("not_valid")
            return;
        }
        try {
            await apiPost(url, formData)
                .then(() => {
                    document.getElementById("form-card").hidden = true
                    cardHeader.innerHTML = "successfully added card <i class=\"bi bi-check2-all\"></i>"
                    cardHeader.style.color = "#3cb371"
                    setTimeout(function () {
                        dataHandler.reloadBoards();
                    }, 1000);

                });
        } catch (error) {
            console.log(error);
        }
    },
    changeStatus: async function (cardId, data) {
        const response = await apiPut(`/api/boards/cards/${cardId}`, data)
    },
    changeCardName: async function (cardId, data) {
        const response = await apiPut(`/api/boards/cards/name/${cardId}`, data)
    },
    changeBoardName: async function (boardId, data) {
        const response = await apiPut(`/api/boards/name/${boardId}`, data)
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}


async function apiPost(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function apiDelete(url) {
    let response = fetch(url, {
        method: "DELETE"
    });
}

async function apiPut(url, data) {
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}
