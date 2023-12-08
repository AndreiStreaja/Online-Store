//creare produs 
const creareProdus = (data) => {
    let containerProdus = document.querySelector('.container-produse');  //incarcare clasa html cu datele prin ${...}
    containerProdus.innerHTML += `                                                
    <div class="fereastra-produse">
        <div class="imagini">
            ${data.draft ? `<span class="tag">Draft</span>` : ''}            
            <img src="${data.images[0] || 'img/no image.png'}" class="product-thumb" alt="">
            <button class="card-action-btn edit-btn" onclick="location.href = '/add-product/${data.id}'"><img src="img/edit.png" alt=""></button>
            <button class="card-action-btn open-btn" onclick="location.href = '/products/${data.id}'"><img src="img/open.png" alt=""></button>
            <button class="card-action-btn delete-popup-btn" onclick="popUpStergere('${data.id}')"><img src="img/delete.png" alt=""></button>
        </div>
        <div class="imagini-produse">
            <h2 class="producator-produs">${data.name}</h2>
            <p class="scurta-descriere-produs">${data.shortDes}</p>
            <span class="price">$${data.pretVanzare}</span> <span class="pret-inital">$${data.pretInital}</span>
        </div>
    </div>
    `;
}

//fereastra delete  
const popUpStergere = (id) => {
    let alertaStergere = document.querySelector('.alerta-stergere');    //asignare clasa html de constanta alertaStergere
    alertaStergere.style.display = 'flex';

    let butonInchiderePopUp = document.querySelector('.buton-inchidere-popup');         //asignare clasa html de constanta butonInchiderePopUp
    butonInchiderePopUp.addEventListener('click', () => alertaStergere.style.display = null);     //event pentru click, se inchide fereastra creata mai sus alertaStergere.style.display = 'flex';

    let butonStergere = document.querySelector('.buton-stergere-def');    //asignare clasa html de constanta butonStergere
    butonStergere.addEventListener('click', () => stergereProdus(id))  //event pentru click, stergere produs
}
//functie pentru stergere produs
const stergereProdus = (id) => {
    fetch('/delete-product', {    //conectarea datelor cu serverul (clasa delete-product din HTML)
        method: 'post',          //specifică faptul că datele vor fi trimise către server prin stocarea lor într-un corp de solicitare HTTP.
        headers: new Headers({'Content-Type': 'application/json'}),   //noul obiect Headers isi mosteneste datele din obiectul Headers existent.
        body: JSON.stringify({id: id})    //convertirea valorii JS intr-un obiect de tip JSON 
    }).then(res => res.json())    //raspuns
    .then(data => {
        if(data == 'success'){   //daca stergerea a avut succes si s-a comunicat corect cu serverul, se reincarca pagina
            location.reload();
        } else{
            afisareEroare('A aparut o eroare in stergerea acestui produs');  //daca conexiunea a esuat apare mesajul din paranteze
        }
    })
}