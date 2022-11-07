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
    db.collection("Animes").doc(valueName).set({}).then(update(valueName))
}

update()