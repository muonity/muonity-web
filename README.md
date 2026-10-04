# MUONITY

Statický responzivní web pro **Muonity — Small games. Big ideas.**
Čisté HTML, CSS a malý vanilla JavaScript. Lokálně uložený font Outfit. Žádný build ani framework. Volitelné Google Analytics 4 se na produkční doméně načítá až po výslovném souhlasu. Před souhlasem ani po odmítnutí se Google tag nenačítá.

## Otevření a lokální spuštění

Pro úplný náhled včetně skutečné cesty `/privacy/` použijte místní HTTP server níže. Samotnou homepage lze otevřít i jako `index.html`, ale kořenové odkazy mezi stránkami vyžadují HTTP. Web je připravený pro kořen vlastní domény `muonity.com`, nikoli bez dalších úprav pro projektový podadresář GitHub Pages.

Pro místní HTTP náhled spusťte ve složce webu (pokud máte Python):

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Otevřete `http://127.0.0.1:4173/`. Server ukončíte pomocí Ctrl+C. Web ke svému běhu Python ani Node.js nepotřebuje.

## Soubory

```text
index.html            obsah, navigace, SEO metadata, JSON-LD a výchozí e-mail
css/styles.css        vzhled, responzivní pravidla a barevné proměnné
css/fonts.css         lokální webfont Outfit (Latin a Latin Extended)
css/consent.css       společný vzhled consent panelu a privacy odkazů
css/privacy.css       čitelný textový layout pouze pro Privacy Policy
privacy/index.html    veřejná Privacy Policy dostupná také bez JavaScriptu
js/config.js          Google Play URL, sociální URL a kontaktní e-mail
js/main.js            přístupné mobilní menu a aktivace platných odkazů
js/analytics.js       GA4, Consent Mode v2, preference a vlastní Retro event
ANALYTICS.md          nastavení, testování a kroky po nasazení
assets/images/        původní PNG, bezztrátové WebP a úsporné responzivní AVIF
assets/icons/         symbol, Apple ikona a oficiální Google Play badge
assets/fonts/         proměnný font Outfit ve WOFF2 + licence SIL OFL
assets/README.md       původ a licence externích podkladů
favicon.ico           favicon odvozený z téhož výřezu
robots.txt
sitemap.xml
.nojekyll              přímé servírování statických souborů na GitHub Pages
```

## Doplnění odkazů

V `js/config.js` změňte:

- `games.retroStackAttack.googlePlayUrl` – již doplněný oficiální odkaz Retro Stack Attack od Muonity.
- `games.baitDash.googlePlayUrl` – skutečná URL Bait Dash, až bude hra publikovaná.
- `socials.facebook`, `instagram`, `youtube`, `x` – již doplněné oficiální profily od Muonity.
- `email` – kontaktní e-mail. Pro shodný obsah i při vypnutém JavaScriptu změňte také text a `mailto:` u `data-contact-email` v `index.html` a kontakty v `privacy/index.html`.

Prázdný řetězec `""` u herní URL znamená nevydanou hru: karta není odkaz, oficiální badge má CSS grayscale, sníženou opacity a text COMING SOON. Po vložení platné oficiální URL se automaticky aktivuje celá karta včetně badge a stav COMING SOON se odstraní. Teaser třetího projektu zůstává neklikací. Pro shodnou funkčnost bez JavaScriptu upravte při změně aktivních odkazů také jejich výchozí podobu v `index.html`.

Odkazy na Google Play se přijímají jen jako HTTPS URL s doménou `play.google.com`, cestou `/store/apps/details` a neprázdným parametrem `id`. Sociální URL musejí být HTTPS. Odkazy se otevírají v nové kartě s `noopener noreferrer` a přístupným popisem.

## Vizuální podklady

- Hlavní předloha: `concept.png`, 1024 × 1536 px.
- Retro Stack Attack a Bait Dash: 1122 × 1402 px.
- Třetí teaser: 1024 × 1536 px.
- Původní PNG jsou zachované beze změny. WebP v plné velikosti mají totožné rozměry a bezztrátově shodné obrazové pixely. Varianty o šířce 560 a 840 px jsou šetrně zmenšené a bezztrátově uložené; `srcset` vybírá vhodnou velikost podle displeje. Prohlížeče bez podpory použijí PNG.
- Prohlížeče s podporou AVIF přednostně načítají nové varianty o šířce 416, 560, 672, 840 px nebo v plné původní velikosti. Jde o exporty původních artworků s vysokou kvalitou 90 a barevným vzorkováním 4:4:4, nikoli bezztrátové kopie. PNG ani WebP nebyly při SEO úpravách změněny. Kompozice, barvy, ořez ani obsah artworků se neupravovaly; výsledky byly vizuálně porovnány.
- Retro artwork může být největším prvkem první obrazovky na telefonu, proto se načítá ihned s vysokou prioritou. Další karty a badge zachovávají nativní lazy loading. Všechny obrázky mají explicitní rozměry, font používá lokální WOFF2, preload a `font-display: swap`.
- Obrázky se zobrazují celé v původním poměru stran. Pod prvními dvěma artworky jsou shodně vysoké tmavé části s oficiálním Google Play badge. Badge je samostatný HTML obrázek; není součástí ani úpravou artworku. Retro je aktivní, Bait Dash je šedý a neaktivní. PNG badge má zachovaný poměr stran a původní transparentní ochranný prostor.
- Symbol je výřez původních pixelů konceptu: oblast `(414, 107)–(606, 299)`. Okolní scéna je odstraněna maskou průhlednosti; kruh a částice nejsou překreslené. Z něj jsou odvozené ikony. Wordmark je skutečný text se stejným symbolem na místě O.
- Pokud později dodáte samostatný oficiální symbol, nahraďte `assets/icons/muonity-symbol.png` a případně rozměry v HTML; pro úplný wordmark stačí nahradit obsah `.wordmark`. Favicon, Apple ikonu a metadata aktualizujte společně.
- Kosmická pozadí jsou CSS aproximace pomocí gradientů, oblouků, světla a bodových hvězd. Terén a textury z rastrového konceptu nejsou samostatné dostupné podklady. Web nepoužívá screenshot stránky jako pozadí, nové AI obrázky ani fotografie.

Barevné tokeny, intenzita glow, šířka obsahu a mezery jsou na začátku `css/styles.css`. Karty přecházejí ze tří na dva sloupce při 820 px a na jeden sloupec při 560 px. Mobilní menu funguje dotykem i klávesnicí, zavírá se Escape, kliknutím mimo a po výběru sekce. Bez JavaScriptu zůstává navigace přístupná. Omezení pohybu respektuje systémové `prefers-reduced-motion`.

Veškerý živý text používá **Outfit**. Jde o vizuálně blízkou geometrickou alternativu k brandsetu, nikoli o identifikaci jeho původního fontu. Hierarchie využívá pouze váhu, velikost a prostrkání. Typografie uvnitř původních artworků a oficiálního Google Play badge se nemění. Font je uložen přímo na webu včetně licence; návštěvník nemusí kontaktovat Google Fonts.

## Nasazení na GitHub Pages

1. Vložte **obsah této složky** do kořene požadovaného GitHub repozitáře. `index.html` musí být v kořeni publikované složky.
2. V repozitáři otevřete **Settings → Pages**.
3. Jako zdroj vyberte **Deploy from a branch**, svou větev (obvykle `main`) a složku **/(root)**. Uložte nastavení.
4. Po dokončení nasazení otevřete URL zobrazenou GitHubem.
5. Pro vlastní doménu nastavte `muonity.com` v **Custom domain**, ověřte vlastnictví a nastavte DNS podle dokumentace GitHubu. HTTPS zapněte, až je dostupné.

Doména je připravena v canonical, Open Graph, X metadatech, JSON-LD, `robots.txt` a `sitemap.xml` jako `https://muonity.com/`. Pokud publikujete pod jinou finální adresou, upravte všechny tyto absolutní URL. Soubor `CNAME` není přiložen; doména se nastavuje v nastavení GitHub Pages. Sociální náhled používá existující symbol; samostatný široký propagační artwork nebyl vytvářen.

GitHub Pages nevyžaduje `package.json`, instalaci závislostí ani sestavení. Web není tímto balíčkem automaticky veřejně publikovaný.

## SEO a indexace

- Title: **Muonity – Indie Games, Apps & Digital Ideas**. Description přirozeně uvádí zaměření studia i obě pojmenované hry.
- Jedna canonical homepage `https://muonity.com/`. `robots.txt` crawlery neblokuje a uvádí sitemap. `sitemap.xml` obsahuje homepage a veřejnou Privacy Policy na `https://muonity.com/privacy/`; kotvy sekcí nejsou samostatné stránky. Datum změny, priorita ani frekvence změn se nevymýšlejí.
- JSON-LD v `index.html`: **Organization** pro Muonity, **WebSite** pro identitu webu a společný typ **VideoGame / MobileApplication** pro Retro Stack Attack. Entity propojují stálé `@id`, publisher a creator. Zahrnut je skutečný e-mail, čtyři sociální profily, logo a přesná URL obchodu.
- JSON-LD neobsahuje cenu, hodnocení, recenze ani počet stažení. Samotná validita Schema.org proto neznamená způsobilost pro Google software-app rich result: Google vyžaduje také ověřenou cenu a hodnocení nebo recenzi. Údaje doplňujte až podle skutečnosti, nikoli kvůli skóre validátoru.
- Existující H1 zůstává vizuálně stejný; jeho přístupný název vysvětluje zaměření studia a odkazuje na viditelný About text. Ten nově přirozeně obsahuje obě hry, Android a zaměření na mobilní hry. Nevznikl skrytý blok klíčových slov ani nové SEO landing pages. Dostupnost obsahu a odkazů nezávisí na JavaScriptu.
- OG a X používají existující orbitální symbol 192 × 192 px. Pro jeho čtvercový poměr je správně `twitter:card="summary"`; `summary_large_image` má smysl až s vhodným širokým existujícím podkladem. Favicon ICO, PNG a Apple touch icon používají stejnou identitu. Manifest se pro tuto jednoduchou neinstalovatelnou stránku nepřidává.
- Při změně e-mailu, herních nebo sociálních odkazů aktualizujte **konfiguraci, výchozí HTML i JSON-LD**. Při vydání Bait Dash změňte i stav Coming soon a About text. Nezávislé kopie SEO údajů jsou záměrně v HTML, aby je mohl přečíst crawler bez JavaScriptu.

### Po nasazení na muonity.com

1. Ověřte HTTPS a veřejnou dostupnost homepage, `/privacy/`, `/robots.txt`, `/sitemap.xml`, ikon a obrázků s HTTP 200. Produkční server/CDN nesmí přidávat `X-Robots-Tag: noindex`, přihlašovací bránu ani blokovat běžné crawlery.
2. Nastavte jednu preferovanou adresu `https://muonity.com/`. Ověřte přesměrování HTTP a případného `www` na tuto adresu; alias `/index.html` může server přesměrovat na `/`, pokud to hosting umožňuje. Canonical je již jednotný. Na GitHub Pages použijte vlastní doménu a HTTPS v nastavení Pages; nevkládejte do webu JavaScriptové přesměrování.
3. Ověřte doménu v [Google Search Console](https://search.google.com/search-console/), odešlete `https://muonity.com/sitemap.xml` a přes kontrolu URL požádejte o indexaci homepage. Volitelně přidejte web do [Bing Webmaster Tools](https://www.bing.com/webmasters/).
4. Zkontrolujte veřejnou URL v [Schema Markup Validator](https://validator.schema.org/) a [Google Rich Results Test](https://search.google.com/test/rich-results). U aplikace počítejte s chybějícími podmínkami rich result uvedenými výše; nevkládejte falešné hodnoty.
5. Spusťte [PageSpeed Insights](https://pagespeed.web.dev/) na produkční URL. Komprese HTTP odpovědí, cache a odezva CDN závisí na hostingu; nelze je nastavit samotným HTML. GitHub Pages spravuje hlavičky cache automaticky. Polní Core Web Vitals budou dostupné až při dostatku reálných návštěv.

SEO měření před přidáním Analytics, lokální Lighthouse 13.5.0: desktop **100 výkon / 100 přístupnost / 100 best practices / 100 SEO**; mobil **90 / 100 / 100 / 100**. Mobilní simulované LCP bylo **3,6 s**, desktopové **0,6 s**, CLS **0**, TBT **0 ms**. Finální kontrola s consent panelem před udělením souhlasu: desktop **100 / 100 / 100 / 100**, mobil **89 / 100 / 100 / 100**, mobilní LCP **3,8 s**, CLS **0**, TBT **0 ms**. Mobilní LCP ještě není pod hranicí 2,5 s; nejde o tvrzení, že web již prošel reálnými Core Web Vitals. Měření na lokálním Python serveru nemá produkční kompresi ani cache a nepředstavuje zatížení externím tagem po souhlasu. Detailní audit a snímky jsou dodané samostatně ve složce `qa`, nikoli jako součást publikovaného webu.

Zdroje: [Google — software app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [site names](https://developers.google.com/search/docs/appearance/site-names), [Schema.org MobileApplication](https://schema.org/MobileApplication).

## Analytics a souhlas

Google Analytics 4 používá stream `G-JF7S6KW832` a basic Consent Mode v2. Všechny čtyři consent parametry jsou před rozhodnutím `denied`; souhlas povolí pouze `analytics_storage`. Ostatní reklamní souhlasy zůstávají zakázané. Měření je vypnuté na localhostu, lokálních souborech a preview doménách; produkční povolené hosty jsou `https://muonity.com` a `https://www.muonity.com`.

Volba se ukládá na 180 dní do `localStorage` pod klíčem `muonity.analytics-consent.v1`. Změnit ji lze přes **Privacy settings** ve footeru homepage i Privacy Policy; obě stránky používají stejný skript a úložiště. Odmítnutí také odstraní dostupné GA cookies tohoto streamu. Při vypnutém JavaScriptu nebo chybě načtení consent skriptu se GA nespustí.

Event `retro_stack_attack_google_play_click` se posílá jednou při skutečném kliknutí na Retro badge, jen s povolenou analytikou. Pro klávesnici se stejně počítá aktivace jeho společného odkazu Enterem. Kliknutí myší na samotný artwork není tento speciální badge event. Bait Dash žádný event ani URL nemá.

Kvůli ochraně dat se před spuštěním GA odstraňují query parametry, které tento statický web nepoužívá, a neznámé kotvy. Platné kotvy zůstávají. Měří se doména referreru, nikoli jeho úplná cesta; UTM kampaně a jiné query údaje se touto konfigurací nepřenášejí. Pokud bude později potřeba UTM atribuce nebo funkční URL parametry, doplňte jejich výslovnou bezpečnou konfiguraci a znovu otestujte Enhanced Measurement.

**Privacy Policy je připravená na `/privacy/`** v samostatném HTML. Odkaz je ve footeru i consent panelu. Její obsah funguje bez JavaScriptu; Privacy settings při vypnutém JavaScriptu není zobrazené a Analytics neběží. Obě stránky sdílejí `js/analytics.js`, pouze měřená canonical adresa odpovídá navštívené stránce. Statický consent panel je záměrně v obou HTML; při změně textu jej udržujte shodný.

**Před zveřejněním ověřte skutečnou GA4 serverovou retenci a kontaktní údaje provozovatele** podle poznámek v [ANALYTICS.md](ANALYTICS.md). Doplněný text není právní garance. Popisuje dodanou implementaci a provozovatele Lukáše Pokorného; žádná společnost, IČO ani poštovní adresa nebyly vymyšlené.

## Skutečné placeholdery

- Google Play URL Bait Dash: zatím prázdná, doplnit až po vydání.
- Produkční doména `https://muonity.com/`: připravená podle zadání; připojení domény a DNS probíhá až při nasazení.

Kontaktní e-mail `dev@muonity.com` je převzatý ze zadání a je funkční `mailto:` odkaz. Copyright je záměrně `© 2026 Muonity`.

Dokumentace nasazení: [zdroj publikování na GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [nastavení vlastní domény](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
