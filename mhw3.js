function onFocusUsername() {
  const usernameInput = document.querySelector('#username');
  if (usernameInput.value === "Username") {
    usernameInput.value = '';
  }
  console.log('focus su username');
}

function onBlurUsername() {
  const usernameInput = document.querySelector('#username');
  if (usernameInput.value.length === 0) {
    usernameInput.value = 'Username';
  }
  console.log('blur su username');
}

function onFocusPassword() {
  const passwordInput = document.querySelector('#password');
  if (passwordInput.value === "Password") {
    passwordInput.value = '';
  }
  console.log('focus su password');
}

function onBlurPassword() {
  const passwordInput = document.querySelector('#password');
  if (passwordInput.value.length === 0) {
    passwordInput.value = 'Password';
  }
  console.log('blur su password');
}

const usernameInput = document.querySelector("#username");
usernameInput.addEventListener("focus", onFocusUsername);
usernameInput.addEventListener("blur", onBlurUsername);

const passwordInput = document.querySelector("#password");
passwordInput.addEventListener("focus", onFocusPassword);
passwordInput.addEventListener("blur", onBlurPassword);

document.getElementById("username").style.display = "none";
document.getElementById("password").style.display = "none";

function accessoClick() {

  document.getElementById("username").style.display = "inline";
  document.getElementById("password").style.display = "inline";
}

document.getElementById("accesso").addEventListener("click", accessoClick);


function changeIMG(event) {
  const vecchiologo = event.currentTarget;
  vecchiologo.src = "https://seeklogo.com/images/T/twitter-logo-2629C04D18-seeklogo.com.png"
  vecchiologo.removeEventListener('click', changeIMG);

  const testo = document.querySelector("h2");
  testo.textContent = "La nuova vita di Twitter";
}

function restoreIMG(event) {
  const vecchiologo = event.currentTarget;
  vecchiologo.src = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS14rpdgXrumRLsmH7Dk-kCF1tBdquLN3GbNuMpfn75AsEggsVz"
  vecchiologo.addEventListener('click', changeIMG);

  const testo = document.querySelector("h2");
  testo.textContent = "";
}

const vecchiologo = document.querySelector('.logo');
vecchiologo.addEventListener('click', changeIMG);
vecchiologo.addEventListener('mouseover', changeIMG);
vecchiologo.addEventListener('mouseout', restoreIMG);


document.getElementById('postForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var title = document.getElementById('title').value;
  var content = document.getElementById('content').value;

  var request = gapi.client.blogger.posts.insert({
      'blogId': 'YOUR_BLOG_ID',
      'resource': {
          'title': title,
          'content': content
      }
  });

  request.execute(function(response) {
      console.log(response);
      document.getElementById('message').style.display = 'block';
      document.getElementById('message').innerText = 'Post created successfully!';
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
  });
});

function init() {
  gapi.client.init({
      'apiKey': 'YOUR_API_KEY',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest'],
  }).then(function() {
      console.log('Client initialized');
  });
}

gapi.load('client', init);




function onJson(json) {
  console.log('JSON ricevuto');
  console.log(json);
  // Svuotiamo la libreria
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  // Leggi il numero di risultati
  const results = json.albums.items;
  let num_results = results.length;
  // Mostriamone al massimo 10
  if(num_results > 10)
    num_results = 10;
  // Processa ciascun risultato
  for(let i=0; i<num_results; i++)
  {
    // Leggi il documento
    const album_data = results[i]
    // Leggiamo info
    const title = album_data.name;
    const selected_image = album_data.images[0].url;
    // Creiamo il div che conterrà immagine e didascalia
    const album = document.createElement('div');
    album.classList.add('album');
    // Creiamo l'immagine
    const img = document.createElement('img');
    img.src = selected_image;
    // Creiamo la didascalia
    const caption = document.createElement('span');
    caption.textContent = title;
    // Aggiungiamo immagine e didascalia al div
    album.appendChild(img);
    album.appendChild(caption);
    // Aggiungiamo il div alla libreria
    library.appendChild(album);
  }
}

function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

function search(event)
{
  // Impedisci il submit del form
  event.preventDefault();
  // Leggi valore del campo di testo
  const album_input = document.querySelector('#album');
  const album_value = encodeURIComponent(album_input.value);
  console.log('Eseguo ricerca: ' + album_value);
  // Esegui la richiesta
  fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse).then(onJson);
}

function onTokenJson(json)
{
  console.log(json)
  // Imposta il token global
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}

// OAuth credentials --- NON SICURO!
const client_id = '';
const client_secret = '';
// Dichiara variabile token
let token;
// All'apertura della pagina, richiediamo il token
fetch("https://accounts.spotify.com/api/token",
  {
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);
// Aggiungi event listener al form
const form = document.querySelector('form');
form.addEventListener('submit', search)
