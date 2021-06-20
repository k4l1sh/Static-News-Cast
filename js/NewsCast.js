//https://blog.jim-nielsen.com/2020/a-cors-proxy-with-netlify/

const PROXY = window.location.hostname == '0.0.0.0'?'':'/cors-proxy/';

function setBackgroundImg(URL) {	
	const propriedades = {
		'background': `url(${URL}) no-repeat center center fixed`,
		'-webkit-background-size': 'cover',
		'-moz-background-size': 'cover',
		'-o-background-size': 'cover',
		'background-size': 'cover'
	}
	for (const es in propriedades) {
		document.body.style[es] = propriedades[es]
	}
	/*
	document.body.style.cssText = `
		background: url(${URL}) no-repeat center center fixed;
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	`;*/
}

fetch(PROXY+'https://old.reddit.com/r/worldnews/top/?sort=top&t=day')
.then(response => response.text())
.then(data => {
	const html = new DOMParser().parseFromString(data, 'text/html');
	let news = html.querySelectorAll(`a[data-event-action="title"]`);
	news = Array.from(news)
	for(noticia of news.slice(9,10)) {
		if(!noticia.href.includes('alb.reddit.com') && !noticia.href.includes('/user/')) {
			document.querySelector('p').innerHTML = noticia.innerHTML
			fetch(PROXY+noticia.href)
			.then(wtf => wtf.text())
			.then(dados => {
				const nova = new DOMParser().parseFromString(dados, 'text/html');
				const fonte = nova.querySelector('meta[property="og:site_name"]').content;
				const ogimage = nova.querySelector('meta[property="og:image"]').content;
				document.querySelector('p').innerHTML += `<br/>&nbsp;- <i>${fonte}</i>`;
				setBackgroundImg(ogimage)
			});
		}
	}
});

/*
async function asyncFn() {
  const arr = ['a', 'b', 'c'];
  for (const el of arr) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(el);
  }
}
*/