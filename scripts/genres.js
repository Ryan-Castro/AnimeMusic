let generos = [
    "Ação",
    "Artes Marciais",
    "Aventura",
    "Comédia",
    "Demônios",
    "Drama",
    "Ecchi",
    "Escolar",
    "Esporte",
    "Fantasia",
    "Ficção científica",
    "Harém",
    "Histórico",
    "Horror",
    "Jogo",
    "Light Novel",
    "Magia",
    "Mecha",
    "Militar",
    "Mistério",
    "Musical",
    "Romance",
    "Samurai",
    "Seinen",
    "Shoujo",
    "Shounen",
    "Slice Of Life",
    "Sobrenatural",
    "Super Poderes",
    "Suspense",
    "Terror",
    "Yaoi",
    "Yuri"
]

document.querySelector("#modalGenres").addEventListener("click", hidemodal)


function showModalGenres() {
    document.querySelector("#listGeneros").innerHTML = ""
    generos.map(genero => {
        document.querySelector("#listGeneros").innerHTML += `<li onclick="searchForGenre('${genero}')")>${genero}</li>`
    })
    document.querySelector("#modalGenres").style.display = "flex"
}

function searchForGenre(genero) {
    db.collection("Animes").get().then((snapshot) => {
        animes = ""
        snapshot.forEach(pasta => {
            if (pasta.data().generos) {
                pasta.data().generos.forEach(iten => {

                    if (iten == genero) {
                        animes += ` <li onclick="listingMusics('${pasta.id}')">
                                    <div class="anime">
                                        <h1>${pasta.id}</h1>
                                    </div>
                                </li>`
                    }
                })
            }

        })
        if (animes == "") {
            animes += ` <li onclick="init()">
                            <div class="anime">
                                <h1>Nenhum anime encontrado</h1>
                            </div>
                        </li>`
        }
        document.querySelector('#animes').style.display = "block"
        document.querySelector('#animes').innerHTML = `<ul>${animes}</ul>`
        document.querySelector('#animesMusics').style.display = "none"
        document.querySelector("#modalGenres").style.display = "none"
    })
}

function hidemodal(e) {
    if (e.target.classList[0] == "modal") {
        e.target.style.display = "none"
    }
}