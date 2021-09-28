import {boardsManager} from "../controller/boardsManager.js";
import {domManager} from "../view/domManager";

export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatusesByBoardId: async function () {
        return await apiGet(`/api/statuses`);
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status

    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
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
            await postData(url, title.value)
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
            await postData(url, formData)
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
    loginUser: async function (e) {
        e.preventDefault()
        let email = document.getElementById("email-login")
        let password = document.getElementById("password-login")
        let formData = {"email": email.value, "password": password.value}
        let url = document.getElementById("login-form").action
        let informationModal = document.getElementById("information-modal")
        let notValidInputInfo = document.getElementById("not_valid_info_login")
        let loginModal = document.getElementById("registerModal")
        let registerInfo = document.getElementById("register-info")
        notValidInputInfo.hidden = true
        if (!(email.value)) {
            email.classList.add("not_valid")
            return;
        }
        if (!(password.value)) {
            password.classList.add("not_valid")
            return;
        }
        try {
            await postData(url, formData)
                .then((res) => {
                    if (!res) {
                        notValidInputInfo.hidden = false
                    }
                    else {
                        $(loginModal).modal('hide')
                        registerInfo.innerHTML = "Successfully logged in"
                        $(informationModal).modal()
                        notValidInputInfo.hidden = true
                        $( "#navbar-buttons" ).load(window.location.href + " #navbar-buttons" );
                        // domManager.addEventListener("#logout",
                        //     "click",
                        //     dataHandler.logout);
                    //     domManager.addEventListener(`#create-board-button`,
                    //         "click",
                    //         boardModal.openNewBoardModal);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    },
    registerUser: async function (e) {
        e.preventDefault()
        let email = document.getElementById("email-register")
        let password = document.getElementById("password-register")
        let formData = {"email": email.value, "password": password.value}
        let url = document.getElementById("register-form").action
        let registerModal = document.getElementById("registerModal")
        let informationModal = document.getElementById("information-modal")
        let notValidInputInfo = document.getElementById("not_valid_info_register")
        let registerInfo = document.getElementById("register-info")
        notValidInputInfo.hidden = true
        if (!(email.value)) {
            email.classList.add("not_valid")
            return;
        }
        if (!(password.value)) {
            password.classList.add("not_valid")
            return;
        }
        try {
            await postData(url, formData)
                .then((res) => {
                    if (res) {
                        $(registerModal).modal('hide');
                        registerInfo.innerHTML = "Successfully registered"
                        $(informationModal).modal();
                        notValidInputInfo.hidden = true
                    }
                    else {
                        notValidInputInfo.hidden = false
                    }
                });
        } catch (error) {
            console.log(error);
        }

    },
    logout: async function(e) {
        e.preventDefault()
        await apiGet(`/api/logout`)
    },
    changeStatus: async function (cardId, data) {
        const response = await apiPut(`/api/boards/cards/${cardId}`, data)
    },
    changeName: async function (cardId, data) {
        const response = await apiPut(`/api/boards/cards/name/${cardId}`, data)
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        return response.json();
    }
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
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
    let response = fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
