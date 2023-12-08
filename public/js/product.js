const imaginiProdus = document.querySelectorAll(".imagini-produs img");  //preluare corp HTML
const sliderImaginiProduse = document.querySelector(".slider-imagini");  //preluare corp HTML

let imagineImplicita = 0;  //imaginea implicita pt slider

imaginiProdus.forEach((item, i) => {  //trecere prin toate imaginile
    item.addEventListener('click', () => {   //adaugare event click pentru fiecare imagine 
        imaginiProdus[imagineImplicita].classList.remove('active');  //eliminarea elementului implicit din array de la imaginea curenta
        item.classList.add('active');  //adaugare clasa activa prin click pe imginea dorita a fi afisata
        sliderImaginiProduse.style.backgroundImage = `url('${item.src}')`;   //setare imagine de background pentru slider
        imagineImplicita = i;  //actualizare slider de imagini, in functie de alegerea dorita
    })
})

//comutare butoane marimi

const butoaneMarimi = document.querySelectorAll('.buton-marime-produs');  //selectare marime
let marimeSelectata = 0;   //marimea curenta selectata
let size;

butoaneMarimi.forEach((item, i) => {    //trecere prin fiecare buton cu marimi
    item.addEventListener('click', () => {   //adaugare event click fiecarui buton
        butoaneMarimi[marimeSelectata].classList.remove('check');   //eliminare alegere dorita de la butonul curent
        item.classList.add('check');  //adaugare "buton selectat", noului buton selectat
        marimeSelectata = i;   //actualizare butoane
        size = item.innerHTML;  //afisare 
    })
})

//setare titlu pt produs
const setareDate = (data) => {
    let titlu = document.querySelector('title');

       //setare imagini
    imaginiProdus.forEach((img, i) => {       //trecere prin fiecare imagine, cu ajutorul contorului i 
        if(data.images[i]){
            img.src = data.images[i];        //afisare imagine in functie de datele din baza de date
        } else{
            img.style.display = 'none';     //daca imaginea nu exista va afisa none
        }
    })
    imaginiProdus[0].click();   //memorare poza aleasa prin click 

    //setare butoane marime
    butoaneMarimi.forEach(item => {     //trecere prin toate obiectele 
        if(!data.sizes.includes(item.innerHTML)){ 
            item.style.display = 'none';        //daca nu se gaseste niciun obiect la nivel HTML, afiseaza textul "none"
        }
    })

    //configurare text
    const name = document.querySelector('.producator-produs');
    const shortDes = document.querySelector('.scurta-descriere-produs');
    const descriere = document.querySelector('.des');

    titlu.innerHTML += name.innerHTML = data.name;   //titlu + product-brand = titlu produs (data din baza de date)
    shortDes.innerHTML = data.shortDes;    //descrierea scurta = descrierea scurta (data din baza de date)
    descriere.innerHTML = data.descriere;  //descrierea = descrierea (data din baza de date)

    //preturi
    const pretVanzare = document.querySelector('.pret-produs');
    const pretInital = document.querySelector('.pret-inital-produs');
    const reducere = document.querySelector('.reducere-produs');

    // $ deserveste ca inlocuitor al document.querySelector

    pretVanzare.innerHTML = `$${data.pretVanzare}`;    //setare pret (inainte de aplicarea reducerii) din datele din baza de date
    pretInital.innerHTML = `$${data.pretInital}`;  //setare pret final (din datele din baza de date)
    reducere.innerHTML = `( ${data.reducere}% reducere )`;   //setare discount 

    //butoane cos si wishlist

    const butonWishList = document.querySelector('.wishlist');
    butonWishList.addEventListener('click', () => {                                     //event click pentru adaugare produse (din baza de date) in wishlist | afisare
        butonWishList.innerHTML = adaugare_Produse_in_cos_sau_wishlist('wishlist', data);    
    })

    const butonCos = document.querySelector('.cos-cumparaturi');  
    butonCos.addEventListener('click', () => {                                      //event click pentru adaugare produse (din baza de date) in cos | afisare
        butonCos.innerHTML = adaugare_Produse_in_cos_sau_wishlist('cart', data);    
    })
}

// conectarea datelor
const obtinereDateProdus = () => {                 
    fetch('/get-products', {                       //conectarea datelor cu serverul (clasa delete-product din HTML)
        method: 'post',                          //specifică faptul că datele vor fi trimise către server prin stocarea lor într-un corp de solicitare HTTP.
        headers: new Headers({ 'Content-Type': 'application/json' }),   //noul obiect Headers isi mosteneste datele din obiectul Headers existent. (afisare corp construit)
        body: JSON.stringify({id: idProdus})     //afisare in bara de search id-ul produsului
    })
    .then(res => res.json())           //raspuns
    .then(data => { 
        setareDate(data);
        //afisare slider cu produsele + slider-ul cu produse similare, in functie de tagul introdus la "urcarea" produsului in sistem
        obtinereProduse(data.tags[1]).then(data => creareSliderProduse(data, '.container-pt-slider-produse', 'similar products'))   
    })  
    .catch(err => {
        location.replace('/404');   //in caz de eroare, afiseaza pagina de error 404
    })
}

let idProdus = null;    
if(location.pathname != '/products'){      //daca locatia pentru date nu exista, atunci va ramane goala, daca insa va fi /products (declarata in fisierul server.js) atunci va adauga "/", urmat de calea de acces URL, fara a include sirul de interogare
    idProdus = decodeURI(location.pathname.split('/').pop());
    obtinereDateProdus();   //transmitere request catre server
}


