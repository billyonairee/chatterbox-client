$(document).ready(() => {
  fetchMessages();
  
});

const url = "http://52.78.213.9:3000/messages";
const app = {
  init: () => {
    $(document).on("click", "#send", app.handleSubmit);
  },
  send: data => {
    postMessage(data);
  },
  fetch: data => {
    fetchMessages(data);
    // app.server = url;
  },
  server: url,
  clearMessages: () => {
    $("#chats").empty();
  },
  // clearMessages: () => $("#chats").empty()
  renderMessage: data => {
    // fetchMessages(data);
    $("#chats").append(`<p>{data}</p>`);
  },
  renderRoom: data => {
    $("#roomSelect").append(`<p>{data.roomname}</p>`);
  },
  handleSubmit:(data)=>{
  }
};

const fetchMessages = (data) =>{
  // prompt("Hello, What's your name?"),
  // console.log($("#roomname").val()
  $.ajax({
    url,
    success: (data) => {
      $("#chats").html("");
      data.forEach(({ username, text, roomname, date }) => {
        username = username.replace(/<\/?[^>]+(>|$)/g, "");
        text = text.replace(/<\/?[^>]+(>|$)/g, "");
        roomname = roomname.replace(/<\/?[^>]+(>|$)/g, "");
        // const $p = $(`<p>${username}: ${text} (${roomname} @${date}) <p/>`);
        const $p = $(`<p>${username}: ${text} (${date}) <p/>`);
        $("#chats").append($p);
      })
      
      for(var i = 0; i < data.length; i++){
        // console.log($("#roomname").children().attr("id"))
        const childrenId = $("#roomname").children(`#${data[i].roomname}`).attr("id")
        if(childrenId === undefined){
          const $option = $(`<option id="${data[i].roomname}">${data[i].roomname}</option>`)
          $("#roomname").append($option);
        }
    }
  }
  })
};

const postMessage = (data) =>{
  $.ajax({
    type: "POST",
    url,
    contentType: "application/json",
    data: JSON.stringify({
      username: $("#username").val() || data.username,
      text: $("#text").val() || data.text,
      roomname: $("#roomname").val() || data.roomname
    }),
    success: () => selectedChats()
  })
}


const selectedChats = (data) => {
  $.ajax({
    url,
    success: (data) => {
      $("#chats").html("");
      const selectRoom = $("#roomname option:selected").val()
      for(var i = 0; i<data.length; i++){
        if(selectRoom === data[i].roomname){
          var selectRoomArr = []
          selectRoomArr.push(data[i]);
          selectRoomArr.forEach(({ username, text, roomname, date }) => {
              username = username.replace(/<\/?[^>]+(>|$)/g, "");
              text = text.replace(/<\/?[^>]+(>|$)/g, "");
              roomname = roomname.replace(/<\/?[^>]+(>|$)/g, "");
              const $p = $(`<p>${username}: ${text} (${roomname} @${date}) <p/>`);
              // const $p = $(`<p>${username}: ${text} (${date}) <p/>`);
              $("#chats").append($p);
          })
        }
      }
    }
  })
};


$(document).on("click", "#send", postMessage);
$(document).on("click", "#fetch-btn", fetchMessages);
$("select").on("change", function() {
  selectedChats();
});