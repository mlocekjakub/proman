import {cardsManager} from "../controller/cardsManager";

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
  },
  getStatus: async function (statusId) {
    // the status is retrieved and then the callback function is called with the status

    },
    getCardsByBoardId: async function (boardId) {
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
    createNewBoard: async function (e) {
      e.preventDefault()
      let title = document.getElementById("board-title").value
      let boardHeader = document.getElementById("exampleModalLabel")
      const form = e.currentTarget
      const url = form.action;
      if (!title) {
          setTimeout(function(){ title.style.borderColor = "red"; }, 1000);
          return;
      }
        try {
            await postData(url, title)
                .then (response => {
                    document.getElementById("form-board").hidden = true
                    boardHeader.innerText = "successfully added board"
                    boardHeader.style.color = "#4BB543"
                    setTimeout(function(){ this.reloadBoards() }, 1000);
                    // this.reloadBoards()
                });
        }catch (error){
	        console.log(error);
        }
  },
    reloadBoards: async function (e) {
    let page = document.getElementById("root")
        page.innerHTML = ""
        await cardsManager.loadCards()
    },
  createNewCard: async function (e) {
      e.preventDefault()
      let title = document.getElementById("card-title").value
      let cardHeader = document.getElementById("exampleModalLabel")
      const form = e.currentTarget
      let boardId = form.getAttribute("data-board-id")
      console.log(boardId)
      console.log(title)
      const url = form.action;
      let formData = {"cardTitle": title, "boardId": boardId}
      if (!title) {
          setTimeout(function(){ title.style.borderColor = "red"; }, 1000);
          return;
      }
        try {
            await postData(url, formData)
                .then (response => {
                    document.getElementById("form-card").hidden = true
                    cardHeader.innerText = "successfully added card"
                    cardHeader.style.color = "#4BB543"
                    setTimeout(function(){ this.reloadBoards(); }, 1000);

                });
        }catch (error){
	        console.log(error);
        }
  //   // creates new card, saves it and calls the callback function with its data
  },
    changeStatus: async function (cardId, data) {
        const response = await apiPut(`/api/boards/cards/${cardId}`, data)
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

async function postData(url, data){
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
