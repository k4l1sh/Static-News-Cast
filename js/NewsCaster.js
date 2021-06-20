//https://old.reddit.com/r/worldnews/top/?sort=top&t=day
/*
	if(discord.utils.get(client.get_all_channels(), name=canal_world_news) is not None):
		worldNews = BeautifulSoup(requests.get('https://old.reddit.com/r/worldnews/top/?t=day', headers={'User-Agent': 'Mozilla/5.0'}).text, 'html.parser').findAll('a', {'data-event-action': 'title'})
		for news in worldNews:
			if ('alb.reddit.com' not in news['href']) and ('/user/' not in news['href']):
				await enviar_mensagens_unicas(canal_world_news, news.text+" <"+news['href']+">")
*/
//https://blog.jim-nielsen.com/2020/a-cors-proxy-with-netlify/

const PROXY = window.location.hostname == '0.0.0.0'?'':'/cors-proxy/';

function setBackgroundImg(URL) {	
	document.body.style.cssText = `
		background: url(${URL}) no-repeat center center fixed;
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	`;
}

fetch(PROXY+'https://old.reddit.com/r/worldnews/top/?sort=top&t=day')
.then(response => {if(response.ok) return response.text()})
.then(data => {
	const html = new DOMParser().parseFromString(data, 'text/html');
	let news = html.querySelectorAll(`a[data-event-action="title"]`);
	news = Array.from(news)
	for(noticia of news.slice(0,1)) {
		if(!noticia.href.includes('alb.reddit.com') && !noticia.href.includes('/user/')) {
			console.log(noticia.href);
			document.querySelector('p').innerHTML = noticia.innerHTML
			fetch(PROXY+noticia.href)
			.then(wtf => wtf.text())
			.then(dados => {
				const nova = new DOMParser().parseFromString(dados, 'text/html');
				const ogimage = nova.querySelector('meta[property="og:image"]').content;
				console.log(ogimage);
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