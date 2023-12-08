//redirectionare catre pagina index daca utilizatorul s-a logat 
window.onload = () => {
    if(sessionStorage.user){           
        user = JSON.parse(sessionStorage.user);     //transmitere user 
        if(comparareToken(user.authToken, user.email)){   //verificare user si email
            location.replace('/');   //inlocuire adresa URL cu noua adresa precedata de "/"
        }
    }
}

const loader = document.querySelector('.loader');    //asignare clasa HTML de constanta loader

//campurile pentru logare
const butonTrimitereDate = document.querySelector('.buton-trimitere-date');
const name = document.querySelector('#name') || null;  //ori necompletat
const email = document.querySelector('#email');
const parola = document.querySelector('#parola');
const numarTel = document.querySelector('#numar-tel') || null;
const tac = document.querySelector('#termeni-conditii') || null;
const notificare = document.querySelector('#newslatter') || null;

//event pentru click/logare
butonTrimitereDate.addEventListener('click', () => {
    if(name != null){ // sign up page    //name este taiat cu o linie orizontala deoarece a fost declarat ca constanta, dar poate fi si null
        //verificari date introduse de catre user
        if(name.value.length < 2){
            afisareEroare('Numele trebuie sa fie format din cel putin 2 caractere');
        } else if(!email.value.length){
            afisareEroare('Introduceti email-ul');
        } else if(parola.value.length < 10){
            afisareEroare('Parola trebuie sa fie de cel putin 10 caractere');
        } else if(!numarTel.value.length){
            afisareEroare('Introduceti nr de telefon');
        } else if(!Number(numarTel.value) || numarTel.value.length < 10){
            afisareEroare('Numar de telefon invalid');
        } else if(!tac.checked){
            afisareEroare('Va rugam sa acceptati termenii si conditiile');
        } else{
            // trimitere date 
            loader.style.display = 'block';
            trimitereDate('/signup', {   
                name: name.value,
                email: email.value,
                parola: parola.value,
                numarTel: numarTel.value,
                tac: tac.checked,
                notificare: newslatter.checked,
                seller: false
            })
        }
    } else{
        // pagina de log-in 
        if(!email.value.length || !parola.value.length){
            afisareEroare('Completati toate campurile');                 //verificare date introduse
        } else{
            loader.style.display = 'block';
            trimitereDate('/login', {
                email: email.value,              //daca este TRUE trimite datele catre server
                parola: parola.value,
            })
        }
    }
})
