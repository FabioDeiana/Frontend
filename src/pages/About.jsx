import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-ocean-700 mb-6">{t("about.title")}</h1>

      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        OpenPlaces nasce dalla convinzione che ogni scelta quotidiana possa fare
        la differenza. Siamo una community di persone che credono nella
        sostenibilità, nell'accessibilità e nella trasparenza — e vogliamo
        rendere più facile trovare attività locali che condividono questi valori.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        Che tu stia cercando un ristorante con opzioni vegane, un negozio
        zero-waste o un alloggio eco-sostenibile, OpenPlaces ti aiuta a scoprirli
        grazie alle recensioni reali della community — niente greenwashing,
        solo esperienze verificate da chi le vive ogni giorno.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed">
        Se gestisci un'attività e vuoi farne parte, registrati e candidala su
        OpenPlaces. Se sei un utente curioso, esplora la mappa e lascia le tue
        recensioni — ogni contributo aiuta la community a crescere.
      </p>
    </div>
  );
}

export default About;