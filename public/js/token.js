
let char = `123abcde.lqponmfEDCBA@ZYXWVUTSRQPONMLKJF987654zyxwvuts0%$#!&hgrkji'_^?=/-+*${'`'}~{|}`;

//nu putem avea autenticitate doar prin validarea email-lui, trebuie generat un obiect prin care se obtine aceasta autenticitate
//aceasta functie va genera un text care va cuprinde seturi de 2 litere(index), pentru a obtine textul original din sirul string de mai sus
const generareToken = (key) => {
    let token = '';
    for(let i = 0; i < key.length; i++){
        let index = char.indexOf(key[i]) || char.length / 2;   //index ia valoarea fiecarei pozitii a lui i de pe sirul key sau jumatate din lungimea lui char
        let randomIndex = Math.floor(Math.random() * index);  //randomIndex ia o valoare random, definita de cel mai mare nr intreg a lui index
        token += char[randomIndex] + char[index - randomIndex]; //token preia valoarea sirului random + (valoarea dintre index - randomIndex)
    }
    return token;  //intoarce token-ul pentru validare user
}

//comparare user conectat
const comparareToken = (token, key) => { 
    let sir = '';
    for(let i = 0; i < token.length; i=i+2){  
        //prin cei 2 contori, unu care merge pana la capat si altul care merge +1, se va realiza compararea tokenurilor 
        let index0 = char.indexOf(token[i]);    
        let index1 = char.indexOf(token[i+1]);
        sir += char[index0 + index1];   //constanta sir i-a valoarea parcursa de cei 2 contori
    }
    if(sir === key){
        return true;   //daca sirul este egal cu tokenul asociat useru-lui, atunci intoarce true
    }
    return false;
}

 //functia trimitereDate (functie comuna fisierelor js)
const trimitereDate = (path, data) => {
    fetch(path, {                                //conectarea datelor cu serverul 
        method: 'post',                        //specifică faptul că datele vor fi trimise către server prin stocarea lor într-un corp de solicitare HTTP.
        headers: new Headers({'Content-Type': 'application/json'}),       //noul obiect Headers isi mosteneste datele din obiectul Headers existent.
        body: JSON.stringify(data)      //convertirea valorii JS intr-un obiect de tip JSON (data)
    }).then((res) => res.json())
    .then(response => {                //raspuns
        procesareDate(response);      //procesare date
    })
}

const procesareDate = (data) => {
    loader.style.display = null;
    if(data.alert){                  //daca exista erori in prelucrarea datelor afiseaza erorile definite de functia afisareEroare
        if(data.type){
            afisareEroare(data.alert, 'success');  //afisare eroare in caz ca fluxul este corect dar datele introduse de client sunt incorecte
        } else{
            afisareEroare(data.alert);   //nu afiseaza nimic, comunicarea server-client nu exista
        }
    } else if(data.name){        
        //creare token autentificare
        data.authToken = generareToken(data.email);  //se genereaza tokenul pe baza email-ului
        sessionStorage.user = JSON.stringify(data);   ////convertirea valorii JS (user) intr-un obiect de tip JSON 
        location.replace('/');     //elimină pagina curentă din istoricul sesiunii și navighează la adresa URL dată.
        
    } else if(data == true){      //daca datele sunt true afiseaza pagina sellerului
    
        let user = JSON.parse(sessionStorage.user);   //parsarea userlui sub forma de string in obiectul user
        user.seller = true;   
        sessionStorage.user = JSON.stringify(user);   //sesiunea conectarii preia valoarea numelui userlui 
        location.reload();     //refresh pagina
    } else if(data.product){
        location.href = '/seller';  //afisare pagina seller
    }
}

// functiile pentru erori
const afisareEroare = (msg, type='error') => {      
    let casutaEroare = document.querySelector('.fereastra-alerta');   //preluare clasa HTML
    let mesajEroare = document.querySelector('.mesaj-alerta');     //preluare clasa HTML
    let imagineEroare = document.querySelector('.imagine-alerta');   //preluare clasa HTML

    mesajEroare.innerHTML = msg;      

    if(type == 'Success'){                          //daca fluxul de date este corect in totalitate se afiseaza imaginea de mai jos
        imagineEroare.src = `../img/success.png`;   
        mesajEroare.style.color = `#3d85c6 `;   //culoarea mesajului 
    } else{   //inseamna ca este o eroare 
        imagineEroare.src = `img/error.png`;   //afiseaza imaginea
        mesajEroare.style.color = null;
    }

    //functie pentru lag incarcare date, ce depasete 3000 ms, se intrerupe hostul
    casutaEroare.classList.add('show');
    setTimeout(() => {
        casutaEroare.classList.remove('show');
    }, 2000);
    return false;
}