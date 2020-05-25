// O usuário poderá filtrar os dados tanto digitando "Enter" quanto clicando no botão correspondente, conforme imagens mais abaixo.
// Montar dois painéis.
// No painel da esquerda, listar os usuários filtrados.
// No painel da direita, calcular e mostrar algumas estatísticas sobre esses usuários, conforme imagens abaixo.

// Filtrem os dados a partir de qualquer posição no nome, ou seja, o nome "Brenda" (caso exista na API) deve ser retornado se o filtro for "a".
// Para filtrar, considere todo o texto em minúsculas. Assim, o filtro "E" trará tanto "Elena" quanto "Helena", caso existam na API.
// Dê um console.log() nos dados do evento de digitação e você descobrirá como "cercar" a tecla "Enter".
// Será necessária uma boa dose de manipulação manual do DOM. Isso pode ser feito tanto com innerHTML + string (recomendo a utilização de template literals) 
// ou com os comandos document.createElement, appendChild etc.
// Se quiserem fazer uma interface semelhante à das imagens, utilizem o Materialize (https://materializecss.com (Links para um site externo.)).

let allUsers = [];
let inputUser = '';
let totalAges = 0;
let avarageAges = 0;

window.addEventListener('load', () => {
    loader = document.querySelectorAll(".loader");

    filteredUsers = document.querySelector('.filtered-users');
    inputUser = document.querySelector("#inputUser");

    totalMale = document.querySelector("#totalMale");
    totalFemale = document.querySelector("#totalFemale");
    totalAges = document.querySelector("#totalAges");
    avarageAges = document.querySelector("#avarageAges");

    numberFormat = Intl.NumberFormat("en-US");

fetchUsers();
});

/** Fetch users data by the given API */
async function fetchUsers(){
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    let json = await res.json();

    var loaderArray = Array.from(loader);

    // Remove all class Loader
    for(i=0; i< loaderArray.length; i++){
        loaderArray[i].classList.remove("loader");
    }

    // Filter properties from the data
    allUsers = json.results.map(user => {
        const { name, picture, dob, gender, email, location } = user;

        return {
            name: name.first + ' ' + name.last,
            picture: picture.large,
            age: dob.age,
            gender: gender,
            email: email,
            country: location.country,
            city: location.city
        };
    });
    renderUsers();
}


function renderUsers(){
    inputSearch();
 
    // Filter users according to input
    const filteredUser = allUsers.filter(user => {
        const normalizedName = user.name.toLowerCase()
        const normalizedInput = inputUser.value.toLowerCase();
        return normalizedName.includes(normalizedInput);
    })

    // Order cards according to users names
    filteredUser.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // Create cards in the HTML
    let usersHTML = `<ul><h3>Users found (${filteredUser.length})</h3>`;
    filteredUser.forEach(user => {
        const { name, picture, age, gender, email, country, city } = user;
        const userHTML = `
        <li>
            <img src="${picture}" alt="${name}"/>
            <div class="card">
                <span>${name}, ${age}, ${gender}</span>
                <span>${email}</span>
                <span>${country}, ${city}</span> 
            </div>
        </li>
        `
        usersHTML += userHTML;

    });
    filteredUsers.innerHTML = usersHTML + "</ul>";
    renderStatistics(filteredUser);
}

/** Input listener */ 
function inputSearch(){
    inputUser.addEventListener("keyup", handleVerifyValue);
    inputUser.focus();
    return inputUser;
}

/** Event parameter and call to render */
function handleVerifyValue(event){
    renderUsers();
}

function renderStatistics(filteredUser){
    const arrayMale = filteredUser.filter(user => user.gender === "male");
    const arrayFemale = filteredUser.filter(user => user.gender === "female");

    totalMale.innerHTML = arrayMale.length;
    totalFemale.innerHTML = arrayFemale.length;

    const agesTotal = filteredUser.reduce((acc, current) => {
        return acc + current.age;
    }, 0);
    totalAges.innerHTML = filteredUser.length !== 0 ? formatNumber(agesTotal) : 0;
    
    const agesAvarage =
        filteredUser.length !== 0 ? formatNumber(agesTotal / filteredUser.length) : 0;
    avarageAges.innerHTML = agesAvarage;
}

/** Format numbers */
function formatNumber(number) {
    return numberFormat.format(number);
  }