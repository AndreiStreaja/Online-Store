// functie pentru creare ferestre pentru produse
//returneaza formatul html impreuna cu datele din script
const creareFerestreProdus = (data) => {
    return `
    <div class="fereastra-produs">
        <img src="${data.imagine}" class="sm-product-img" alt="">
        <div class="sm-text">
            <p class="sm-name-of-product">${data.nume}</p>
            <p class="sm-des">${data.descriereScurta}</p>
        </div>
        <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
        </div>
        <p class="sm-price" data-price="${data.pretVanzare}">${data.pretVanzare * data.item}</p>
        <button class="sm-delete-btn"><img src="img/close.png" alt=""></button>
    </div>
    `;
}

let totalCos = 0;
// functie pentru actualizare total produse in functie de produsele din cos/numarul acestora
const setareProduse = (name) => {
    const element = document.querySelector(`.${name}`);       //preluare nume produs
    let data = JSON.parse(localStorage.getItem(name));       //intoarce valoarea asociata numelui sub forma de JSON
    if(data == null){                                       //daca nu se afla nimic in cos, nu va afisa nimic
    } else{
        for(let i = 0; i < data.length; i++){
            element.innerHTML += creareFerestreProdus(data[i]);     //daca in cos sunt produse atunci se creeaza ferestrele cu produsele 
            if(name == 'cart'){
                totalCos += Number(data[i].pretVanzare * data[i].item);    //daca numele clasei in care adaugam produsele in cos este "cart" atunci totalul se modifica in functie de produsele adaugate/sterse
            }
            actualizarePret();   //actualizarea totalului
        }
    }

    setareEvents(name);     //afisare date actualizate de fiecare data cand se intervine prin modificari
}

const actualizarePret = () => {
    let totalFinal = document.querySelector('.total-de-plata');     //functie pentru afisarea totatlului si modificarile lui prin innerHTML
    totalFinal.innerHTML = `${totalCos}`;
}

//functie pentru crearea eventurilor pentru actiuni
const setareEvents = (name) => {
    const clickMinus = document.querySelectorAll(`.${name} .decrement`);      //scadere total
    const clickPlus = document.querySelectorAll(`.${name} .increment`);      //marire total
    const nrBucati = document.querySelectorAll(`.${name} .item-count`);         //contorizarea produselor
    const pret = document.querySelectorAll(`.${name} .sm-price`);           //pret produs
    const butonDelete = document.querySelectorAll(`.${name} .sm-delete-btn`); //stergere produs

    let produs = JSON.parse(localStorage.getItem(name));  //parsarea numelor produselor catre constanta 'produs'

    nrBucati.forEach((item, i) => {
        let valoare = Number(pret[i].getAttribute('data-price'));   //preluarea pretului produsului
       //event click pentru scadere produse
        clickMinus[i].addEventListener('click', () => {
            if(item.innerHTML > 1){    //daca buc/produs este mai mare de 1 
                item.innerHTML--;     //afiseaza count-ul
                totalCos -= valoare;   //se modifica totalul
                pret[i].innerHTML = `$${item.innerHTML * valoare}`;  //se afiseaza totalul, in functie de item-urile scazute
                if(name == 'cart'){ actualizarePret() }                //daca numele clasei in care adaugam produsele in cos este "cart" atunci totalul se modifica in functie de produsele adaugate/sterse
                produs[i].item = item.innerHTML;                
                localStorage.setItem(name, JSON.stringify(produs));  //adaugarea numelui la cel deja prezent, sau modificarea lui in lipsa celui nou
            }
        })
        //acelasi lucru ca mai sus doar ca pentru adaugare
        clickPlus[i].addEventListener('click', () => {
            if(item.innerHTML < 15){
                item.innerHTML++;
                totalCos += valoare;
                pret[i].innerHTML = `$${item.innerHTML * valoare}`                
                if(name == 'cart'){ actualizarePret() } 
                produs[i].item = item.innerHTML;
                localStorage.setItem(name, JSON.stringify(produs));
            }
        })
    })
   //event pentru stergere produs din cos       
    butonDelete.forEach((item, i) => {           // forEach apelează funcția callbackfn o dată pentru fiecare element din listă, in acest caz "i", in lisa lui este folosit undefined
        item.addEventListener('click', () => {
            produs = produs.filter((data, index) =>  index != i);   //se creeaza prin .filter o copie a datelor iar acesta se executa doar daca elementele trec de functia implementata
            localStorage.setItem(name, JSON.stringify(produs));      //seteaza valoarea identificata
            location.reload();                                        //eventul delete se realizeaza doar prin refresh de pagina
        })
    })
}

setareProduse('cart');        //afisare date in pagina
setareProduse('wishlist');   //afisare date in pagina