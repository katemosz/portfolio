/* ==========================================================================
   PASSWORD-GATE.JS
   Prosta "kurtyna" chroniąca hasłem wybrane case studies — nie z powodu
   NDA (Katarzyna go nie ma w umowie), tylko dlatego, że nie chce swojego
   know-how i metodologii w pełni publicznie dostępnych dla kogokolwiek —
   tylko dla realnych rekruterów/osób oceniających jej kandydaturę.

   ⚠️ WAŻNE — to NIE jest prawdziwe zabezpieczenie:
   - Hasło jest zapisane niżej, w kodzie źródłowym tego pliku. Każdy może
     je odczytać przez "Wyświetl źródło strony" albo DevTools.
   - Cała treść strony i tak jest w całości wysyłana do przeglądarki i
     obecna w HTML — ta kurtyna tylko wizualnie ją zasłania, nie usuwa
     jej z odpowiedzi serwera.
   To rozwiązanie sensownie działa jako "grzeczna kurtyna" — np. dla
   rekrutera, który dostał hasło mailem — a NIE jako ochrona czegoś
   naprawdę poufnego. Do realnej ochrony potrzebny jest serwer/edge auth
   (np. Cloudflare Access) — patrz sekcja o tym w README.md.
   ========================================================================== */

(() => {
  // 👇 ZMIEŃ TO HASŁO na swoje. To samo hasło obowiązuje na wszystkich
  // stronach, które dołączają ten plik.
  const CORRECT_PASSWORD = "whenlifegivesyoulemons";

  const STORAGE_KEY = "portfolio-case-study-unlocked";

  const gate = document.querySelector("[data-password-gate]");
  if (!gate) return; // ta strona nie ma kurtyny — nic do zrobienia

  const form = gate.querySelector("[data-gate-form]");
  const input = gate.querySelector("input[type='password']");
  const error = gate.querySelector("[data-gate-error]");
  const box = gate.querySelector(".password-gate__box");

  function unlock(remember) {
    document.body.classList.remove("is-locked");
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {
        /* prywatne okno / zablokowany localStorage — trudno, po prostu
           trzeba będzie wpisać hasło ponownie przy następnej wizycie */
      }
    }
  }

  // Czy ta przeglądarka już wcześniej podała poprawne hasło?
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      unlock(false);
      return;
    }
  } catch (e) {
    /* localStorage niedostępny — po prostu zawsze pytamy o hasło */
  }

  input?.focus();

  // Show/hide password toggle (the eye icon next to the field).
  const toggle = gate.querySelector("[data-gate-toggle]");
  if (toggle && input) {
    toggle.addEventListener("click", () => {
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(reveal));
      toggle.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
      toggle.classList.toggle("is-on", reveal);
      input.focus();
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value === CORRECT_PASSWORD) {
      unlock(true);
      return;
    }

    error.hidden = false;
    input.value = "";
    input.focus();

    box.classList.remove("is-shaking");
    // wymuszenie reflow, żeby animacja odpaliła się też przy kolejnej
    // pomyłce z rzędu, a nie tylko za pierwszym razem
    void box.offsetWidth;
    box.classList.add("is-shaking");
  });
})();
