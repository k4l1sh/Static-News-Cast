//https://blog.jim-nielsen.com/2020/a-cors-proxy-with-netlify/

const PROXY = window.location.hostname == '0.0.0.0'?'':'/cors-proxy/';


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
		'background-size': 'cover'
	}
	for (const CSSTEXT in propriedades) {
		document.querySelector('main').style[CSSTEXT] = propriedades[CSSTEXT]
		document.querySelector('main').classList.add('fading');
	}
	setTimeout(() => {
		document.querySelector('main').classList.remove('fading');
	}, 5000);
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
		const ogimage = metaFetch(html, "og:image");
		const imgurl= await isImage(ogimage) ? ogimage : '';
		return new Noticia(headline, url, imgurl, metaFetch(html, "og:site_name"), new Date().getTime());
	}
}

function changeContent(noticia) {
	setBackgroundImage(noticia.imagem)
	document.querySelector('p').innerHTML = noticia.headline;
	document.querySelector('p').innerHTML += `<br/>&nbsp;- <i>${noticia.fonte}</i>`;
}


async function scraperReddit(url) {
	const response = await fetch(PROXY+url);
	const html = new DOMParser().parseFromString(await response.text(), 'text/html');
	let news = html.querySelectorAll(`a[data-event-action="title"]`);
	//news = Array.from(news)
	let newsPromises = [];
	for(noticia of news) {
		if(!noticia.href.includes('alb.reddit.com') && !noticia.href.includes('/user/')) {
			if(!localStorage.noticias || !newsPromises.length) changeContent(await constructNewsObject(noticia.href, noticia.innerHTML));
			newsPromises.push(constructNewsObject(noticia.href, noticia.innerHTML));
		}
	}
	Promise.allSettled(newsPromises).then(allNews => {
		const headlines = allNews.map(promise => promise.value);
		localStorage.noticias = JSON.stringify(headlines);
	});
}

function newsInterval(news) {
	//new Promise(resolve => setTimeout(resolve, 20000));
	setTimeout(() => {
		changeContent(news[Math.floor(Math.random()*(news.length-1))]);
		newsInterval(JSON.parse(localStorage.noticias));
	}, 20000);
}

scraperReddit('https://old.reddit.com/r/worldnews/top/?sort=top&t=day');
newsInterval(JSON.parse(localStorage.noticias));