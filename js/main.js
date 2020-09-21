let ol = document.querySelector('ol')
let qtdPlayers = 0

const baseURL = 'http://localhost:3000/players'

// Carregando os usuários cadastrados //
const request = new XMLHttpRequest()
request.open('GET', baseURL, true)
request.responseType = 'json'
request.send()
request.onload = function () {
    const players = request.response
    populateList(players)
    selected()
}

// Carregando os players cadastrados no arquivo db.json //
function populateList(json) {
    const players = json
    qtdPlayers = players.length

    for (let i = 0; i < qtdPlayers; i++) {
        
        // Criando os elementos e atribuindo classes e valores à eles
        const userItem = document.createElement('li')
        userItem.classList.add("user-item")

        const userID = document.createElement('input')
        userID.type = 'hidden'
        userID.id = players[i].id
        userID.classList.add('user-id')

        const user = document.createElement('div')
        user.classList.add("user")

        const userImage = document.createElement('div')
        userImage.classList.add("user-image")
        userImage.style.borderColor = `${players[i].borderColor}`

        const userName = document.createElement('div')
        userName.classList.add("user-name")
        userName.innerHTML = players[i].username

        const level = document.createElement('div')
        level.classList.add("level")
        level.innerHTML = `${players[i].level}.lvl`

        const name = document.createElement('span')
        name.classList.add('name')
        name.innerHTML = `${players[i].name} ${players[i].lastname}`

        const status = document.createElement('span')
        if (players[i].status === 'offline') {
            status.style.color = 'red'
            status.innerHTML = players[i].status
        }
        else {
            status.classList.add('status')
            status.style.color = 'green'
            status.innerHTML = `${players[i].status} <span></span>`
        }

        const image = document.createElement('img')
        image.setAttribute('src', `../assets/${players[i].avatar}.png`)

        //Adicionando as tags criada ao elemento Pai delas              
        userImage.appendChild(image)
        
        user.appendChild(userName)
        user.appendChild(name)
        user.appendChild(level)
        user.appendChild(status)
        user.appendChild(status)

        userItem.appendChild(userID)
        userItem.appendChild(user)
        userItem.appendChild(userImage)

        ol.appendChild(userItem)
    }
}

// Adicionando evento de click e classe 'actived' ao player selecionado //
function selected() {
    $('.user-item').click(function () {
        const $this = $(this);
        $this.addClass('actived');
        $this.siblings('.user-item').removeClass('actived');

        //capturando o ID do player selecionado //
        const userID = document.querySelector('.actived').children[0].id
        getUser(userID)
    })

}

// Encontrar o player correspondente ao ID passado como parâmetro //
function getUser(id) {
    const player = request.response
    let data;

    // ForEach para percorrer o array de objetos
    player.forEach(e => {
        if (id == e.id) {
            data = { ...e }
        }
    })
    loadData(data)
}

// Carregando os dados do usuário selecionado //
function loadData(user) {

    try {
        for (value in user) {
            // Só vai carregar os dados em que os campos que forem editáveis
            document.getElementById(value).value = user[value] ? user[value] : ''
        }
        document.getElementById('info-status').value = user.status ? user.status : 'offline'
        document.getElementById('info-level').innerHTML = user.level
        document.getElementById('info-avatar').innerHTML = user.avatar
    } catch (e) {
        console.log('Carregando dados...')
    }
}

// Salvar os dados do Player passado como parâmetro após passar pela etapa de validação //
// Verificará se o usuário é novo ou ja existente no BD e diante disso definirá o método HTTP //
function save(player) {

    let method;
    let urlById;

    player.id = document.getElementById("id").value

    //Verifica se usuário existe e defini o tipo de método de requisição HTTP //
    if (player.id === '') {
        method = "POST"
        url = baseURL
        player.id = qtdPlayers + 1

        //Atribuindo valores padrão aos elementos read-only e avatar //
        player.status = "online"
        player.level = 0
        player.avatar = "avatar"
    }
    else {
        player.avatar = document.getElementById('info-avatar').innerHTML
        method = "PATCH"
        url = `${baseURL}/${player.id}`
    }

    // Requisição HTTP //
    const request = new XMLHttpRequest()
    request.open(method, url, true)
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = 'json'
    request.send(JSON.stringify(player))
    clear()
}

// Validação - Responsável por verificar existência ou não de campos vazios //
function validation() {
    const player = {
        name: $('#name').val(),
        lastname: $('#lastname').val(),
        dtBirthday: $('#dtBirthday').val(),
        username: $('#username').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        country: $('#country').val(),
        server: $('#server').val(),
        borderColor: $('#border-color').val(),
        avatar: $("#info-avatar").html()
    }

    let isEmpty = false;

    // Verificando se no objeto há alguma chave com valor vazio e caso tenha, isEmpty receberá true //
    for (let values in player) {
        if (player[values] === '') {
            isEmpty = true
        }
    }

    // Se todos os dados estiverem preenchidos será chamado a função save() //
    // Senão será emitido um alerta ao usuário //
    if (isEmpty === false) {
        save(player)
    }
    else {
        alert('Dados Incompletos')
    }
}

// Limpa os inputs do formulario //
function clear() {
    $("#id").val("")
    $("#name").val("")
    $("#lastname").val("")
    $("#dtBirthday").val("")
    $("#username").val("")
    $("#email").val("")
    $("#phone").val("")
    $("#country").val("")
    $("#server").val("")
    $("#border-color").val("#222222")
    $("#info-avatar").html("avatar")
    $("#info-status").val("")
    $("#info-level").html("0")
}

// Jquery //

$("#user-avatar").click(function () {
    $("#catalogo").toggle(500);
})

$("img").click(function () {
    $("#info-avatar").html(this.id)
})

$("#reset").click(function () { clear() })