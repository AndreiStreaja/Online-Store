const cheieCautare = decodeURI(location.pathname.split('/').pop());  //decodificare URI (Uniform Resource Identifier)

const casutaPtCautare = document.querySelector('#cuvant-introdus');  //preluare date HTML 
casutaPtCautare.innerHTML = cheieCautare;   //obiectul cautat este afisat in bara de search

obtinereProduse(cheieCautare).then(data => creareFereastraProduse(data, '.container-produse'));   //afisare produse 