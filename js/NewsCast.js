//https://blog.jim-nielsen.com/2020/a-cors-proxy-with-netlify/

const PROXY = window.location.hostname == '0.0.0.0'?'':'/cors-proxy/';
let noticias = [];
if(localStorage.getItem('noticias') != null) noticias.push(...localStorage.getItem('noticias'));

class Noticia {
	constructor(headline, url, imagem, fonte, fetchTime) {
		[this.headline, this.url, this.imagem, this.fonte, this.fetchTime] = [headline, url, imagem, fonte, fetchTime]; 
	}
}

function setBackgroundImage(URL) {	
	const propriedades = {
		'background': `url(${URL}) no-repeat center center fixed`,
		'-webkit-background-size': 'cover',
		'-moz-background-size': 'cover',
		'-o-background-size': 'cover',
		'background-size': 'cover',
		'-webkit-transition': 'background 2s ease-out',
		'-moz-transition': 'background 2s ease-out',
		'-o-transition': 'background 2s ease-out',
		'transition': 'background 2s ease-out'
	}
	for (const CSSTEXT in propriedades) {
		document.querySelector('main').style[CSSTEXT] = propriedades[CSSTEXT]
	}
}

function metaFetch(html, propriedade) {
	const object = html.querySelector(`meta[property="${propriedade}"]`);
	if(object) return object.content;
	return '';
}

async function isImage(url) {
	const response = await fetch(url);
	if(response.ok) return response.headers.get('Content-Type').includes('image');
	return false;
}

async function constructNewsObject(url, headline) {
	const response = await fetch(PROXY+url);
	if(response.ok) {
		const html = new DOMParser().parseFromString(await response.text(), 'text/html');
		return new Noticia(headline, url, metaFetch(html, "og:image"), metaFetch(html, "og:site_name"), new Date().getTime());
	}
}

async function changeContent(url, headline) {
	const response = await fetch(PROXY+url);
	if(response.ok) {
		const html = new DOMParser().parseFromString(await response.text(), 'text/html');

		const ogimage = metaFetch(html, "og:image");
		isImage(ogimage)
		.then(isImg => {
			if(isImg) setBackgroundImage(ogimage)
		});
		document.querySelector('p').innerHTML = headline;
		document.querySelector('p').innerHTML += `<br/>&nbsp;- <i>${metaFetch(html, "og:site_name")}</i>`;
		return true;
	}
}


function scrapeReddit(url) {
	fetch(PROXY+url)
	.then(response => response.text())
	.then(data => {
		const html = new DOMParser().parseFromString(data, 'text/html');
		let news = html.querySelectorAll(`a[data-event-action="title"]`);
		news = Array.from(news)
		for(noticia of news.slice(5,6)) {
			if(!noticia.href.includes('alb.reddit.com') && !noticia.href.includes('/user/')) {

				changeContent(noticia.href, noticia.innerHTML);
				//constructNewsObject(noticia.href, noticia.innerHTML).then(console.log);
		//		constructNewsObject(noticia.href, noticia.innerHTML)
		//		.then(newsObj => {localStorage.setItem('noticias', JSON.stringynoticias);});
			}
		}
	//}).then(_ => {
		//console.log(noticias)
		//localStorage.setItem('noticias', noticias)
	});
}
/*
				const nova = new DOMParser().parseFromString(dados, 'text/html');

				const ogimage = metaFetch(nova, "og:image");
				isImage(ogimage)
				.then(isImg => {
					if(isImg) setBackgroundImage(ogimage)
				});

				document.querySelector('p').innerHTML += `<br/>&nbsp;- <i>${metaFetch(nova, "og:site_name")}</i>`;
				*/

/*
async function asyncFn() {
  const arr = ['a', 'b', 'c'];
  for (const el of arr) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(el);
  }
}
*/

scrapeReddit('https://old.reddit.com/r/worldnews/top/?sort=top&t=day');