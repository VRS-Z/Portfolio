(function () {
  "use strict";

  function typeSeq(list, lineIdx, charIdx, onDone) {
    if (lineIdx >= list.length) {
      if (onDone) onDone();
      return;
    }
    var line = list[lineIdx];
    if (charIdx <= line.text.length) {
      var el = document.getElementById(line.id);
      if (el) el.textContent = line.text.slice(0, charIdx);
      var dataTxtEl = line.mirrorId ? document.getElementById(line.mirrorId) : null;
      if (dataTxtEl) dataTxtEl.setAttribute("data-txt", line.text.slice(0, charIdx));
      setTimeout(function () {
        typeSeq(list, lineIdx, charIdx + 1, onDone);
      }, line.speed);
    } else {
      setTimeout(function () {
        typeSeq(list, lineIdx + 1, 0, onDone);
      }, 220);
    }
  }

  function typeInlineLines(container) {
    var els = container.querySelectorAll("[data-type-line]");
    var list = Array.prototype.map.call(els, function (el, i) {
      var id = "type-line-" + Math.random().toString(36).slice(2) + "-" + i;
      el.id = id;
      return { id: id, text: el.getAttribute("data-type-line"), speed: el.getAttribute("data-type-line").indexOf("##") === 0 ? 6 : 30 };
    });
    typeSeq(list, 0, 0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Hero boot / whoami / cat sequence
    var heroLines = [
      { id: "t-ssh", text: "ssh root@otavio-mendes", speed: 32 },
      { id: "t-conn", text: "Conectando...", speed: 32 },
      { id: "t-ok1", text: "[ OK ] handshake concluído", speed: 22 },
      { id: "t-ok2", text: "[ OK ] acesso concedido", speed: 22 },
      { id: "t-whoami-cmd", text: "whoami", speed: 55 },
      { id: "t-whoami-out-text", text: "Olá! eu me chamo Otávio, e sou um Desenvolvedor FullStack.", speed: 28, mirrorId: "t-whoami-out" },
      { id: "t-cat-cmd", text: "cat sobre.txt", speed: 55 },
      { id: "t-cat-out", text: "Por favor, dê uma olhada aqui em baixo e veja tudo o que eu posso fazer por você.", speed: 20 },
    ];
    setTimeout(function () {
      typeSeq(heroLines, 0, 0, function () {
        var btn = document.getElementById("hero-cta");
        if (btn) btn.classList.add("visible");
      });
    }, 500);

    // Reveal-on-scroll: fade each section in once, then type its short command/divider line(s)
    var sections = document.querySelectorAll("main .reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              setTimeout(function () {
                typeInlineLines(entry.target);
              }, 220);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      );
      sections.forEach(function (el) {
        io.observe(el);
      });
    } else {
      // No IntersectionObserver support: just show everything, no animation.
      sections.forEach(function (el) {
        el.classList.add("visible");
        el.querySelectorAll("[data-type-line]").forEach(function (line) {
          line.textContent = line.getAttribute("data-type-line");
        });
      });
    }
  });
})();
