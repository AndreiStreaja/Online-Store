let user = JSON.parse(sessionStorage.user || null);     //permite salvarea valorilor in browser
let loader = document.querySelector('.loader');


//functie ce verifica daca userul este logat sau nu in momentul adaugarii produselor
window.onload = () => {
    if(user){
        if(!comparareToken(user.authToken, user.email)){
            location.replace('/login');
        }
    } else{
        location.replace('/login');
    }
}

//input-urile pentru pret

const pretInital = document.querySelector('#pret-inital');
const reducere = document.querySelector('#discount');
const pretFinal = document.querySelector('#pret-final');

//event pentru aplicarea reducerii

reducere.addEventListener('input', () => {
    if(reducere.value > 100){
        reducere.value = 90;
    } else{
        let reducere1 = pretInital.value * reducere.value / 100;    
        pretFinal.value = pretInital.value - reducere1;
    }
})

//event pentru stabilirea pretului final (dupa aplicarea discount-ului)

pretFinal.addEventListener('input', () => {
    let reducere = (pretFinal.value / pretInital.value) * 100;
    reducere.value = reducere;
})



let incarcareImagini = document.querySelectorAll('.fileupload');
let caleImagini = []; //constanta care va stoca calea imaginilor

//functie pentru incarcarea imaginilor
incarcareImagini.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let urlImagini;

        if(file.type.includes('image')){
          //aici userul a incarcat imaginea
            fetch('/s3url').then(res => res.json())      //fetch ajuta userul pentru a face conexiunea obiectelor cu reteaua 
            .then(url => {
                fetch(url,{
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'multipart/form-data'}),   //este folosit pentru a indica tipul original al resurselor (inainte de orice codificare)
                    body: file
                }).then(res => {         //raspunsul cu serverul
                    urlImagini = url.split("?")[0];   //fragmentarea adresei URL ex (https:localhost/3000/project/img/img1)
                    caleImagini[index] = urlImagini;   //indexarea fragmentarii
                    let label = document.querySelector(`label[for=${fileupload.id}]`);  //returneaza id-ul fiecarei imaginii
                    label.style.backgroundImage = `url(${urlImagini})`;         //afisarea id-ului pentru imagine
                    let productImage = document.querySelector('.imagini');       //returneaza imaginea ceruta
                    productImage.style.backgroundImage = `url(${urlImagini})`;     //afiseaza imaginea (prin url-ul corespunzator)
                })
            })
        } else{
            afisareEroare('Doar fisiere jpg, png permise');   //in caz ca fisierul ales nu este unul de tip jpg, png, etc, afiseaza mesajul din paranteza
        }
    })
})
 

//trimiterea datelor client-server (request-response)

const numeProdus = document.querySelector('#nume-produs');
const scurtaDescriere = document.querySelector('#scurta-descriere');
const descriere = document.querySelector('#descriere-completa');

let sizes = [];  //salvarea datelor pentru marimi

const stock = document.querySelector('#stoc');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');


//butoanele addProduct si Draft
const butonAdaugaProdus = document.querySelector('#butonAdauga');
const butonDraft = document.querySelector('#butonSalvareDrft');


//functie pentru stocarea marimilor
const memoreazaMarimi = () => {
    sizes = [];  //constanta ce urmeaza a fi populata cu date
    let checkDotSize = document.querySelectorAll('.casuta-marime');   //returneaza toata lista de elemente care se potrivesc cu selectorul specificat (.checkdot-size)
    checkDotSize.forEach(item => { 
        if(item.checked){                                
            sizes.push(item.value);       // pentru fiecare element, daca este selectat, trimite valoarea catre constanta sizes
        }
    })
}

//verificarea si validarea datelor 

const validareDate = () => {
    if(!numeProdus.value.length){
        return afisareEroare('Introduceti numele produsului');
    } else if(scurtaDescriere.value.length > 150 || scurtaDescriere.value.length < 15){
        return afisareEroare('Descrierea pe scurt trebuie sa fie intre 15 si 150 caractere');
    } else if(!descriere.value.length){
        return afisareEroare('Introduceti descrierea completa a produsului');
    } else if(!caleImagini.length){                              //array pentru imagini
        return afisareEroare('Introduceti cel putin o imagine')
    } else if(!sizes.length){                                      // array pentru marimi
        return afisareEroare('Va rugam selectati cel putin o marime');
    } else if(!pretInital.value.length || !reducere.value.length || !pretFinal.value.length){
        return afisareEroare('Adauga pretul');
    } else if(stock.value < 50){
        return afisareEroare('Minim 50 de produse in stoc');
    } else if(!tags.value.length){
        return afisareEroare('Va rugam introduceti taguri pentru o mai buna vanzare');
    } else if(!tac.checked){
        return afisareEroare('Va rugam acceptati termenii si conditiile');
    } 
    return true;          //daca datele indeplinesc toate conditiile de mai sus, atunci intoarce true
}

const dateProdus = () => {
    let tagArr = tags.value.split(',');     //delimitare date prin (,)
    tagArr.forEach((item, i) => tagArr[i] = tagArr[i].trim());    //pentru fiecare input se elimina spatiile goale
    // returnare valori
    return data = {
        name: numeProdus.value,
        shortDes: scurtaDescriere.value,
        descriere: descriere.value,
        images: caleImagini,
        sizes: sizes,
        pretInital: pretInital.value,
        reducere: reducere.value,
        pretVanzare: pretFinal.value,
        stock: stock.value,
        tags: tagArr,
        tac: tac.checked,
        email: user.email
    }
}
//butoane 
//butonul adauga produs
butonAdaugaProdus.addEventListener('click', () => {
    memoreazaMarimi();                 
   //validarea datelor 
    if(validareDate()){ // validareDate  returneaza adevarat sau fals in timp ce prelucreaza validarea  
        loader.style.display = 'block';
        let data = dateProdus();     //incarcarea constantei data cu datele din functia de mai sus
        if(idProdus){
            data.id = idProdus;      
        }
        trimitereDate('/add-product', data);    //trimitere date catre clasa din html pentru afisare
    }
})

//butonul Save Draft
//event pentru click 
butonDraft.addEventListener('click', () => {
    //stocarea marimilor
    memoreazaMarimi();
   //verificarea numelui produsului
    if(!numeProdus.value.length){
        afisareEroare('enter product name');
    } else{  //nu se valideaza datele
        let data = dateProdus();
        data.draft = true;
        if(idProdus){
            data.id = idProdus;
        }
        trimitereDate('/add-product', data);   //trimitere date catre clasa din html pentru afisare
    }
})

   //functie pentru produsul adaugat de utilizator
const setareDate = (data) => {
    numeProdus.value = data.name;
    scurtaDescriere.value = data.shortDes;
    descriere.value = data.descriere;                        //preluare date din ce am introdus anterior despre produs
    pretInital.value = data.pretInital;
    reducere.value = data.reducere;
    pretFinal.value = data.pretVanzare;
    stock.value = data.stock;
    tags.value = data.tags;

    //setarea imaginilor
    caleImagini = data.images;
    caleImagini.forEach((url, i) => {      //functie cu care atribuim fiecarei imagini url-ul corespunzator
        let label = document.querySelector(`label[for=${incarcareImagini[i].id}]`);   //returneaza imaginea pentru fiecare id (url)
        label.style.backgroundImage = `url(${url})`;    //afiseaza id/url
        let productImage = document.querySelector('.imagini');   //returneaza imaginea propriu-zisa
        productImage.style.backgroundImage = `url(${url})`;     //afiseaza imaginea conform url-ului
    })

    //setarea marimilor
    sizes = data.sizes;

    let checkDotSize = document.querySelectorAll('.casuta-marime');    //returneaza toata lista de elemente care se potrivesc cu selectorul specificat (.checkdot-size)
    checkDotSize.forEach(item => {
        if(sizes.includes(item.value)){              //daca valoarea unei sizes este true atunci se seteaza statusul la "Checked"
            item.setAttribute('checked', '');
        }
    })
}


//alipirea datelor pentru server

const obtinereDateProdus = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),   //functie pentru citire date din server si trimiterea lor catre client, in functie de user si id-ul produsului
        body: JSON.stringify({email: user.email, id: idProdus})
    })
    //functie try-catch pentru trimitere date catre client
    .then((res) => res.json())
    .then(data => {                            //raspuns cu datele salvate pe server
        setareDate(data);
    })
    .catch(err => {
        console.log(err);            //in caz de erroare se afiseaza problema in consola
    })
}


let idProdus = null;                 
if(location.pathname != '/add-product'){     //daca locatia pentru date nu exista, atunci va ramane goala, daca insa va fi /add-product atunci va adauga "/", urmat de calea de acces URL, fara a include sirul de interogare
    idProdus = decodeURI(location.pathname.split('/').pop());   

    obtinereDateProdus();   //transmitere request catre server
}