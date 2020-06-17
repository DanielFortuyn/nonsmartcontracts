# the pocket lawyer
Een repository met veelvoorkomende contracten in markdown format waarmee via Git dingen aan toegevoegd kunnen worden. Ik kan mij voorstellen dat bepaalde documenten voor startups handig zijn om te hebben. Vandaar deze repo. 

In de loop der tijd heb ik besloten om hier een tool van te maken. Waarom vraag je je misschien af. In de eerste plaats ben ik helemaal klaar met de tijd die het kost om soms bepaalde artikelen om te nummeren. Dus dat heb ik opgelost. Daarnaast vind ik het een persoonlijke uitdaging om recht, juridische vraagstukken en rechtshandelingen toegankelijker te maken. In mijn ogen is het allemaal niet zo complex en dit is een poging om bij te dragen aan de toegankelijkheid van het recht. 

## Inhoud

### Arbeidsrecht
- Arbeidsovereenkomst voor bepaalde tijd
- Arbeidsovereenkomst voor onbepaalde tijd
- Beeindigings- of vaststellingsovereenkomst

### Overig
- Eenzijdige geheimhoudingsverklaring (Non-disclosure agreement)
- Information securtiy policy
- (persoonlijke) geld lening

## Disclaimer
Ik draag geen verantwoordelijkheid voor het gebruik van deze docs. Ik heb ze zelf samengesteld op basis van uit boeken of uit templates verkregen informatie.


## Gebruik
Een document bestaat uit drie delen

Uitleg
#-!-#
Variabelen
#-!-#
Overeenkomst template

ieder bestand met de .agreement extensie moet op die manier opgebouwd zijn. 

Vooralsnog is het noodzakelijk om html characters te gebruiken. Zoals &euro; <pre>&euro;</pre>

## Installatie

1. Installeer node en yarn
2. Clone deze repositorie in een lege directory
3. run yarn install
4. Pas de variabelen in een bestand, of het contract zelf aan
5. voer script uit met node src/index.js
6. De variabelen worden in het contract gestopt en de complete contracten worden naar de output directory geschreven.

## Variabelen

Voor variabelen gebruiken we camelCase in de taal van de overeenkomst. Ze kunnen gedefinieerd worden in de tweede sectie van de .agreement file. Dit doen we met YAML waarvan de syntax zo eenvoudig is dat zelfs juristen het kunnen snappen. 👼

### Datum / tijd
Om datum en tijd gemakkelijk correct weer te kunnen geven gebruiken we daarvoor de volgende notitie: moment('2020-06-20') of voor het moment van genereren simpelweg moment()

### Partijen
Iedere overeenkomst heeft partijen. Iedere overeenkomst geeft partijen vaak gemakkelijk te hanteren namen zoals hierna: lener / uitlener. Om de contracten leesbaar te houden kunnen we deze alias gebruiken om geneste variabelen aan te roepen. In de variabelen definitie werkt dit als volgt:

Als je bij een partij de hierna optie definieerd worden de variabelen ook aan deze naam gehangen en zijn ze via die naam beschikbaar. 

`
partij1:
  hierna: lener
  naam: jaap


partij1.naam == jaap // true
lener.naam == jaap // true
lener.hierna == lener // true
`

## Enthousiast?
Draag gerust iets bij. Er zijn oneindig veel overeenkomsten dus ik accepteer zonder meer PR's van mensen die een overeenkomst toe willen voegen. 

Daarnaast kan ik mij voorstellen dat je misschien wilt begrijpen hoe dit werkt. Ik gebruik een stack van nodejs, handlebars, yaml en markdown om dit te laten werken. 

## Meer informatie over mij
[https://frtn.nl/](DigitalFortune) hier kun je meer informatie over mij en mijn bedrijf vinden. 