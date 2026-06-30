function HeroSection() {
  return (
    <section className="bg-green-700 text-white text-center py-20 px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Scopri le attività eco-sostenibili vicino a te
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        GreenMap ti aiuta a trovare ristoranti, negozi e servizi che hanno a cuore l'ambiente quanto te.
      </p>
      <a href="#map" className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-green-100 transition">
        Esplora la mappa
      </a>
    </section>
  );
}

export default HeroSection;