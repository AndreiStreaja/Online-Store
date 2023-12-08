
//creare efect slider
const setareEfectSlider = () => {
    const containerProduse = [...document.querySelectorAll('.container-produse')];
    const butonNext = [...document.querySelectorAll('.nxt-btn')];
    const butonPrev = [...document.querySelectorAll('.pre-btn')];
    
    containerProduse.forEach((item, i) => {
        let containerDimenstions = item.getBoundingClientRect();   //returneaza obiectul in raport cu pozitia si dimensiunea ferestrei
        let containerWidth = containerDimenstions.width;
    
        butonNext[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;           //event pentru click stanga
        })
    
        butonPrev[i].addEventListener('click', () => {       
            item.scrollLeft -= containerWidth;          //event pentru click dreapta
        }) 
    })
}

//preluarea produselor
const obtinereProduse = (tag) => {
    return fetch('/get-products', {         //comunicare cu serverul
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({tag: tag})        //preluarea de face dupa tagul adaugat de client 
    })
    .then(res => res.json())
    .then(data => {
        return data;      //raspuns si returnare date 
    })
}

//creare slider pentru produse
const creareSliderProduse = (data, parent, title) => {
    let containerPtSlider = document.querySelector(`${parent}`);
    //clasa HTML pentru slider

    //crearea ferestrei cu produsul la linia 47
    containerPtSlider.innerHTML += `                              
    <section class="produs">
        <h2 class="categorie-produs">${title}</h2>
        <button class="pre-btn"><img src="../img/arrow.png" alt=""></button>
        <button class="nxt-btn"><img src="../img/arrow.png" alt=""></button>
        ${creareFereastraProduse(data)}                                           
    </section>
    `
    setareEfectSlider();
}

const creareFereastraProduse = (data, parent) => {
   //in aceasta functie parent este pentru cautarea produsului
    let start = '<div class="container-produse">';
    let middle = '';                                // constanta middle va contine ferestrele HTML
    let end = '</div>';

    for(let i = 0; i < data.length; i++){
        if(data[i].id != decodeURI(location.pathname.split('/').pop())){  //contorul i trece prin fiecare produs si daca nu se gasesc 2 produse la fel (ID), se afiseaza individual
            //afisarea produselor
            middle += `
            <div class="fereastra-produse">
                <div class="imagini">
                    <span class="discount-tag">${data[i].reducere}% off</span>
                    <img src="${data[i].images[0]}" class="product-thumb" alt="">
                </div>
                <div class="imagini-produse" onclick="location.href = '/products/${data[i].id}'">
                    <h2 class="producator-produs">${data[i].name}</h2>
                    <p class="scurta-descriere-produs">${data[i].shortDes}</p>
                    <span class="pret">$${data[i].pretVanzare}</span> <span class="pret-inital">$${data[i].pretInital}</span>
                </div>
            </div>
            `
        }
    }
    //afisare intregul slider (intregul div din fisierul HTML)
    if(parent){
        let containerFerestre = document.querySelector(parent);
        containerFerestre.innerHTML = start + middle + end;
    } else{
        return start + middle + end;
    }

}

//adaugare produse in cos sau in sectiunea wishlist
const adaugare_Produse_in_cos_sau_wishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));   ////intoarce valoarea asociata tipului produselor sub forma de JSON
    if(data == null){    //daca datele nu exista atunci arrayul va ramane liber
        data = [];
    }
    //se adauga un singur produs 
    product = {
        item: 1,
        nume: product.name,
        pretVanzare: product.pretVanzare,
        size: size || null,
        descriereScurta: product.shortDes,
        imagine: product.images[0]  
    }

    data.push(product);   //incarcare date despre produs in produsul din cos 
    localStorage.setItem(type, JSON.stringify(data));  //memorare date prin preluare valoare JavaScript si convertirea acesteia intr-un sir de tip JSON (JavaScript Object Notation)
    return 'added';   //returneaza adaugat 
}