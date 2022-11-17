const firebaseConfig = {
    apiKey: "AIzaSyCj8-09WU4fZpW8G9F3K1Obhc78xD8DXbI",
    authDomain: "animemusic-23292.firebaseapp.com",
    projectId: "animemusic-23292",
    storageBucket: "animemusic-23292.appspot.com",
    messagingSenderId: "847267376326",
    appId: "1:847267376326:web:0d75ccf8fa1cc1d1eb3bc7",
    measurementId: "G-W1ZN9827XS"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore()
const storage = firebase.storage();
let animes = ''
let musics = ''
let musicsSelect = ""
let isPlaying = false
let listMusic = []
let listMusicPlaying = []
let nameMusicSelect = ""
let numMusicList
let findAnime = ""
let capa = ""
let volume = .5
init()
topHits()
let topHitsArray = []
function topHits() {
    db.collection("controle").doc("vezesTocadas").get().then((snapshot) => {
        Object.keys(snapshot.data()).forEach(hits => {
            if (topHitsArray.length < 10) {
                topHitsArray.push(snapshot.data()[hits])
            } else {
                topHitsArray.sort((a, b) => b.cont - a.cont)
                if (topHitsArray[9].cont < snapshot.data()[hits].cont) {
                    topHitsArray[9] = snapshot.data()[hits]
                }
                topHitsArray.sort((a, b) => b.cont - a.cont)
            }

        }) 
    }).then(()=>{renderTopHits(topHitsArray)})
}

function renderTopHits(topHitsArrays) {
    document.querySelector("#cards").innerHTML = ""
    document.querySelector("#inputsCarousel").innerHTML = ""
    let linkMusic = ""
    topHitsArrays.map((music, i) => {
        topHitsArrays[i].link = linkMusic
        document.querySelector("#cards").innerHTML
            += `
                <div class="card num${i} " onclick="">
                    <h1>${music.anime} - ${music.name} - ${music.cont}</h1>
                </div> 
            `

     
        document.querySelector("#inputsCarousel").innerHTML +=
            `<input type="radio" name="radio.btn" id="radio${i}" onchange="slide(${i})">`
    })
    updateCard()
}

function updateCard(){
    topHitsArray.map((music, i) => {
        

        db.collection("Animes").doc(music.anime).get().then((snapshot) => { 
            
            topHitsArray[i].capa = snapshot.data().capa
            snapshot.data().musics.map((itenArray) => {
                if (itenArray.name == music.name) { 
                    document.querySelector(`.num${i}`).style.backgroundImage = `url(${music.capa})`
                    topHitsArray[i].link = itenArray.link
                    document.querySelector(`.num${i}`).addEventListener('click', ()=>{playMusicSelect(`${music.name}`, `${itenArray.link}`, `${music.anime}`, true)})
                }
                
            })
            
        })
    })  
}

function slide(i) {
    document.getElementById("cards").style.marginLeft = `-${i}00%`
}


function init() {
    db.collection("Animes").get().then((snapshot) => {
        animes = ""
        snapshot.forEach(pastas => {
            animes += `  <li onclick="listingMusics('${pastas.id}')">
                        <div class="anime">
                            <h1>${pastas.id}</h1>
                        </div>
                    </li>`
        })
        document.querySelector('#animes').style.display = "block"
        document.querySelector('#animes').innerHTML = `<ul>${animes}</ul>`
        document.querySelector('#animesMusics').style.display = "none"
    })
}


function listingMusics(anime) {
    if (findAnime == anime) {
        document.querySelector('#animes').style.display = "none"
        document.querySelector('#animesMusics').style.display = "block"
        return
    }
    findAnime = anime
    listMusic = []
    document.querySelector("#load").style.display = "flex"
    db.collection("Animes").doc(anime).get().then((snapshot) => {
        if (snapshot.data().musics) {
            snapshot.data().musics.forEach(iten => {
                listMusic.push({ name: iten.name, link: iten.link, anime, capa: snapshot.data().capa })
            })
        } else {
            return
        }
    }).then(res => {
        listMusic.sort(function (a, b) {
            if (a.name < b.name) {
                return -1
            } else {
                return true
            }
        })
        renderMusic()
    })
}

function renderMusic() {
    if (listMusic.length == 0) {
        document.querySelector('#animesMusics').innerHTML = `<div><h1>Nenhuma musica encontrada</h1></div>`
        document.querySelector('#animes').style.display = "none"
        document.querySelector('#animesMusics').style.display = "block"
        document.querySelector("#load").style.display = "none"
        return
    }
    musics = ""
    listMusic.map(music => {
        let name = music.name
        musics += `
        <div class="music">
            <h2>
                ${name.replace(".mp3", "")}
            </h2>
            <button onclick="playMusicSelect('${name}', '${music.link}', '${music.anime}', false)"><span class="material-symbols-outlined">
            play_circle
            </span></button>     
        </div>
        `
    })
    document.querySelector('#animes').style.display = "none"
    document.querySelector('#animesMusics').style.display = "block"
    document.querySelector('#animesMusics').innerHTML = musics
    document.querySelector("#load").style.display = "none"
}

function creatMusic(link) {
    document.querySelector("#audio").innerHTML = ""
    document.querySelector("#audio").innerHTML = `  <audio id="musicPlaying" preload="metadata">
                                                        <source src="${link}">
                                                    </audio>`
    document.querySelector("#musicPlaying").addEventListener("ended", musicNext);
    document.querySelector("#musicPlaying").onloadedmetadata = function () {
        document.querySelector("#timeMusic").max = Math.round(document.querySelector("#musicPlaying").duration)
        setInterval(() => {
            if (isPlaying) {
                let tempoPercorrido = document.querySelector("#musicPlaying").currentTime
                let tempoTotal = document.querySelector("#musicPlaying").duration == NaN ? 0 : document.querySelector("#musicPlaying").duration
                let timeTot = new Date(null);
                let timeupdate = new Date(null);
                timeTot.setSeconds(tempoTotal);
                timeupdate.setSeconds(tempoPercorrido)

                document.querySelector("#timeMusic").value = Math.round(tempoPercorrido)
                document.querySelector("#div-time>p").innerHTML =

                    `${timeupdate.toISOString().substr(15, 4)}
                /${timeTot.toISOString().substr(15, 4)}`

            }
        }, 1000)

    };

}




async function playMusicSelect(musicSelectInput, link, anime, isTopHits) {
    document.querySelector("#nameMusicPlayng").innerHTML = musicSelectInput.replace(".mp3", "")
    if (isTopHits) {
        listMusic = topHitsArray
    }
    listMusicPlaying = listMusic
    listMusicPlaying.map((itenArray) => {
        if (itenArray.name == musicSelectInput) {
            document.querySelector("#capa").setAttribute("src", itenArray.capa)
        }
    })

    if (isPlaying) {
        document.querySelector("#musicPlaying").pause()
    }
    creatMusic(link)
    await document.querySelector("#musicPlaying").load()
    document.querySelector("#musicPlaying").play()
    document.querySelector("#musicPlaying").volume = volume
    isPlaying = true
    numMusicList = listMusicPlaying.findIndex(n => n.name == musicSelectInput)
    updateCont(musicSelectInput, anime)
    document.querySelector("#nameAnimePlayng").innerHTML = anime
    updatePlaylist(listMusicPlaying, musicSelectInput)
}



function updatePlaylist(playlist, musicSelectInput) {
    document.querySelector("#playListPlaying").innerHTML = ""
    playlist.map((musicInPlaylist) => {
        if (musicInPlaylist.name == musicSelectInput) {
            document.querySelector("#playListPlaying").innerHTML += `<button onclick="playMusicSelect('${musicInPlaylist.name}', '${musicInPlaylist.link}', '${musicInPlaylist.anime}')" class="playing"><li>${musicInPlaylist.name}</li></button>`
        } else {
            document.querySelector("#playListPlaying").innerHTML += `<button onclick="playMusicSelect('${musicInPlaylist.name}', '${musicInPlaylist.link}', '${musicInPlaylist.anime}')"><li >${musicInPlaylist.name}</li></button>`
        }

    })
}



function playAndPause(button) {
    if (document.querySelector("#musicPlaying") != "") {
        if (isPlaying) {
            document.querySelector("#musicPlaying").pause()
            isPlaying = false
            button.children[0].innerHTML = "play_arrow"
        } else {
            document.querySelector("#musicPlaying").play()
            isPlaying = true
            button.children[0].innerHTML = "pause"
        }
    }
}

async function musicPrev() {
    await document.querySelector("#musicPlaying").pause()
    if (numMusicList == 0) {
        numMusicList = listMusicPlaying.length - 1
    } else {
        --numMusicList
    }

    creatMusic(`${listMusicPlaying[numMusicList].link}`)
    document.querySelector("#nameMusicPlayng").innerHTML = listMusicPlaying[numMusicList].name.replace(".mp3", "")
    updateCont(listMusicPlaying[numMusicList].name, listMusicPlaying[numMusicList].anime)
    document.querySelector("#musicPlaying").load()
    document.querySelector("#musicPlaying").play()
    document.querySelector("#musicPlaying").volume = volume
    document.querySelector("#capa").setAttribute("src", listMusicPlaying[numMusicList].capa)
    updatePlaylist(listMusicPlaying, listMusicPlaying[numMusicList].name)
}

async function musicNext() {
    await document.querySelector("#musicPlaying").pause()
    if (numMusicList == listMusicPlaying.length - 1) {
        numMusicList = 0
    } else {
        ++numMusicList
    }
    console.log(listMusicPlaying[numMusicList])
    creatMusic(`${listMusicPlaying[numMusicList].link}`)
    updateCont(listMusicPlaying[numMusicList].name, listMusicPlaying[numMusicList].anime)
    document.querySelector("#musicPlaying").load()
    document.querySelector("#nameMusicPlayng").innerHTML = listMusicPlaying[numMusicList].name.replace(".mp3", "")
    document.querySelector("#capa").setAttribute("src", listMusicPlaying[numMusicList].capa)
    document.querySelector("#musicPlaying").play()
    document.querySelector("#musicPlaying").volume = volume
    updatePlaylist(listMusicPlaying, listMusicPlaying[numMusicList].name)
}



function setvolume(input) {
    volume = input.value / 100
    document.querySelector("#musicPlaying").volume = volume
}

function setTime(input) {
    time = input.value
    document.querySelector("#musicPlaying").currentTime = time
}

function updateCont(name, anime) {
    let newObject = {}
    db.collection("controle").doc("vezesTocadas").get().then((snapshot) => {
        let numCont = snapshot.data()[name] ? snapshot.data()[name].cont : 0
        newObject[name] = { cont: numCont + 1, anime, name }
    }).then(() => { db.collection("controle").doc("vezesTocadas").update(newObject) })
}

