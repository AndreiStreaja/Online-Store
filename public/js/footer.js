//creare subsol 
const creareSubsol = () => {
    let subsol = document.querySelector('footer');
   //asignare obiect de subsol-ul HTML, pentru a fi mai eficient in comunicarea web 
    subsol.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="col">
    <img class="logo" src="../img/logo.png" alt="" style="width:150px;height:150px;">
    <h4>Contact</h4>
    <p><strong>Adresă:</strong> Pierre de Coubertin 1-7, București 024911</p>
    <p><strong>Telefon:</strong> +40 334 233 321 1-7, +40 312 445 121</p>
    <p><strong>Program:</strong> 09:00-20:00, Modnay - Saturday, Sunday Free</p>
    <div class="follow-us">
        <h4>Urmărește-ne</h4>
        <div class="iconItem">
            <i class="fa fa-facebook-f"></i>
            <i class="fa fa-instagram"></i>
            <i class="fa fa-youtube-play"></i>
        </div>
    </div>
</div>

<div class="collum">
    <h4>Despre</h4>
    <a href="aboutUs.html">Despre noi</a>
    <a href="politicy.html">Politica de confidențialitate</a>
    <a href="contactUs.html">Contactează-ne</a>
</div>

<div class="collum">
    <h4>Contul meu</h4>
    <a href="cart.html">View Cart</a>
    <a href="login.html">Sign In</a>
</div>

<div class="collum2">
    <h4>Instalează aplicația</h4>
    <p>Din App Store sau Google Play</p>
    <div class="links">
        <img src="../img/pay/app-store.png" alt="" style="width:80px;height:80px;">
        <img src="../img/pay/play-store.png" alt=""style="width:80px;height:80px;">
    </div>
    <p>Plată securizată<i class="fa fa-lock"></i></p>
    <img src="../img/pay/pay.png" alt="" style="width:300px;height:80px;">
</div>

    `;
}

creareSubsol();