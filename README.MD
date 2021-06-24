# Indeed Scraper

## Usage

```shell
$ node main.js [-h] <what> <where>
```
Le script récupère les liens depuis les jobards, et les ajoute dans le fichier "bot-link Json'.
Ensuite, il va récupérer le detail de chaque poste, en allant sur la page dont le lien a été récupérer plusieurs tot.
Il arrive que le bot déclenche un Captcha, mais je sais pas trop comment éviter ça la tout de suite (j'ai pas de proxy sous la main).
## TODO

- Recuperation des info sur les autres pages, avec une limites de X liens a recuperer
- Implementer des tests, c'est pas 100% fiable, notamment a cause du Captcha