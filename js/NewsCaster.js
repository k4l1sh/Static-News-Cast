//https://old.reddit.com/r/worldnews/top/?sort=top&t=day
/*
	if(discord.utils.get(client.get_all_channels(), name=canal_world_news) is not None):
		worldNews = BeautifulSoup(requests.get('https://old.reddit.com/r/worldnews/top/?t=day', headers={'User-Agent': 'Mozilla/5.0'}).text, 'html.parser').findAll('a', {'data-event-action': 'title'})
		for news in worldNews:
			if ('alb.reddit.com' not in news['href']) and ('/user/' not in news['href']):
				await enviar_mensagens_unicas(canal_world_news, news.text+" <"+news['href']+">")
*/

fetch('/cors-proxy/https://old.reddit.com/r/worldnews/top/?sort=top&t=day').then(response => response.json()).then(data => {
    console.log(data);
});