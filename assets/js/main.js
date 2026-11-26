function getBingImages(imgUrls) {
	var indexName = "bing-image-index";
	var stored = parseInt(sessionStorage.getItem(indexName), 10);
	var index = (isNaN(stored) ? 0 : stored + 1) % imgUrls.length;
	var target = document.querySelector('#panel') || document.body;
	target.style.background = "url('https://www.bing.com" + imgUrls[index] + "') center center no-repeat #666";
	target.style.backgroundSize = "cover";
	sessionStorage.setItem(indexName, index);
}

var btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');
var navigationWrapper = document.querySelector('.navigation-wrapper');

if (btnMobileMenu && navigationWrapper) {
	btnMobileMenu.addEventListener('click', function () {
		navigationWrapper.classList.toggle('visible');
		navigationWrapper.classList.toggle('animated');
		navigationWrapper.classList.toggle('bounceInDown');
		btnMobileMenu.classList.toggle('icon-list');
		btnMobileMenu.classList.toggle('icon-angleup');
	});
}
