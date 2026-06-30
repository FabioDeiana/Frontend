import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="py-16 px-6 bg-green-700 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Unisciti a GreenMap</h2>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Sei un utente curioso o gestisci un'attività eco-sostenibile? Registrati e diventa parte della community.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-green-100 transition"
        >
          Registrati come utente
        </Link>
        <Link
          to="/register?type=owner"
          className="bg-green-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition border border-white"
        >
          Registra la tua attività
        </Link>
      </div>
    </section>
  );
}

export default CTASection;