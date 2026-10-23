"use client";

import { FileText, Github, Instagram, Linkedin, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useSyncExternalStore } from "react";

import { MENU_ITEMS } from "@/components/heard/page";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SOCIAL_LINKS, type SocialName } from "@/lib/content/profile";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import { commandPalette } from "@/lib/i18n/messages/command-palette";
import { common } from "@/lib/i18n/messages/common";

const SOCIAL_ICONS: Record<SocialName, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

const subscribeNoop = () => () => {};

/** O SO só é conhecido no cliente: no servidor assumimos o hint genérico "Ctrl+K". */
function getShortcutLabelSnapshot(): string {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘K" : "Ctrl+K";
}

function getShortcutLabelServerSnapshot(): string {
  return "Ctrl+K";
}

/**
 * Ctrl+K (Cmd+K no Mac) abre a paleta de comandos; o atalho é ignorado enquanto
 * o foco está em um campo de texto. Retorna o texto do atalho para o hint visual.
 */
export function useCommandPaletteShortcut(onOpenChange: (open: boolean) => void): string {
  const shortcutLabel = useSyncExternalStore(
    subscribeNoop,
    getShortcutLabelSnapshot,
    getShortcutLabelServerSnapshot,
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      onOpenChange(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return shortcutLabel;
}

export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const locale = useLocale();
  const t = useMessages(commandPalette);
  const nav = useMessages(common).nav;
  const router = useRouter();

  const goTo = useCallback(
    (path: string) => {
      onOpenChange(false);
      router.push(path);
    },
    [onOpenChange, router],
  );

  const openExternal = useCallback(
    (href: string) => {
      onOpenChange(false);
      window.open(href, "_blank", "noopener,noreferrer");
    },
    [onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title={t.title} description={t.description}>
      <CommandInput placeholder={t.inputPlaceholder} />
      <CommandList>
        <CommandEmpty>{t.empty}</CommandEmpty>
        <CommandGroup heading={t.groups.navigation}>
          {MENU_ITEMS.map(({ key, href, icon: Icon }) => (
            <CommandItem
              key={href}
              value={`nav:${key}`}
              keywords={[nav[key]]}
              onSelect={() => goTo(localePath(locale, href))}
            >
              <Icon aria-hidden="true" />
              <span>{nav[key]}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t.groups.pages}>
          <CommandItem value="page:blog" keywords={[nav.blog]} onSelect={() => goTo(localePath(locale, "/blog"))}>
            <Newspaper aria-hidden="true" />
            <span>{nav.blog}</span>
          </CommandItem>
          <CommandItem
            value="page:resume"
            keywords={[t.pages.resume]}
            onSelect={() => goTo(localePath(locale, "/curriculo"))}
          >
            <FileText aria-hidden="true" />
            <span>{t.pages.resume}</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading={t.groups.social}>
          {SOCIAL_LINKS.map((link) => {
            const Icon = SOCIAL_ICONS[link.name];
            return (
              <CommandItem
                key={link.name}
                value={`social:${link.name}`}
                keywords={[link.name]}
                onSelect={() => openExternal(link.href)}
              >
                <Icon aria-hidden="true" />
                <span>{link.name}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
