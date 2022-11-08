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
let db =                firebase.firestore();
const storage =         firebase.storage();
let animeSelection =    document.querySelector("#animeSelection") 

async function update(name){
    animeSelection.innerHTML = "<option>Qual é o anime?</option>"
    db.collection("Animes").get().then((snapshot)=>{
        let arrayAnimeName = []
        snapshot.forEach(doc => {
            arrayAnimeName.push(doc.id)
        });
        arrayAnimeName.sort((a,b) => {
            if(a.toUpperCase() < b.toUpperCase()) {
                return -1
            } else {
                return true
            }
        })
        arrayAnimeName.forEach((doc)=>{
            if(name == doc){
                animeSelection.innerHTML += `<option value="${doc}" id="${doc}" selected>${doc}</option>`
            }else{
                animeSelection.innerHTML += `<option value="${doc}" id="${doc}">${doc}</option>`
            }
        })
    })
}

function addAnime(){
    let valueName = document.querySelector("input#nameAnime").value
    if(valueName != ""){
        document.querySelector("#confirmAdd").style.display = "flex"
        document.querySelector("#confirmAddContent>h1").innerHTML = `Deseja adicionar <span>${valueName}</span> na lista de animes?`
    }else{
        alert("coloque algum nome de anime")
    }
}

function confirmAdd(){
    let valueName = document.querySelector("input#nameAnime").value
    db.collection("Animes").doc(valueName).set({}).then(()=>{
                                                        update(valueName)
                                                        document.querySelector("#confirmAdd").style.display = "none"})
}

function cancelAdd(){
    document.querySelector("#confirmAdd").style.display = "none"
}
function showFoto(){
    let select = document.querySelector("#animeSelection")
    let animeSelected = select.options[select.selectedIndex].value
    if(animeSelected == "Qual é o anime?"){
        window.alert("escolha algum anime")
    } else {
        document.querySelector("#modalFoto").style.display = "flex"
    }
    
}
document.querySelector("#modalFoto").addEventListener("click", hidemodal)
document.querySelector("#confirmAdd").addEventListener("click", hidemodal)
function hidemodal(e){
    if(e.target.classList[0] == "modal"){
        console.log("foi")
        e.target.style.display = "none"
    }
}

function submitMusic(){
    document.querySelector("#load").style.display = "flex"
    let select = document.querySelector("#animeSelection")
    let animeSelected = select.options[select.selectedIndex].value
    let name = document.querySelector("#nameMusic").value
    let file = document.querySelector("#fileMusic").files[0]
    
    storage.ref().child(name).put(file).then((snapshot)=>{
        storage.ref(name).getDownloadURL().then(url=>{
            db.collection("Animes").doc(`${animeSelected}`).update({
            musics : firebase.firestore.FieldValue.arrayUnion({name, link:url})
            }).then(()=>{update() 
                        document.querySelector("#load").style.display = "none"})
        })
    })
}

function search(){
    let select = document.querySelector("#animeSelection")
    let animeSelected = select.options[select.selectedIndex].value
    document.querySelector("main>ul").innerHTML = ""
    db.collection("Animes").doc(animeSelected).get().then((snapshot)=>{
        snapshot.data().musics.map((music)=>{
            document.querySelector("main>ul").innerHTML += `<li>${music.name}</li>`
        })
    })
}

update()