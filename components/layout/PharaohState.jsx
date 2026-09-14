"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const copy = {
  en: { loadingKicker: "The journey is being prepared", loadingTitle: "Opening the gates of Egypt", loadingText: "A moment while we arrange your experience.", errorKicker: "A stone moved out of place", errorTitle: "Something interrupted the journey", errorText: "We could not complete this request. Please try again or return to the beginning.", notFoundKicker: "Beyond the map", notFoundTitle: "This page has disappeared into the sands", notFoundText: "The destination you seek is not here, but your next Egyptian story is close.", retry: "Try again", home: "Return home", explore: "Explore journeys" },
  es: { loadingKicker: "El viaje se está preparando", loadingTitle: "Abriendo las puertas de Egipto", loadingText: "Un momento mientras preparamos tu experiencia.", errorKicker: "Una piedra cambió de lugar", errorTitle: "Algo interrumpió el viaje", errorText: "No pudimos completar la solicitud. Inténtalo de nuevo o vuelve al inicio.", notFoundKicker: "Más allá del mapa", notFoundTitle: "Esta página desapareció entre las arenas", notFoundText: "El destino que buscas no está aquí, pero tu próxima historia egipcia está cerca.", retry: "Intentar de nuevo", home: "Volver al inicio", explore: "Explorar viajes" },
  fr: { loadingKicker: "Le voyage se prépare", loadingTitle: "Les portes de l’Égypte s’ouvrent", loadingText: "Un instant pendant que nous préparons votre expérience.", errorKicker: "Une pierre a changé de place", errorTitle: "Quelque chose a interrompu le voyage", errorText: "Nous n’avons pas pu terminer cette demande. Réessayez ou revenez au début.", notFoundKicker: "Au-delà de la carte", notFoundTitle: "Cette page s’est perdue dans les sables", notFoundText: "La destination recherchée n’est pas ici, mais votre prochaine histoire égyptienne est proche.", retry: "Réessayer", home: "Retour à l’accueil", explore: "Explorer les voyages" },
  de: { loadingKicker: "Die Reise wird vorbereitet", loadingTitle: "Die Tore Ägyptens öffnen sich", loadingText: "Einen Moment, während wir Ihr Erlebnis vorbereiten.", errorKicker: "Ein Stein ist verrutscht", errorTitle: "Etwas hat die Reise unterbrochen", errorText: "Die Anfrage konnte nicht abgeschlossen werden. Versuchen Sie es erneut oder kehren Sie zum Anfang zurück.", notFoundKicker: "Jenseits der Karte", notFoundTitle: "Diese Seite ist im Sand verschwunden", notFoundText: "Das gesuchte Ziel ist nicht hier, aber Ihre nächste Ägypten-Geschichte wartet.", retry: "Erneut versuchen", home: "Zur Startseite", explore: "Reisen entdecken" },
  it: { loadingKicker: "Il viaggio si sta preparando", loadingTitle: "Apriamo le porte dell’Egitto", loadingText: "Un momento mentre prepariamo la tua esperienza.", errorKicker: "Una pietra si è spostata", errorTitle: "Qualcosa ha interrotto il viaggio", errorText: "Non è stato possibile completare la richiesta. Riprova o torna all’inizio.", notFoundKicker: "Oltre la mappa", notFoundTitle: "Questa pagina si è persa nella sabbia", notFoundText: "La destinazione che cerchi non è qui, ma la tua prossima storia egiziana è vicina.", retry: "Riprova", home: "Torna alla home", explore: "Esplora i viaggi" },
  zh: { loadingKicker: "旅程正在准备中", loadingTitle: "正在打开埃及之门", loadingText: "请稍候，我们正在为你安排体验。", errorKicker: "一块石头移开了位置", errorTitle: "旅程被暂时打断", errorText: "我们无法完成此请求。请重试，或返回旅程起点。", notFoundKicker: "地图之外", notFoundTitle: "这个页面消失在沙海之中", notFoundText: "你寻找的目的地不在这里，但下一段埃及故事就在附近。", retry: "重试", home: "返回首页", explore: "探索旅程" },
};

const symbols = ["𓂀", "𓋹", "𓆣", "𓇯", "𓏏", "𓊹", "𓅓", "𓉐"];

export default function PharaohState({ kind = "loading", reset }) {
  const pathname = usePathname();
  const locale = pathname?.split("/").filter(Boolean)[0];
  const [active, setActive] = useState(0);
  const text = copy[locale] || copy.en;
  const content = useMemo(() => ({
    loading: { kicker: text.loadingKicker, title: text.loadingTitle, body: text.loadingText },
    error: { kicker: text.errorKicker, title: text.errorTitle, body: text.errorText },
    notFound: { kicker: text.notFoundKicker, title: text.notFoundTitle, body: text.notFoundText },
  }[kind] || {}), [kind, text]);

  useEffect(() => {
    if (kind !== "loading") return undefined;
    const timer = setInterval(() => setActive((value) => (value + 1) % symbols.length), 900);
    return () => clearInterval(timer);
  }, [kind]);

  const homeHref = locale && copy[locale] ? `/${locale}` : "/en";
  const actionLabel = kind === "loading" ? "" : kind === "error" ? text.retry : text.home;

  return (
    <main className={`pharaoh-state pharaoh-state-${kind}`}>
      <div className="pharaoh-state-stars" aria-hidden="true" />
      <div className="pharaoh-state-symbols" aria-hidden="true">
        {symbols.map((symbol, index) => <span key={symbol} className={index === active ? "is-active" : ""}>{symbol}</span>)}
      </div>
      <section className="pharaoh-state-card" role={kind === "error" ? "alert" : undefined}>
        <div className="pharaoh-state-scarab" aria-hidden="true">{kind === "notFound" ? "𓂀" : kind === "error" ? "𓁹" : "𓋹"}</div>
        <div className="pharaoh-state-line"><span /> <b>{kind === "notFound" ? "404" : kind === "error" ? "!" : "𓏏"}</b> <span /></div>
        <p className="pharaoh-state-kicker">{content.kicker}</p>
        <h1>{content.title}</h1>
        <p className="pharaoh-state-copy">{content.body}</p>
        {kind === "loading" ? <div className="pharaoh-state-loader" aria-label={content.body}><span /><span /><span /></div> : <div className="pharaoh-state-actions"><Link href={homeHref} className="pharaoh-state-button">{kind === "error" ? text.home : text.home}</Link>{kind === "error" && reset ? <button type="button" onClick={reset} className="pharaoh-state-button pharaoh-state-button-secondary">{actionLabel}</button> : kind === "notFound" ? <Link href={`${homeHref}/trips`} className="pharaoh-state-button pharaoh-state-button-secondary">{text.explore}</Link> : null}</div>}
        <small className="pharaoh-state-glyphs">𓆓 · 𓇼 · 𓊽 · 𓍿 · 𓎟</small>
      </section>
    </main>
  );
}
