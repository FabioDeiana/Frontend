import { useTranslation } from "react-i18next";

function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-6">{t("cookie.title")}</h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        GreenMap utilizza cookie tecnici essenziali per il funzionamento del
        sito. Non utilizziamo cookie di profilazione o di tracciamento per fini
        pubblicitari.
      </p>

      <h2 className="text-xl font-semibold mb-3">Cookie tecnici</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Utilizziamo un cookie httpOnly per la gestione della sessione utente
        (refresh token). Questo cookie non è accessibile da JavaScript ed è
        necessario per mantenere l'autenticazione attiva in modo sicuro. Viene
        eliminato automaticamente al logout o dopo 7 giorni.
      </p>

      <h2 className="text-xl font-semibold mb-3">Cookie di terze parti</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Le mappe sono fornite da OpenStreetMap tramite Leaflet. OpenStreetMap
        potrebbe impostare cookie propri — consulta la loro privacy policy per
        maggiori informazioni.
      </p>

      <h2 className="text-xl font-semibold mb-3">Gestione dei cookie</h2>
      <p className="text-gray-700 leading-relaxed">
        Puoi disabilitare i cookie dal tuo browser, ma alcune funzionalità del
        sito (come il mantenimento della sessione) potrebbero non funzionare
        correttamente.
      </p>
    </div>
  );
}

export default CookiePolicy;