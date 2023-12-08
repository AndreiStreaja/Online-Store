//daca userul nu este logat lanseaza automat pagina de login
window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}
//butonul plaseaza comanda
const plaseazaComanda = document.querySelector('.buton-plaseaza-comanda');
plaseazaComanda.addEventListener('click', () => {
    let adresa = obtineAdresa();

    if(adresa){
        fetch('/order', {           //conectarea datelor cu serverul 
            method: 'post',        //specifică faptul că datele vor fi trimise către server prin stocarea lor într-un corp de solicitare HTTP.
            headers: new Headers({'Content-Type': 'application/json'}),    //noul obiect Headers isi mosteneste datele din obiectul Headers existent.
            body: JSON.stringify({           //convertirea valorii JS intr-un obiect de tip JSON 
                order: JSON.parse(localStorage.cart),        //parsarea comenzii din cos
                email: JSON.parse(sessionStorage.user).email,   //parsarea email-ului conectat
                add: adresa,
            })
        }).then(res => res.json())        //raspunsul cu serverul
        .then(data => {      
            if(data.alert == 'Comanda plasata cu succes'){            //daca mesajul este 'Comanda plasata cu succes' atunci se sterg datele din cos
                delete localStorage.cart;
                afisareEroare(data.alert, 'Success');          //aici va stii ce imagine sa afiseze in momentul plasării comenzii (definita in fisierul token.js)
            } else{
                afisareEroare(data.alert);              
            }
        })
    }
})
//functie pentru validare date 

const obtineAdresa = () => {
    let adresa = document.querySelector('#address').value;
    let strada = document.querySelector('#street').value;
    let oras = document.querySelector('#city').value;
    let tara = document.querySelector('#state').value;
    let codPostal = document.querySelector('#pincode').value;
    let numarCard = document.querySelector('#numbercard').value;
    let numeProprietarCard = document.querySelector('#card-holder-name').value;
    let dataExpirare = document.querySelector('#expire-date').value;
    let CVV = document.querySelector('#secretcode').value;


    //se verifica daca toate campurile au fost completate

    if(!adresa.length || !strada.length || !oras.length || !tara.length || !codPostal.length || !numarCard.length || !numeProprietarCard.length || !dataExpirare.length || !CVV.length){
        return afisareEroare('Completează toate câmpurile');    //daca campurile nu sunt completate se afiseaza mesajul din paranteze
    } else{
        return { adresa, strada, oras, tara, codPostal, numarCard, numeProprietarCard, dataExpirare, CVV};  //daca totul e ok, intoarce toate valorile introduse
    }
}