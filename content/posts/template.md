// Template per un nuovo post del blog.
// Copia questo file in content/posts/<slug>.json e compila i campi.
// Il corpo va scritto come array "sections": ogni sezione (H2) diventa un
// blocco "quaderno" collegato. Il testo prima del primo titolo va in una
// sezione con "title": "" (blocco intro, senza nodo).
//
// Compatibilità: se ometti "sections" e usi il vecchio campo "body"
// (markdown unico con heading ##), il sito lo spezza in sezioni in automatico.

{
  "slug": "",
  "publishedAt": "AAAA-MM-GG",
  "updatedAt": "",
  "cover": "/nome-cover.png",
  "youtubeUrl": "",
  "tags": [
    ""
  ],
  "title": {
    "it": "",
    "en": ""
  },
  "description": {
    "it": "",
    "en": ""
  },
  "sections": {
    "it": [
      {
        "id": "intro",
        "title": "",
        "image": "",
        "body": "Paragrafo introduttivo prima del primo titolo."
      },
      {
        "id": "primo-titolo",
        "title": "Primo titolo della sezione",
        "image": "/images/posts/<slug>/sezione-1.jpg",
        "body": "Markdown della sezione: paragrafi, ### sotto-titoli, liste,\n[link](https://...) e callout.\n\n> [!TAKEAWAY]\n> Lezione chiave della sezione.\n\n> [!TIP]\n> Consiglio pratico.\n\n> [!NOTE]\n> Nota di contesto.\n\n> [!WARNING]\n> Avvertenza."
      },
      {
        "id": "secondo-titolo",
        "title": "Secondo titolo della sezione",
        "image": "",
        "body": "Contenuto della seconda sezione."
      }
    ],
    "en": [
      {
        "id": "intro",
        "title": "",
        "image": "",
        "body": "Intro paragraph before the first heading."
      },
      {
        "id": "primo-titolo",
        "title": "First section title",
        "image": "/images/posts/<slug>/sezione-1.jpg",
        "body": "Section markdown: paragraphs, ### sub-headings, lists,\n[links](https://...) and callouts.\n\n> [!TAKEAWAY]\n> Key takeaway of the section."
      },
      {
        "id": "secondo-titolo",
        "title": "Second section title",
        "image": "",
        "body": "Second section content."
      }
    ]
  }
}

// Note:
// - "id": slug stabile della sezione, usato come anchor nella Table of Contents.
// - "image": opzionale. Se vuota o assente non viene renderizzata. Path in /public
//   o URL assoluto; immagine responsive con bordi arrotondati.
// - La TOC laterale compare quando ci sono almeno 3 sezioni con "title".
// - Callout supportati nel body: [!TAKEAWAY] (o [!KEY]), [!NOTE], [!TIP], [!WARNING].
// - "youtubeUrl" opzionale: se presente attiva la CTA "Guarda il video".
