function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Esplora la mappa",
      description: "Trova attività eco-sostenibili vicino a te: ristoranti, negozi, mercati e molto altro.",
    },
    {
      number: "2",
      title: "Leggi le recensioni",
      description: "Scopri cosa pensa la community su sostenibilità, accessibilità e opzioni alimentari.",
    },
    {
      number: "3",
      title: "Contribuisci",
      description: "Registrati per lasciare recensioni o candida la tua attività se la gestisci tu.",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-12 text-center text-green-700">
        Come funziona
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;