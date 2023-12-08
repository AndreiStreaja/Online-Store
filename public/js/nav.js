const creareBaraNav = () => {
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
        <div class="nav">
            <img src="../img/logo.png" class="logo" alt="">
            <div class="navbar-items">
                <div class="search">
                    <input type="text" class="casuta-cautare" placeholder="Cauta produse, branduri">
                    <button class="buton-cautare">Cauta</button>
                </div>
                <a>
                    <img src="../img/user.png" id="img-utilizator" alt="">
                    <div class="popUp-pt-login-logout hide">
                        <p class="info-cont">Log in as, name</p>
                        <button class="btn" id="buton-utilizator">Log out</button>
                    </div>
                </a>
                <a href="/cart"><img src="../img/cart.png" alt=""></a>
            </div>
        </div>
        <ul class="link-items">
            <li class="link-item"><a href="index.html" class="link">Acasa</a></li>
            <li class="link-item"><a href="women.page.html" class="link">Femei</a></li>
            <li class="link-item"><a href="men.page.html" class="link">Barbati</a></li>
        </ul>
    `;
}

creareBaraNav();

// nav popup
const imagineUser = document.querySelector('#img-utilizator');
const fereastraPopUpUser = document.querySelector('.popUp-pt-login-logout');
const textPopUp = document.querySelector('.info-cont');
const buton_LogIn_LogOut = document.querySelector('#buton-utilizator');

//event pentru click user (ascunde sau arata fereastra)
imagineUser.addEventListener('click', () => {
    fereastraPopUpUser.classList.toggle('hide');
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);  //converteste stringul JSON si returneaza obiectul reprezentat de acel JSON, in acest caz USER-UL
    if(user != null){
      //cand userul e logat 
        textPopUp.innerHTML = `Conectat ca, ${user.name}`;  //fereastra pop-up cu numele userului logat 
        buton_LogIn_LogOut.innerHTML = 'Deconectare';   //fereastra pop-up cu textul "log out"
        //event click, se sterg toate datele sesiunii, daca exista
        buton_LogIn_LogOut.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();  //se reincarca pagina
        })
    } else{
        // cand userul e delogat
        textPopUp.innerHTML = 'Conectati-va pentru a plasa o comanda';  
        buton_LogIn_LogOut.innerHTML = 'log in';
        //event click, se incarca pagina de login
        buton_LogIn_LogOut.addEventListener('click', () => {
            location.href = '/login';
        })
    }
}

// casuta pentru cautare 

const butonCautare = document.querySelector('.buton-cautare');  //buton
const casutaCautare = document.querySelector('.casuta-cautare'); //caseta de cautare

//event click, daca in caseta se completeaza ceva, va afisa pagina de search + valoarea cautata
butonCautare.addEventListener('click', () => {
    if(casutaCautare.value.length){
        location.href = `/search/${casutaCautare.value}`
    }
})