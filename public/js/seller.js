let loader = document.querySelector('.loader');  //preluare date HTML
let user = JSON.parse(sessionStorage.user || null);  //converteste stringul JSON si returneaza obiectul reprezentat de acel JSON, in acest caz USER-UL

const inregistrareVanzator = document.querySelector('.seller-nou');   //preluare clasa HTML 
const listaProduse = document.querySelector('.lista-produse');  //preluare clasa HTML
const aplicareVanzatorNou = document.querySelector('.campuri-de-completat');   //preluare clasa HTML
const butonInregistrare = document.querySelector('#buton-inregistrare');   //preluare clasa HTML

//se lanseaza functia imediat ce obiectul a fost incarcat de pagina web
window.onload = () => {
    if(user){
        if(comparareToken(user.authToken, user.email)){  //comparare token user cu email-ul userului
            if(!user.seller){
                inregistrareVanzator.classList.remove('hide');    //daca userul nu exista in baza de date (nu este logat), sectiunea inregistrareVanzator este afisata 
            } else{
                loader.style.display = 'block';    
                setareProduse();           //daca insa userul este logat si prezent in baza de date, se afiseaza produsele incarcate
            }
        } else{
            location.replace('/login');   //se reincarca pagina in ambele situatii
        }
    } else{
        location.replace('/login');
    }
}

//
butonInregistrare.addEventListener('click', () => {
    inregistrareVanzator.classList.add('hide');
    aplicareVanzatorNou.classList.remove('hide');
})

//campuri pentru completare date seller

const aplicareVanzatorNouButton = document.querySelector('#apply-form-btn');
const numeIntreprindere = document.querySelector('#nume-afacere');
const address = document.querySelector('#adresa-companie');
const about = document.querySelector('#despre-companie');
const numarTel = document.querySelector('#numar-telefon');
const tac = document.querySelector('#termeni-si-conditii');
const dateValabile = document.querySelector('#date-valide');

//event click pentru validare date
aplicareVanzatorNouButton.addEventListener('click', () => {
    if(!numeIntreprindere.value.length || !address.value.length || !about.value.length || !numarTel.value.length){
        afisareEroare('Va rugam completati toate campurile');   //daca valorile din campurile de completat sunt nule atunci afiseaza msesajul "fill all the inputs"
    } else if(!tac.checked || !dateValabile.checked){
        afisareEroare('Va rugam sa acceptati termenii si conditiile');   //daca nu sunt acceptate casutele "termeni si conditii", atunci afiseaza mesajul din paranteze
    } else{
         //construire server request
        loader.style.display = 'block';
        trimitereDate('/seller', {
            name: numeIntreprindere.value,  
            address: address.value,
            about: about.value,
            numarTel: numarTel.value,
            tac: tac.checked,
            legit: dateValabile.checked,
            email: JSON.parse(sessionStorage.user).email  //parsare string user si e-mail la e-mailul asociat sellerului
        })
    }
})

const setareProduse = () => {
    fetch('/get-products', {       //conectarea datelor cu serverul (clasa get-products din HTML)
        method: 'post',           //specifică faptul că datele vor fi trimise către server prin stocarea lor într-un corp de solicitare HTTP.
        headers: new Headers({"Content-Type": "application/json"}),    //noul obiect Headers isi mosteneste datele din obiectul Headers existent. (afisare corp construit)
        body: JSON.stringify({email: user.email})  //convertire valoare JS in obiect de tip JSON, in acest caz email
    })
    .then(res => res.json())       //raspuns
    .then(data =>  {
        loader.style.display = null;
        listaProduse.classList.remove('hide');    //eliminare hide la lista cu produse, astfel se realizeaza afisarea produselor
        if(data == 'no products'){                  //daca nu s-a incarcat niciun produs in sistem
            let lipsaProduse = document.querySelector('.lipsa-produse');    //atunci lipsaProduse ia valoarea clasei din HTML (.no-product-image)
            lipsaProduse.classList.remove('hide');  
        } else{
            data.forEach(product => creareProdus(product));  //altfel se afiseaza casutele cu produsele incarcate de seller
        }
    });
}