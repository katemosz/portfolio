# Portfolio — Katarzyna Moszczyńska

Statyczna strona portfolio (UX / Product Design). Czysty HTML/CSS/JS —
**bez żadnego build-toola**: otwierasz plik w przeglądarce i widzisz gotową
stronę, z mikro-animacjami (GSAP) włącznie.

## Struktura projektu

```
.
├── index.html                 # Strona główna
├── about.html                 # O mnie
├── contact.html                # Kontakt
├── 404.html                    # Strona błędu (GitHub Pages obsługuje ją automatycznie)
│
├── projects/
│   ├── index.html               # Lista wszystkich projektów
│   ├── project-1.html           # Case study — szablon/wzór do kopiowania, chronione hasłem
│   ├── project-2.html           # Chronione hasłem
│   └── project-3.html           # Chronione hasłem
│
├── assets/
│   ├── css/
│   │   ├── variables.css        # Design tokens: kolory, typografia, odstępy
│   │   ├── base.css             # Reset + style bazowe (h1–h4, p, linki...)
│   │   ├── layout.css           # Header, nav, siatki sekcji, stopka
│   │   ├── components.css       # Przyciski, karty projektów, tagi
│   │   ├── animations.css       # Czyste animacje CSS (dekoracje, marquee, kursor)
│   │   └── password-gate.css    # Wygląd kurtyny hasła (tylko chronione strony)
│   │
│   ├── js/
│   │   ├── main.js              # Menu mobilne, rok w stopce, aktywny link
│   │   ├── animations.js        # Mikro-animacje GSAP (scroll reveal, hero, magnetyczne przyciski)
│   │   └── password-gate.js     # Logika kurtyny hasła — TU zmieniasz hasło
│   │
│   ├── images/
│   │   ├── favicon.svg
│   │   ├── og-image.jpg         # ← DO WGRANIA (podgląd przy udostępnianiu linku)
│   │   └── projects/
│   │       ├── project-1/       # ← wrzuć tu screeny case study 1
│   │       ├── project-2/
│   │       └── project-3/
│   │
│   └── files/
│       └── cv-katarzyna-moszczynska.pdf   # ← DO WGRANIA
│
├── .nojekyll                    # Wyłącza przetwarzanie Jekyll na GitHub Pages
└── .gitignore
```

## Dlaczego tak to jest podzielone

- **Brak duplikacji stylów/logiki** — CSS jest podzielony tematycznie
  (`variables` → `base` → `layout` → `components` → `animations`), więc
  wiadomo, gdzie czegoś szukać. Zmiana koloru akcentu = jedna linijka
  w `variables.css`, widoczna na całej stronie.
- **Header i stopka są powtórzone w każdym pliku HTML** — to świadomy
  kompromis wynikający z rezygnacji z build-toola (Astro/11ty itp.).
  Przy kilku podstronach to mało uciążliwe. Jeśli kiedyś strona urośnie
  i kopiowanie zacznie boleć, to sygnał, żeby przejść na generator
  statycznych stron (np. Astro) — sama struktura treści (case studies,
  sekcje) łatwo się do tego przeniesie.
- **`projects/project-1.html` jest szablonem** — kopiuj go dla każdego
  kolejnego case study i podmieniaj treść. Sekcje (Kontekst → Proces →
  Rozwiązanie → Rezultaty) to standardowy układ case study w portfolio
  UX/Product Designera, ale możesz je dowolnie edytować.
- **Placeholdery obrazków** (`.img-placeholder`) i pliki `README.txt`
  w folderach `assets/images/projects/*` pokazują dokładnie, gdzie
  wgrać jakie screeny — podmień `<div class="img-placeholder">...`
  na zwykły `<img src="ścieżka" alt="opis">`.

## Mikro-animacje

Biblioteka [GSAP](https://gsap.com/) jest wczytywana z CDN (bez instalacji)
w każdym pliku HTML, tuż przed `assets/js/animations.js`. Aktualnie
skonfigurowane efekty:

- płynne wejście elementów Hero przy załadowaniu strony,
- „scroll reveal” — sekcje i karty projektów pojawiają się przy wjeździe
  w widok (`data-reveal`, `data-reveal-group` w HTML),
- magnetyczne przyciski (delikatnie podążają za kursorem),
- niestandardowy kursor na desktopie,
- przewijany pasek narzędzi/umiejętności (marquee),
- animowane, rozmyte plamy w tle Hero.

## Ochrona case studies hasłem

⚠️ **Aktualnie wyłączona na wszystkich trzech case studies (2026-08-27)** —
formularz aplikacyjny (np. Asana) miał tylko pole na link do strony, bez
możliwości osobnego przekazania hasła, więc kurtyna została zdjęta, żeby
case studies były otwarcie dostępne pod linkiem. Nic nie zostało
usunięte z kodu — `<body>` każdej z trzech stron po prostu nie ma już
klasy `is-locked`, a cały mechanizm (markup kurtyny, `password-gate.css`,
`password-gate.js`) czeka nietknięty. **Żeby przywrócić kurtynę:** dodaj
`class="is-locked"` z powrotem do `<body>` w `projects/project-1.html`,
`project-2.html` i `project-3.html`.

Poniższy opis dotyczy tego mechanizmu, gdyby/kiedy wrócić do jego używania:

`projects/project-1.html`, `project-2.html` i `project-3.html` mają
wbudowaną prostą "kurtynę" — gdy aktywna (`<body class="is-locked">`),
wchodząc na taką stronę widać ekran z prośbą o hasło zamiast treści
case study.

**Jedno wspólne hasło dla wszystkich case studies.** Żeby je zmienić,
otwórz [assets/js/password-gate.js](assets/js/password-gate.js) i
zamień wartość `CORRECT_PASSWORD` (domyślnie: `zmien-to-haslo`).

Po wpisaniu poprawnego hasła przeglądarka je zapamiętuje
(`localStorage`), więc ta sama osoba nie musi wpisywać go ponownie przy
kolejnych wizytach ani przy przechodzeniu między case studies.

⚠️ **To nie jest prawdziwe zabezpieczenie**, tylko "grzeczna kurtyna":

- Hasło jest zapisane wprost w pliku JS — każdy może je odczytać przez
  „Wyświetl źródło strony” / DevTools.
- Treść case study i tak jest w całości wysyłana do przeglądarki przy
  wejściu na stronę — kurtyna tylko wizualnie ją zasłania, niczego nie
  usuwa z odpowiedzi serwera.
- Ktoś, kto naprawdę chce ominąć kurtynę (a nie tylko przypadkowy
  odwiedzający), zrobi to w kilka sekund.

Sprawdza się jako lekka bariera dla przypadkowych gości i chowanie
projektu przed wyszukiwarkami — u Katarzyny nie chodzi o NDA (nie ma go
w umowie), tylko o to, żeby know-how i metodologia z case studies nie
były w pełni publiczne dla kogokolwiek, tylko dla realnych rekruterów
oceniających jej kandydaturę — **nie** jako ochrona czegoś naprawdę
poufnego/tajnego.

Jeśli kiedyś będzie Ci potrzebna realna ochrona (prawdziwe
uwierzytelnianie, zanim ktokolwiek dostanie dostęp do plików), GitHub
Pages sam w sobie tego nie zapewni — trzeba postawić coś przed nim,
np. [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
(darmowe, wymaga własnej domeny) albo przenieść stronę na hosting z
wbudowaną ochroną hasłem na poziomie serwera (np. płatny plan Netlify).

**Żeby dodać kurtynę do nowego case study** (skopiowanego z
`project-1.html`) albo ją skądś usunąć — instrukcja jest w komentarzu
`<!-- ============ KURTYNA HASŁA ============ -->` na górze każdego
zablokowanego pliku HTML.

Wszystko respektuje `prefers-reduced-motion` — jeśli ktoś ma wyłączone
animacje systemowo, strona i tak działa normalnie, tylko bez ruchu.
Jeśli JavaScript się nie wczyta, treść też jest w pełni widoczna (progresywne
wzbogacanie — animacje są dodatkiem, nie warunkiem wyświetlenia treści).
Wyjątkiem są strony chronione hasłem (patrz niżej) — tam JavaScript jest
wymagany, żeby w ogóle móc odblokować treść.

Żeby dodać animację do nowego elementu: dodaj mu atrybut `data-reveal`
(a rodzicowi listy `data-reveal-group`, jeśli chcesz efekt "kaskady").

## Jak podejrzeć stronę lokalnie

Po prostu otwórz `index.html` dwuklikiem / w przeglądarce. Wszystkie
ścieżki są względne, więc działa bez żadnego serwera.

## Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHub (np. `portfolio`).
2. W terminalu, w tym folderze:
   ```bash
   git init
   git add .
   git commit -m "Pierwsza wersja portfolio"
   git branch -M main
   git remote add origin https://github.com/TWOJ-LOGIN/portfolio.git
   git push -u origin main
   ```
3. Na GitHubie: **Settings → Pages → Build and deployment → Source:
   „Deploy from a branch”**, branch: `main`, folder: `/(root)`. Zapisz.
4. Po minucie strona będzie dostępna pod
   `https://TWOJ-LOGIN.github.io/portfolio/`.

Brak kroku "build" — bo nie ma czego budować. Każdy `git push` do `main`
automatycznie aktualizuje żywą stronę.

## Do zrobienia przed publikacją (checklist)

- [ ] Podmień treści oznaczone `[w nawiasach kwadratowych]` w `about.html`
      i w plikach `projects/*.html`.
- [ ] Wgraj prawdziwe screeny do `assets/images/projects/project-*/`
      i zamień `.img-placeholder` na `<img>`.
- [ ] Wgraj CV jako `assets/files/cv-katarzyna-moszczynska.pdf`.
- [ ] Podmień linki social (LinkedIn/Behance) w stopce — są w każdym
      pliku HTML.
- [ ] Dodaj `assets/images/og-image.jpg` (1200×630) do ładnych podglądów
      przy udostępnianiu linku.
- [ ] (Opcjonalnie) Podłącz prawdziwe wysyłanie formularza kontaktowego
      przez [Formspree](https://formspree.io) — instrukcja jest w
      komentarzu w `contact.html`.
- [ ] Zmień domyślne hasło do case studies w
      `assets/js/password-gate.js` (`CORRECT_PASSWORD`).
