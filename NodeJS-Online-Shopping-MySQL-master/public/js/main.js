const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
 backdrop.style.display = 'none';
 sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
 backdrop.style.display = 'block';
 sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

document.getElementById("srchbox").addEventListener("keyup",(e)=>{
    let srchtext = document.getElementById("srchbox").value;
   // srchtext =srchtext.toLower();
    if (e.keyCode === 13) {
        window.location.href =`http://localhost:5000/searchresults/${srchtext}`;
    }
});

document.getElementById("srchbtn").addEventListener("click",(e)=>{
    let srchtext = document.getElementById("srchbox").value;
    // srchtext =srchtext.toLower();
    window.location.href =`http://localhost:5000/searchresults/${srchtext}`;
});
