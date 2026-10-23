// Textos da paleta de comandos (Ctrl+K / Cmd+K): atalho, busca e grupos de resultados.
import { defineMessages } from "../messages";

export const commandPalette = defineMessages(
  {
    trigger: {
      label: (shortcut: string) => `Abrir busca rápida (${shortcut})`,
    },
    title: "Paleta de comandos",
    description: "Busque uma página, seção ou link do site.",
    inputPlaceholder: "Buscar página, seção ou link...",
    empty: "Nenhum resultado encontrado.",
    groups: {
      navigation: "Navegação",
      pages: "Páginas",
      social: "Redes sociais",
    },
    pages: {
      resume: "Currículo",
    },
  },
  {
    en: {
      trigger: {
        label: (shortcut: string) => `Open quick search (${shortcut})`,
      },
      title: "Command palette",
      description: "Search for a page, section or link on the site.",
      inputPlaceholder: "Search for a page, section or link...",
      empty: "No results found.",
      groups: {
        navigation: "Navigation",
        pages: "Pages",
        social: "Social",
      },
      pages: {
        resume: "Resume",
      },
    },
    es: {
      trigger: {
        label: (shortcut: string) => `Abrir búsqueda rápida (${shortcut})`,
      },
      title: "Paleta de comandos",
      description: "Busca una página, sección o enlace del sitio.",
      inputPlaceholder: "Buscar página, sección o enlace...",
      empty: "No se encontraron resultados.",
      groups: {
        navigation: "Navegación",
        pages: "Páginas",
        social: "Redes sociales",
      },
      pages: {
        resume: "Currículum",
      },
    },
  },
);
