"use strict";

function ibg(){
let ibg=document.querySelectorAll(".ibg"); for (var i = 0; i < ibg.length; i++) { if(ibg[i].querySelector('img')){ ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')'; } }
}
ibg();

// $(document).ready(function() {
//             $('.owl-carousel').owlCarousel({
//             	items: 1,
//             	dotsEach: true,
//             	loop: true,
//             });
//             $('.header__menu__burger').click(function(event) {
//             	$('.header__menu__burger').toggleClass('active');
//             	$('.header__menu__right').toggleClass('active');
//             });
//         });

// $(function(){
//             $('input[placeholder], textarea[placeholder]').placeholder();
//         });
