  //importare pachete, intoarcere referinte ale functiilor
  const express = require('express');  
  const admin = require('firebase-admin');
  const bcrypt = require('bcrypt');
  const cale = require('path');
  const emailExpeditor = require('nodemailer');
  
  
  //setare baza de date FireBase cu fisierul json (unic) generat de site-ul FireBase
  let personalDB = require("./licenta-website-firebase-adminsdk-yj3py-2a038c95aa.json");
  
  admin.initializeApp({
    credential: admin.credential.cert(personalDB)  //initializarea autenticitatii user-ului 
  });
  
  let bazaDeDate = admin.firestore();  //asignarea bazei de date de o constanta pentru a gestiona fluxul de date
  
  // configurare servicii Amazon
  const aws = require('aws-sdk'); //aws-sdq este un modul cu care se poate accesa datele incarcate in serviciul Amazon, direct in browser 
  const dotenv = require('dotenv');  //dotenv este un modul cu ajutorul caruia putem incarca variabile dintr-un fisier .env in procesele din server
  
  dotenv.config(); //configurare modul
  
  //parametrii pentru serviciile amazon
  const region = "eu-central-1";
  const nameOfPersonalBucket = "licenta-info";
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;
  
  aws.config.update({
      region, 
      accessKeyId, 
      secretAccessKey
  })
  
  // initialiare constanta s3
  const s3 = new aws.S3();  //construire obiect de tip serviciu pentru gestiunea operatiilor API
  
   //generare link pentru incarcare imagini
  async function generateUrl(){
      let date = new Date();    //asignare constructor Date() de constanta date
      let id = parseInt(Math.random() * 10000);  //convertirea numelor imaginilor intr-un nr de tip intreg random
  
      const numeImagine = `${id}${date.getTime()}.jpg`;  //asignarea numelui random obtinui mai sus 
  
      //asignare parametrii 
      const parametrii = ({
          Bucket: nameOfPersonalBucket,  
          Key: numeImagine,
          Expires: 400,    //daca pagina nu se incarca in 400 ms (milisecunde), sesiunea expira
          ContentType: 'image/jpeg'  //tipul obiectelor
      })
      const incarcareURL = await s3.getSignedUrlPromise('putObject', parametrii); //getSignedUrlPromise intoarce promise-ul posibil care va fi rezolvat cu o adresa URL predefinita pentru operatia data
      return incarcareURL;  //intoarce operatia de mai sus
  }
  
  //declarare cale statica pentru rularea paginilor HTML in regim de HOST
  let calePaginiWeb = cale.join(__dirname, "public");
  
  //initializare express.js
  const aplicatie = express();
  
  //legare aplicatii si interactiunea acestora
  aplicatie.use(express.static(calePaginiWeb));
  aplicatie.use(express.json());
  
  
  
  //initializare pagini HTML pe server
   //calea pentru pagina singup
  aplicatie.get('/signup', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "signup.html"));
  })
  
    //calea pentru pagina index
  aplicatie.get("/", (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "index.html"));
  })
  
  
  aplicatie.post('/signup', (req, res) => {     //functie de tip request-response pentru formalizare date introduse de user
      let { name, email, parola, numarTel, tac, notificare } = req.body;  //initializare constante 
  
      
      if(name.length < 2){
          return res.json({'alert': 'Numele trebuie sa fie mai lung de 2 caractere'});
      } else if(!email.length){
          return res.json({'alert': 'Va rugam introduceti adresa de email'});
      } else if(parola.length < 10){
          return res.json({'alert': 'Parola prea scurta, cel putin 10 caractere permise'});
      } else if(!numarTel.length){
          return res.json({'alert': 'Va rugam introduceti numarul de telefon'});
      } else if(!Number(numarTel) || numarTel.length < 10){            //putem completa doar cu numere datorita lui Number
          return res.json({'alert': 'Numarul introdus nu este valabil'});
      } else if(!tac){
          return res.json({'alert': 'Va rugam acceptati termenii si conditiile'});
      } 
                                                          //.get(citire obiect), in acest caz email-ul
       //memorare user in baza de date                   //.doc(obtinere unei referinte pentru obiectul introdus)
      bazaDeDate.collection('users').doc(email).get()   //.collection (obtinerea unei instante care se refera la colectia data de calea specificata)
      .then(user => {                                   
          if(user.exists){                  
              return res.json({'alert': 'Acest mail deja exista'});  //daca email-ul exista in baza de date introarce obiectul de tip JSON cu mesajul din paranteze
          } else{
            //criptare parola inainte de a o memora
              bcrypt.genSalt(10, (err, salt) => {   //functia genSalt adauga un sir aleatoriu la hash-ul parolei 
                  bcrypt.hash(parola, salt, (err, hash) => {      //hash se refera la preluarea textului introdus de user si trecerea acestuia printr-un algortitm de "incurcare" 
                      req.body.parola = hash;          //un algoritm hash preia text introdus de orice dimensiune și returnează un șir de lungime fixă. Indiferent de dimensiunea șirului/textului, acesta returnează întotdeauna același șir ca lungime.
                      bazaDeDate.collection('users').doc(email).set(req.body)   //scriere user in baza de date si memorarea acestuia
                      .then(data => {
                          res.json({
                              name: req.body.name,    //raspuns cu datele scrise
                              email: req.body.email,
                              seller: req.body.seller,
                          })
                      })
                  })
              })
          }
      })
  })
  
  //calea pentru pagina login
  aplicatie.get('/login', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "login.html"));
  })
  
  aplicatie.post('/login', (req, res) => {
      let { email, parola } = req.body;     //functie pentru gestiune date in pagina de login
  
      if(!email.length || !parola.length){
          return res.json({'alert': 'Va rugam sa completati toate campurile'})   //daca unul din campuri nu este completat, intoarce mesajul alerta din paranteze
      }
  
      bazaDeDate.collection('users').doc(email).get()
      .then(user => {
          if(!user.exists){    //daca email-ul nu exista in baza de date
              return res.json({'alert': 'Email-ul introdus nu este valabil'})   //intoarce textul din paranteze
          } else{
              bcrypt.compare(parola, user.data().parola, (err, result) => {     //functia .compare verifica daca hash-ul stocat se potriveste cu hash-ul parolei introduse de user
                  if(result){
                      let data = user.data();   //asignare date constantei data 
                      return res.json({
                          name: data.name,        //daca userul si parola se potrivesc atunci intoarce datele  
                          email: data.email,
                          seller: data.seller,
                      })
                  } else{
                      return res.json({'alert': 'Parola este incorecta'});   //daca insa parola e gresita, apare mesajul din paranteze
                  }
              })
          }
      })
  })
  
  //calea pentru pagina seller-ului
  
  aplicatie.get('/seller', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "seller.html"));
  })
  
  //functie de tip request-response pentru formalizare date introduse de user
  aplicatie.post('/seller', (req, res) => { 
      let {legit ,address , about, numarTel, email, name, tac } = req.body;     //initializare constante 
      if( numarTel.length < 10|| !about.length || !address.length  || !name.length || !Number(numarTel)){    //verificare operatii
          return res.json({'alert':'Unele campuri sunt incorecte, va rugam verificati din nou'});  //in caz de false afiseaza mesajul
      } else if(!tac || !legit){   //daca if-ul de mai sus intoarce true atunci se executa else if
          return res.json({'alert': 'Va rugam acceptati termenii si conditiile'})  //daca else if intoarce false, se afiseaza mesajul
      } else{   //daca else if-ul intoarce true atunci se executa functia de mai jos
  
          //memorare seller in baza de date
          bazaDeDate.collection('sellers').doc(email).set(req.body)    //scriere seller in baza de date si memorarea acestuia
          .then(data => {
              bazaDeDate.collection('users').doc(email).update({
                  seller: true
              }).then(data => {       //actualizare baza de date 
                  res.json(true);
              })
          })
      }
  })
 

    //calea pentru pagina add-pruduct + id produsului
  aplicatie.get('/add-product/:id', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "addProduct.html"));
  })
   //calea pentru pagina add-product
  aplicatie.get('/add-product', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "addProduct.html"));
  })

    //obtinere link incarcare produs
  aplicatie.get('/s3url', (req, res) => {
      generateUrl().then(url => res.json(url));
  })
  

  // adaugare produse de catre seller
  aplicatie.post('/add-product', (req, res) => {
      let { name, shortDes, descriere, images, sizes, pretInital, reducere, pretVanzare, stock, tags, tac, email, draft, id } = req.body; //initializare constante
  
      // validare date introduse de seller
      if(!draft){     //daca nu se salveaza ca draft, se executa pe rand if-else-urile de mai jos
          if(!name.length){
              return res.json({'alert': 'Introduceti numele produsului'});
          } else if(shortDes.length > 150 || shortDes.length < 15){
              return res.json({'alert': 'Descrierea pe scurt trebuie sa fie intre 15 si 150 caractere'});
          } else if(!descriere.length){
              return res.json({'alert': 'Introduceti descrierea completa a produsului'});
          } else if(!images.length){ //  array imagini
              return res.json({'alert': 'Introduceti cel putin o imagine'})
          } else if(!sizes.length){ // size array
              return res.json({'alert': 'Va rugam selectati cel putin o marime'});
          } else if(!pretInital.length || !reducere.length || !pretVanzare.length){
              return res.json({'alert': 'Adauga pretul'});
          } else if(stock < 50){
              return res.json({'alert': 'Minim 50 de produse in stoc'});
          } else if(!tags.length){
              return res.json({'alert': 'Va rugam introduceti taguri pentru o mai buna vanzare'});
          } else if(!tac){
              return res.json({'alert': 'Va rugam acceptati termenii si conditiile'});
          } 
      }
  
      // adaugare produs
      let numeProdusSV = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 50000)}` : id;  //asignare id produs (nedefinit inital) constantei numeProdusSV
      bazaDeDate.collection('products').doc(numeProdusSV).set(req.body)    //scriere nume produs in baza de date si memorarea acestuia
      .then(data => {
          res.json({'product': name});   //raspuns cu numele produsului
      })
      .catch(err => {
          return res.json({'alert': 'A aparut o eroare, incercati din nou'});    //in caz de eroare, afiseaza alerta
      })
  })
  
  //obtinere produse
  aplicatie.post('/get-products', (req, res) => {
      let { email, id, tag } = req.body;  //definire constante
  
      //afisare produse in functie de tag-ul si email-ul asociate acestuia
      if(id){
          docRef = bazaDeDate.collection('products').doc(id)  
      } else if(tag){
          docRef = bazaDeDate.collection('products').where('tags', 'array-contains', tag)
      } else{
          docRef = bazaDeDate.collection('products').where('email', '==', email)
      }
  
      docRef.get()  //afisare
      .then(products => {
          if(products.empty){
              return res.json('No products');    //daca nu exista produse, afiseaza mesajul
          }
          let produs = [];
          if(id){
              return res.json(products.data());  //intoarce produsele in functie de ID
          } else{
              //daca id-ul nu exista, se asigneaza unul nou
              products.forEach(item => {
                  let data = item.data();  
                  data.id = item.id;
                  produs.push(data);   
              })
              res.json(produs)
          }
      })
  })
  
  //stergere produse
  aplicatie.post('/delete-product', (req, res) => {
      let { id } = req.body;  
      
      bazaDeDate.collection('products').doc(id).delete()  //stergere produs din baza de date
      .then(data => {
          res.json('success');  
      }).catch(err => {
          res.json('error');
      })
  })

  //calea pentru pagina search
  aplicatie.get('/search/:key', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "search.html"));
  })

  //calea pentru pagina checkout
  aplicatie.get('/checkout', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "checkout.html"));
  })

  //calea pentru pagina cart
  aplicatie.get('/cart', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "cart.html"));
  })
  //calea pentru pagina produse
  aplicatie.get('/products/:id', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "product.html"));
  })

  
  
  //confirmare comanda, raspuns pe mail
  aplicatie.post('/order', (req, res) => {
      const { order, email, add } = req.body;
     //functie pentru trimitere mail de confirmare comanda
      let expeditor = emailExpeditor.createTransport({
          service: 'gmail',
          auth: {                             
              user: process.env.EMAIL,         //se utilizeaza email-ul introdus in fisierul .env, acela este expeditorul
              pass: process.env.PASSWORD    
          }
      })
  
      const corpEmail = {
          from: 'streajaandrei@gmail.com',
          to: email,
          subject: 'Comandă plasată',
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Răspuns</title>
          
              <style>
                  body{
                      min-height: 100vh;
                      background: #f7efef;
                      font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                  }
  
                  .heading span{
                      font-weight: 310;
                  }                
                  .heading{
                      text-align: center;
                      font-size: 50px;
                      width: 50%;
                      display: block;
                      line-height: 55px;
                      margin: 35px auto 65px;
                      text-transform: capitalize;
                  }
              </style>
          
          </head>
          <body>
              
              <div>
                  <h1 class="heading">Dragă, ${email.split('@')[0]} <span>comanda ta a fost procesată</span></h1>
              </div>
          
          </body>
          </html>
          `
      }
  
      let numeProdusSV = email + Math.floor(Math.random() * 134453423423693);  //definire nume produs pentru baza de date 
      bazaDeDate.collection('order').doc(numeProdusSV).set(req.body)   //definire categorie din baza de date
      .then(data => {
  
          expeditor.sendMail(corpEmail, (err, info) => {
              if(err){
                  res.json({'alert': 'A aparut o eroare, incercati din nou'})    //daca sunt erori in trimiterea mailu-lui, apare mesajul din paranteze
              } else{
                  res.json({'alert': 'Comanda plasata cu succes', 'type': 'success'});   //daca datele din flux sunt in totalitate true, afiseaza mesajul
              }
          })
  
      })
  })
  
  //calea pentru pagina 404
  
  aplicatie.get('/404', (req, res) => {
      res.sendFile(cale.join(calePaginiWeb, "404.html"));
  })
  
  //daca sunt intampinate erori in incarcarea paginilor, afiseaza pagina 404
  aplicatie.use((req, res) => {
      res.redirect('/404');
  })
  
  //portul pentru host
  aplicatie.listen(3000, () => {
      console.log('listening on port 3000.......');
  })