export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatusesByBoardId: async function (boardId) {
        const response = await apiGet(`/api/statuses/${boardId}`);
        return response;
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status

    },
    getCardsByBoardId: async function (boardId) {
        console.log(boardId);
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
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
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
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

async function apiPut(url) {
}
