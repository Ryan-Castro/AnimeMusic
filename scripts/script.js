const firebaseConfig = {
    apiKey:             "AIzaSyCj8-09WU4fZpW8G9F3K1Obhc78xD8DXbI",
    authDomain:         "animemusic-23292.firebaseapp.com",
    projectId:          "animemusic-23292",
    storageBucket:      "animemusic-23292.appspot.com",
    messagingSenderId:  "847267376326",
    appId:              "1:847267376326:web:0d75ccf8fa1cc1d1eb3bc7",
    measurementId:      "G-W1ZN9827XS"
  };

firebase.initializeApp(firebaseConfig);
let db =                firebase.firestore()
const storage =         firebase.storage();
let animes =            ''
let musics =            ''
let musicsSelect =      ""
let isPlaying =         false
let listMusic =         []
let listMusicPlaying =  []
let nameMusicSelect =   ""
let numMusicList
let findAnime =         ""
let capa =              ""
let volume =            .5

init()

function init(){
    
    db.collection("Animes").get().then((snapshot)=>{
    animes = ""
    snapshot.forEach(pastas=>{
       animes += `  <li onclick="listingMusics('${pastas.id}')">
                        <div class="anime">
                            <h1>${pastas.id}</h1>
                        </div>
                    </li>`
    })
    document.querySelector('#animes').style.display = "block"
    document.querySelector('#animes').innerHTML = `<ul>${animes}</ul>`
    document.querySelector('#animesMusics').style.display = "none"
})}


function listingMusics(anime){
    if(findAnime == anime){
        document.querySelector('#animes').style.display = "none"
        document.querySelector('#animesMusics').style.display = "block"
        return
    }
    findAnime = anime
    listMusic = [] 
    document.querySelector("#load").style.display = "flex"
    db.collection("Animes").doc(anime).get().then((snapshot)=>{
        console.log(snapshot.data().musics)
        snapshot.data().musics.forEach(iten=>{  
            listMusic.push({name: iten.name, link: iten.link})
            })}).then(res=>{
                listMusic.sort(function(a, b){
                    if(a.name < b.name){
                        return -1 
                    } else {
                        return true
                    }
                } )
        renderMusic()
})
}

function renderMusic(){
    musics = ""
    
    listMusic.map(music=>{
        let name = music.name
    musics += `
        <div class="music">
            <h2>
                ${name.replace(".mp3", "")}
            </h2>
            <button onclick="playMusicSelect('${name}', '${music.link}')"><span class="material-symbols-outlined">
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

function creatMusic(link){
    let musicInput = document.createElement('audio')
    musicInput.setAttribute('src', `${link}`)
    musicInput.addEventListener("ended", musicNext);
    return musicInput
}

async function playMusicSelect(musicSelectInput, link){
    document.querySelector("#nameMusicPlayng").innerHTML = musicSelectInput.replace(".mp3", "")

    listMusicPlaying = listMusic
    document.querySelector("#capa").setAttribute("src", capa)
    if(isPlaying){
        musicsSelect.pause()
    }

    musicsSelect = creatMusic(link)
    await musicsSelect.load()
    musicsSelect.play()
    musicsSelect.volume = volume
    isPlaying = true
    numMusicList = listMusicPlaying.findIndex(n =>  n.name == musicSelectInput)
}

function playAndPause(button){
    
    if(musicsSelect != ""){
    if(isPlaying){
        musicsSelect.pause()
        isPlaying = false
        button.children[0].innerHTML = "pause"
    } else{
        musicsSelect.play()
        isPlaying = true
        button.children[0].innerHTML = "play_arrow"
    }}
}

async function musicPrev(){
    
    await musicsSelect.pause()
    if(numMusicList == 0){
        numMusicList = listMusicPlaying.length - 1
    } else {
        --numMusicList
    }
      
    musicsSelect = creatMusic(`${listMusicPlaying[numMusicList].link}`)
    document.querySelector("#nameMusicPlayng").innerHTML = listMusicPlaying[numMusicList].name.replace(".mp3", "")
    musicsSelect.load()
    musicsSelect.play()
    musicsSelect.volume = volume
}
    
async function musicNext(){
    
    await musicsSelect.pause()
    if(numMusicList == listMusicPlaying.length - 1){
        numMusicList = 0
    } else {
        ++numMusicList
    }
      
    musicsSelect = creatMusic(`${listMusicPlaying[numMusicList].link}`)
    musicsSelect.load()
    document.querySelector("#nameMusicPlayng").innerHTML = listMusicPlaying[numMusicList].name.replace(".mp3", "")
    musicsSelect.play()
    musicsSelect.volume = volume
}
    

function setvolume(input){
    volume = input.value/100
    musicsSelect.volume = volume
}

