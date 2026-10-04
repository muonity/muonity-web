# Muonity — GA4 a consent

Implementace pro `G-JF7S6KW832`, připravená 4. října 2026. Tento soubor je provozní dokumentace pro správce webu, nikoli veřejná Privacy Policy. Web nebyl nasazen a do administrace GA4 nebylo zasahováno.

## Kde je implementace

- `js/analytics.js`: výchozí consent, správa preference, podmíněné načtení oficiálního `gtag.js`, odvolání souhlasu a vlastní herní event.
- `css/consent.css`: vzhled panelu a nenápadného tlačítka ve footeru. Existující hlavní CSS se neměnilo.
- `index.html` a `privacy/index.html`: společné Analytics a consent CSS, neblokující consent panel a **Privacy settings**. Privacy Policy má vlastní textový styl v `css/privacy.css`. Původní metadata, JSON-LD, nadpisy, odkazy her a obrázky jsou zachované.

Google tag se načítá asynchronně z `https://www.googletagmanager.com/gtag/js?id=G-JF7S6KW832`. Jde o oficiální distribuci gtag.js, nikoli nasazení Google Tag Manager kontejneru. Žádný další tracker ani CMP knihovna nebyly přidány. Google Signals, reklamní personalizace a uživatelem poskytnutá data jsou v kódu potlačené.

## Souhlas a jeho uložení

Basic Consent Mode v2 používá stejné pravidlo ve všech zemích, bez geolokační služby. Lokální fronta dostane před jakýmkoli Google tagem nebo příkazem config/event:

```text
analytics_storage: denied
ad_storage: denied
ad_user_data: denied
ad_personalization: denied
```

**Allow analytics** uloží volbu, změní pouze `analytics_storage` na `granted` a na produkci načte tag. Jeden `config` vyvolá standardní page view; ruční duplicitní page view se neposílá. **Decline** nechá vše denied. Před rozhodnutím ani při uloženém odmítnutí se Google tag nenačítá a nic se neposílá Googlu. Po dřívějším souhlasu je při odmítnutí okamžitě nastaven opt-out `ga-disable-G-JF7S6KW832`, proveden consent update a odstraněny dostupné cookies `_ga` a `_ga_JF7S6KW832`. Již odeslané údaje tím nelze zpětně smazat.

Preference je pouze v `localStorage` pod klíčem `muonity.analytics-consent.v1`: verze záznamu, granted/denied a čas volby. Platí 180 dní a neobsahuje identifikátor návštěvníka. Je oddělená pro každý origin/prohlížeč; odstranění úložiště nebo expirace znovu vyvolá dotaz. Cookie identifikátory GA jsou omezené na 180 dní, bez prodlužování při každém načtení. To není nastavení doby uchování dat na serverech Google.

**Privacy settings** otevře panel znovu. Tlačítka mají stejný styl i rozměry. Křížek nebo Escape panel pouze zavřou a souhlas nemění; bez dosavadní volby měření zůstává zakázané. Dialog není modální, neblokuje stránku a nemá past na focus. Odvolání se promítá i do dalších otevřených záložek stejného originu. Neplatný, prošlý či budoucí záznam neznamená souhlas. Při blokovaném úložišti platí volba jen pro aktuální stránku.

Zdroje implementačních principů: [Consent Mode — basic versus advanced](https://developers.google.com/tag-platform/security/concepts/consent-mode), [nastavení a změny consentu](https://developers.google.com/tag-platform/security/guides/consent), [vypnutí Google Analytics](https://developers.google.com/tag-platform/security/guides/privacy).

## Co se měří

Po souhlasu se využívají standardní GA4 a zapnuté Enhanced Measurement: page views, relace, zařízení, návštěvy podle zdroje/referreru, scroll a outbound clicks. Engagement je součástí běžného GA4 měření. Scroll se standardně zaznamená při dosažení 90 % stránky. Zapnutí jednotlivých automatických funkcí se spravuje v účtu, ne duplikovanými ručními listenery na webu. [Enhanced Measurement](https://support.google.com/analytics/answer/9216061?hl=en).

Vlastní event je přesně:

```text
retro_stack_attack_google_play_click
game: retro_stack_attack
destination: google_play
```

Jediný delegovaný handler ověřuje skutečnou uživatelskou akci, platný souhlas, aktivní odkaz a přesné Google Play app ID. U myši/dotyku vyžaduje zásah do badge. Enter na jeho společném odkazu je přístupná alternativa; prostřední tlačítko myši je také podporované. Nezastavuje navigaci ani nečeká na odpověď Analytics. Jedno kliknutí vyvolá jeden vlastní event; další úmyslné kliknutí je další událost. Obecný outbound `click` z Enhanced Measurement může přijít vedle něj.

Tabulka `gameEvents` má nyní jedinou položku. Po skutečném vydání další hry lze doplnit její název eventu, app ID a pevný parametr game. Bait Dash není registrovaný a jeho neaktivní badge se nemění. Třetí teaser zůstává neklikací.

Do vlastního eventu nevstupuje žádný obsah formulářů, jméno, e-mail, User-ID ani text návštěvníka. `user_data` je prázdné a reklamní souhlasy denied. Vhodné je ponechat zapnuté také redakční funkce GA4 účtu.

**URL a atribuce:** vlastní statický web nemá query funkce. Před načtením Google tagu se pomocí replaceState odstraní query a neznámý hash; obsah stránky ani canonical se nemění a platné kotvy se zachovávají. Tím se zabrání tomu, aby automatické site-search měření poslalo například obsah náhodného parametru `q`. Stejná ochrana se použije při návratu do starších položek historie. `page_location` je canonical právě navštívené stránky (homepage nebo `/privacy/`) a `page_referrer` pouze origin předchozího webu. Zdroj podle referrer domény je dostupný, **UTM/campaign parametry se nepřenášejí**. Budoucí kampaně vyžadují záměrné doplnění bezpečných parametrů; osobní údaje do UTM nevkládejte.

## Ověření po nasazení

1. Otevřete `https://muonity.com/` v čistém profilu prohlížeče. Před volbou nesmí Network ukazovat načtení gtag.js ani analytické collect požadavky. V panelu zvolte Decline a obnovte stránku: panel má zůstat zavřený a měření vypnuté.
2. Přes Privacy settings zvolte Allow analytics. Ověřte načtení jediného tagu pro `G-JF7S6KW832` a požadavky GA4 pro tento stream. Consent musí mít analytics granted a všechny tři reklamní typy denied. Běžný návštěvník nesmí mít trvale zapnuté debug_mode.
3. Klikněte jednou na Retro badge. V GA4 otevřete **Reports → Realtime** a vyhledejte `retro_stack_attack_google_play_click`. Pro podrobnosti použijte **Admin → DebugView** se zapnutým debug režimem na vlastním zařízení, například přes [Google Tag Assistant](https://tagassistant.google.com/). [Google — DebugView](https://support.google.com/analytics/answer/7201382?hl=en).
4. Po přijetí události ji můžete v **Admin → Data display → Events** označit jako **key event**. Nevytvářejte další pravidlo generující tutéž událost z obecného click, jinak byste ji zdvojili. Počet návštěvníků sledujte metrikou Total users u události; Event count udává počet kliknutí. Volitelné parametry game/destination lze pro běžné reporty registrovat jako event-scoped custom dimensions. [Google — key events](https://support.google.com/analytics/answer/13128484?hl=en), [custom events](https://support.google.com/analytics/answer/12229021?hl=en).
5. Změňte Allow na Decline. Ověřte denied, odstranění GA cookies a žádné další měření, také po obnovení stránky. Bait Dash musí být stále neklikací a bez vlastní události.
6. Ověřte nastavení streamu a účtu: Enhanced Measurement ponechte zapnuté; Google Signals a User-provided data collection/automatické rozpoznávání údajů vypněte také v administraci. Stažená veřejná konfigurace tagu obsahovala možnosti automatického sběru uživatelských údajů; kód je potlačuje, ale nenahrazuje kontrolu účtu. Na webu není vyhledávání, takže jeho samostatnou volbu lze vypnout. Zkontrolujte email data redaction, skutečnou dobu uchování dat, datové filtry a případná propojení reklamních produktů. Žádné nastavení účtu nebylo automaticky změněné. [Google — user-provided data](https://support.google.com/analytics/answer/14077171?hl=en).
7. Ověřte výkon a konzoli na produkci před souhlasem i po něm, včetně mobilního Safari a Chrome. Adblockery a síťové restrikce mohou měření blokovat i při platném souhlasu; nesmí tím přestat fungovat web nebo store odkaz.

Na localhostu, file:// a preview doménách se živá GA4 vůbec nespouští. Produkční allowlist je pouze HTTPS `muonity.com` a `www.muonity.com`. Díky tomu běžné místní prohlížení neposílá testovací návštěvy do statistik. Automatické testy simulovaly produkční origin lokálním směrováním a zachytily všechny collect požadavky, takže ani ty nebyly odeslány do Google Analytics.

Pokud vám čištění URL odstraní pomocný query parametr Tag Assistantu, lze po udělení souhlasu na vlastním zařízení zapnout DebugView dočasně v konzoli příkazem `gtag('set', 'debug_mode', true)` a potom kliknout na badge. Po kontrole stránku znovu načtěte bez debug nástroje. Ladicí režim není v produkčním kódu trvale zapnutý.

## Privacy Policy

Veřejná anglická stránka je připravená v `privacy/index.html` pro **https://muonity.com/privacy/**. Jde o skutečné HTML čitelné i bez JavaScriptu. Homepage na ni odkazuje z footeru a consent panelu. **Privacy Policy** je navigační odkaz, **Privacy settings** samostatné tlačítko pro stávající consent. Obě stránky používají jeden `js/analytics.js`, stejné localStorage a stejnou platnost preference; nevznikl druhý systém souhlasu.

Text pravdivě uvádí provozovatele **Lukáš Pokorný**, projekt Muonity a **dev@muonity.com**. Popisuje dobrovolnou analytiku, účely, údaje, odvolání, dostupné GA cookies, lokální preference, práva a přenosy. Obsahuje pouze oficiální odkazy Googlu k jeho službám. Nevymýšlí společnost, právní formu, IČO ani adresu.

Před zveřejněním zbývá ověřit:

1. **Serverová retence GA4:** z repozitáře není známá. V GA4 Admin otevřete Data retention a ověřte nastavenou hodnotu i Reset user data on new activity. Poté zpřesněte sekci Data retention. Hodnota 180 dní v kódu je platnost lokální preference / cookie konfigurace, ne serverová retence. Nastavení navíc neřídí standardní agregované reporty. [Google — Data retention](https://support.google.com/analytics/answer/7667196?hl=en).
2. **Další identifikace / kontaktní adresa:** uvedené jméno a e-mail jsou dodané údaje. Pokyny WP29 k článkům 13–14 požadují snadnou identifikaci a kontaktování správce a preferují více komunikačních cest; poštovní adresu uvádějí jako příklad, nikoli bezvýjimečnou povinnost každého projektu. Z dostupných údajů proto nelze označit IČO, telefon nebo domácí adresu za automaticky povinné. Ověřte, zda váš skutečný způsob provozu, případné podnikání a místní předpisy vyžadují zveřejnění dalšího údaje, například doručovací adresy. Pokud ano, dodejte jej pro doplnění do Who we are. [Oficiální pokyny k transparentnosti, příloha na s. 35](https://ec.europa.eu/newsroom/article29/items/622227).
3. **Smluvní a produkční nastavení:** potvrďte použitelné podmínky zpracování Googlu, nastavení sdílení údajů a přenosů pro váš účet a skutečné chování produkčního hostingu. Obecný odkaz v policy nevytváří ani neověřuje smlouvu za provozovatele. K nastavení soukromého účtu nebyl přístup.

Dokument není právní garance ani prohlášení o úplném souladu s GDPR. Neznámé skutečnosti mají být ověřené před publikací, nikoli nahrazené odhadnutými čísly či identifikačními údaji.

## Rozsah provedených kontrol

Lokálně prošly první návštěva, Allow/Decline, opětovné načtení, Privacy settings, odvolání mezi záložkami, odvolání během pomalého načítání tagu, opětovný souhlas, neplatné či prošlé úložiště a blokované localStorage. Se skutečnou knihovnou Googlu byly zachyceny page_view, scroll, outbound click a právě jeden vlastní Retro event. Po odmítnutí nenásledoval žádný další collect a GA cookies zmizely. Testovací osobní údaje v nepoužívaných URL parametrech se nepřenesly.

Responzivita byla zkontrolována v šířkách 1920, 1440, 768, 390, 360 a 320 px. Tlačítka mají stejnou velikost, aktivní focus a dostatečnou dotykovou plochu. Základní SEO kontroly zůstaly v pořádku a 34 původních obrazových/fontových/ikonových souborů se shoduje s předchozím balíčkem. Výsledky a screenshoty jsou v samostatné složce `qa/analytics`, která není součástí produkčního ZIP.

Lighthouse 13.5.0 na lokálním webu s prvním consent panelem: desktop **100 výkon / 100 přístupnost / 100 best practices / 100 SEO**, mobil **89 / 100 / 100 / 100**. Desktopové LCP 0,6 s, mobilní 3,8 s, CLS 0 a TBT 0 ms. Předchozí mobilní SEO měření bez panelu mělo výkon 90 a LCP 3,6 s. Jde o laboratorní měření před souhlasem; výkon s externím Google tagem po souhlasu je třeba přeměřit na produkci.

Skutečné přijetí a zpracování událostí účtem GA4, finální konfiguraci streamu a právní informace je nutné ověřit po nasazení. Samotné lokální testy tyto kontroly nenahrazují.

## Ověření samostatné Privacy Policy

Testy prošly při přímé návštěvě `/privacy/`, bez JavaScriptu, při přechodech z homepage a zpět a při změnách souhlasu na obou stránkách i mezi otevřenými záložkami. Odmítnutí nenačítá Google tag; povolení používá tentýž stream a správnou adresu navštívené stránky. Retro event zůstal bez změny a po jednom kliknutí se odeslal jednou. Bait Dash zůstává neaktivní. Síťové požadavky skutečné knihovny Googlu byly zachyceny lokálně, takže nezasáhly produkční statistiky.

Zkontrolované rozměry: 1920×1080, 1440×900, 768×1024, 390×844, 360×800 a 320×568. Součástí kontroly jsou klávesnice, focus, konzole, místní odkazy, metadata obou stránek, sitemap a robots. Homepage nad footerem, metadata, JSON-LD, herní obrázky, původní hlavní CSS a navigační skript se nezměnily. Sitemap nově obsahuje obě veřejné stránky, robots zůstal beze změny. Doklady jsou v samostatné složce `qa/privacy` mimo publikovaný balíček.

Po nasazení ověřte HTTP 200 na `/privacy/`, načtení souborů, přechody v mobilním Safari/Chrome, odmítnutí bez síťových volání a skutečný příjem správných URL page_view i Retro eventu v GA4 Realtime/DebugView. Produkční DNS, HTTPS, účetní konfigurace a ingestování GA4 nejsou lokálním testem potvrzené.
