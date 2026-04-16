import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Search, ArrowRight, ShieldCheck, Zap, Star, Play, Gauge, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { VehicleWithMedia, Store } from '../types'
import FinancingCalculator from '../components/FinancingCalculator'

function Home() {
  const [recentVehicles, setRecentVehicles] = useState<VehicleWithMedia[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, storesRes] = await Promise.all([
          api.get('/vehicles?limit=12'),
          api.get('/stores'),
        ])
        setRecentVehicles(vehiclesRes.data)
        setStores(storesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    fetchData()
  }, [])

  const spotlightVehicles = recentVehicles.slice(0, 6)

  return (
    <div className="text-white font-sans w-full overflow-hidden">
      
      {/* Modern Slim Search Section Just Below Menu */}
      <section className="relative pt-[190px] px-6 z-30 mb-8 max-w-[1080px] mx-auto">
        <div className="w-full flex flex-col md:flex-row items-center gap-2 p-1.5 rounded-full bg-[#0A0D10]/80 border border-white/10 backdrop-blur-md shadow-lg">
           <div className="flex-1 w-full relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-[#1dd1a1] transition-colors" />
             <input 
               type="text" 
               placeholder="Busque por marca, modelo ou potência..." 
               className="w-full bg-transparent py-2.5 pl-12 pr-4 text-white text-sm placeholder:text-[#555] outline-none focus:border-transparent transition-all"
               style={{ boxShadow: 'none' }}
             />
           </div>
           <button className="w-full md:w-auto px-6 py-2.5 bg-[#1dd1a1] text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#00f3ff] hover:text-[#555] transition-all">
             Buscar
           </button>
        </div>
      </section>

      {/* Dynamic Hero Section with Luxury Flare */}
      <section className="relative pt-12 pb-40 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1140px] h-[800px] bg-[#1dd1a1]/5 blur-[120px] rounded-full" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#1dd1a1]/10 blur-[100px] rounded-full" />
        <img 
          src="/logo-auto-destaque.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[800px] opacity-[0.04] pointer-events-none select-none object-contain" 
        />
        
        <div className="max-w-[1140px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#1dd1a1] mb-12 animate-pulse shadow-[0_0_20px_rgba(29,209,161,0.1)]">
              <Sparkles className="w-3" />
              Experiência Automotiva de Elite 2026
            </div>
            
            <h1 className="text-4xl md:text-[55px] font-black font-['Architects_Daughter'] tracking-tighter mb-10 leading-[1] text-white uppercase mt-4">
              {/* SEO keyword anchor — visível para o Google, elegante para o usuário */}
              <span className="block text-sm md:text-base font-black uppercase tracking-[0.3em] text-[#576574] mb-3 opacity-70">
                Comprar Carro Seminovo e Importado com Garantia | Solara Auto
              </span>
              <span className="block text-xl md:text-2xl text-[#1dd1a1] mb-2 drop-shadow-md font-['Architects_Daughter']">Aqui não vendemos carros. Entregamos Ativos de Valor.</span>
              MAIS QUE POTÊNCIA,<br />
              <span className="text-[#1dd1a1] drop-shadow-[0_0_20px_rgba(29,209,161,0.5)]">ESTADO DE ARTE</span>
            </h1>

            <p className="text-[#8395a7] text-lg md:text-2xl max-w-3xl mx-auto mb-20 font-medium tracking-tight leading-relaxed">
              Adquira seu próximo grande ativo sem sair de casa. Uma curadoria absoluta onde design vanguardista e garantias inegociáveis se encontram para proteger o seu patrimônio.
            </p>
          </div>

          {/* Hero Featured Card (Big Highlight) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative max-w-[950px] mx-auto h-[400px] md:h-[500px] rounded-[50px] overflow-hidden border border-[#1dd1a1] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
             <img 
               src={spotlightVehicles[0]?.media?.[0]?.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2070"} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
               alt={`${spotlightVehicles[0]?.title || "Carro de Luxo"} seminovo à venda — Solara Auto`}
             />
             {spotlightVehicles[0] && (
               <script type="application/ld+json">
                 {JSON.stringify({
                   "@context": "https://schema.org",
                   "@type": "Car",
                   "name": spotlightVehicles[0].title,
                   "brand": { "@type": "Brand", "name": spotlightVehicles[0].brand },
                   "model": spotlightVehicles[0].title,
                   "offers": {
                     "@type": "Offer",
                     "priceCurrency": "BRL",
                     "price": spotlightVehicles[0].price,
                     "availability": "https://schema.org/InStock",
                     "seller": { "@type": "AutoDealer", "name": "Solara Auto" }
                   }
                 })}
               </script>
             )}
          </motion.div>

          {/* Hero Details Extracted Below Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-[950px] mx-auto mt-10 flex flex-col md:flex-row md:items-start justify-between gap-8 text-left"
          >
             <div>
                <h2 className="inline-block px-4 py-2 bg-[#1dd1a1] text-black text-[10px] font-black uppercase tracking-widest rounded-xl mb-4">Destaque do Mês</h2>
                <h3 className="text-4xl md:text-[50px] font-black font-impact tracking-tighter uppercase mb-4 italic">{spotlightVehicles[0]?.title || "Porsche 911 GT3 RS"}</h3>
                <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] mb-2">"Venha conferir esse maravilhoso carro!"</p>
             </div>
             <div className="flex flex-col gap-4 min-w-[200px] items-start md:items-end">
                <span className="text-3xl font-black text-white tracking-widest">{spotlightVehicles[0] ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spotlightVehicles[0].price) : "R$ 1.850.000"}</span>
                 <div className="relative">
                    <Link to={spotlightVehicles[0] ? `/veiculo/${spotlightVehicles[0].slug || spotlightVehicles[0].id}` : "#"} className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1dd1a1] text-black font-black uppercase text-xs tracking-widest rounded-[20px] hover:bg-[#00f3ff] hover:text-[#555] transition-all group/btn relative z-10 w-full md:w-auto">
                       Falar com Especialista <Play className="w-4 h-4 text-black group-hover/btn:text-[#555] transition-colors" />
                    </Link>
                    <span className="absolute -bottom-8 right-0 text-[#1dd1a1] font-['Architects_Daughter'] text-sm md:text-base opacity-80 whitespace-nowrap rotate-[-3deg]">
                       "Pronto para redefinir seu padrão."
                    </span>
                 </div>
             </div>
          </motion.div>
        </div>
      </section>



      {/* Featured Showcase Section (Alternating) */}
      <section className="max-w-[1140px] mx-auto px-6 mb-[60px] space-y-40">
        <div className="text-center mb-20 relative">
           <h2 className="text-4xl md:text-6xl font-black font-impact tracking-tighter uppercase mb-6 italic">Carros Seminovos à Venda: <span className="text-[#1dd1a1]">Curadoria de Alta Performance</span></h2>
           <div className="w-24 h-1.5 bg-[#1dd1a1] mx-auto rounded-full mb-6" />
           <p className="font-['Architects_Daughter'] text-2xl md:text-3xl text-white opacity-60">Você merece o próximo nível.</p>
        </div>
        {(spotlightVehicles.length > 1 ? spotlightVehicles.slice(1, 5) : [
          { id: 'mock1', title: 'Audi RS6 Avant', description: 'Performance e estética com um V8 biturbo brutal.', price: 1200000, km: 0, media: [{url: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=2074'}] },
          { id: 'mock2', title: 'Mercedes AMG GT', description: 'O puro estado da arte das pistas para as ruas.', price: 1550000, km: 500, media: [{url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070'}] },
          { id: 'mock3', title: 'Lamborghini Huracán', description: 'V10 aspirado numa obra-prima do design.', price: 3200000, km: 1200, media: [{url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2071'}] },
          { id: 'mock4', title: 'Land Rover Defender', description: 'Luxo e capacidade inigualável em qualquer terreno.', price: 850000, km: 200, media: [{url: 'https://images.unsplash.com/photo-1563720223185-11003d5169a6?auto=format&fit=crop&q=80&w=2070'}] }
        ]).map((vehicle: any, idx) => (
          <div key={vehicle.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-20 group`}>
             <div className="relative shrink-0 w-full md:w-[500px] mt-[70px]">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#1dd1a1]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-[320px] w-full rounded-[45px] overflow-hidden border border-[#1dd1a1] shadow-2xl">
                   <img 
                    src={vehicle.media?.[0]?.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                    alt={`${vehicle.title} seminovo à venda com garantia — Solara Auto`}
                   />
                </div>
             </div>
             <div className="flex-1 space-y-6 mt-0 md:mt-[50px]">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1dd1a1] bg-[#1dd1a1]/5 px-5 py-2 rounded-full border border-[#1dd1a1]/10">100% Periciado e Aprovado</span>
                <h3 className="text-4xl md:text-[50px] font-black font-impact tracking-tighter uppercase leading-[0.9] italic">{vehicle.title} — {vehicle.brand}</h3>
                <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] opacity-90 leading-relaxed max-w-xl">
                   "Cansado da insegurança ao trocar de carro? Aqui, cada motor V8 é certificado para você acelerar sem medo."
                </p>
                <p className="text-[#576574] text-lg leading-relaxed font-medium">
                   {vehicle.description || "Deixar seu patrimônio em opções duvidosas é um risco que você não precisa correr. Invista em engenharia de ponta com pronta entrega garantida e zero burocracia."}
                </p>
                <div className="flex items-center gap-8 py-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#333] uppercase tracking-widest mb-1">Km Atual</span>
                      <span className="text-xl font-black text-white">{vehicle.km.toLocaleString('pt-BR')} km</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#333] uppercase tracking-widest mb-1">Potência</span>
                      <span className="text-xl font-black text-white">Consulte</span>
                   </div>
                </div>
                <div className="pt-4">
                   <Link to={`/veiculo/${vehicle.slug || vehicle.id}`} className="inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#1dd1a1] text-black rounded-[20px] hover:bg-[#00f3ff] hover:text-[#555] hover:-translate-y-1 transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(29,209,161,0.3)] group/btn font-black uppercase tracking-widest text-xs w-full md:w-auto">
                      TENHO INTERESSE <ArrowRight className="w-5 h-5 text-black group-hover/btn:text-[#555] group-hover/btn:translate-x-2 transition-all" />
                   </Link>
                </div>
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Car",
                    "name": vehicle.title,
                    "brand": { "@type": "Brand", "name": vehicle.brand },
                    "offers": {
                      "@type": "Offer",
                      "priceCurrency": "BRL",
                      "price": vehicle.price,
                      "availability": "https://schema.org/InStock"
                    }
                  })}
                </script>
             </div>
          </div>
        ))}
      </section>

      {/* Persuasive Call to Action / Guarantees */}
      <section className="max-w-[1140px] mx-auto px-6 mb-40">
         <div className="relative w-full rounded-[45px] overflow-hidden bg-gradient-to-br from-[#0B0E14] to-[#0A0D10] border border-[#1dd1a1]/30 p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(29,209,161,0.1)] group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1dd1a1]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#1dd1a1]/10 transition-colors duration-1000 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="flex-1 space-y-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest border border-[#1dd1a1]/20">
                     <ShieldCheck className="w-4 h-4" /> Vantagens Exclusivas Solara
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black font-impact tracking-tighter uppercase italic leading-[1] text-white">
                     Nós Eliminamos o Risco. <br/>
                     <span className="text-[#1dd1a1]">Paz de Espírito com Laudo Blindado</span>
                  </h2>
                  <p className="text-[#8395a7] font-medium leading-relaxed max-w-xl text-lg">
                     Comprar um veículo de luxo não deveria ser um jogo de sorte. Surpresas mecânicas e desvalorização oculta não farão parte da sua história. Desfrute da exclusividade com a nossa <span className="text-white font-bold">Garantia Estendida Solara</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#1dd1a1]">
                           <Car className="w-4 h-4" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Super Avaliação do Seu Usado</h3>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#1dd1a1]">
                           <Shield className="w-4 h-4" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">100% Periciados e Garantidos</h3>
                     </div>
                  </div>
               </div>
               
               <div className="w-full md:w-auto relative">
                  <button onClick={() => setIsSimulatorOpen(true)} className="inline-flex items-center justify-center gap-4 px-10 py-6 bg-[#1dd1a1] text-black rounded-[25px] hover:bg-[#00f3ff] hover:text-[#555] hover:-translate-y-2 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(29,209,161,0.4)] group/btn w-full relative z-10">
                     <div className="flex flex-col items-center text-center">
                        <h2 className="font-black uppercase tracking-widest text-sm mb-1 text-black group-hover/btn:text-[#555] transition-colors">Aprovação Elite em Minutos</h2>
                        <h3 className="font-black text-[10px] opacity-80 text-black group-hover/btn:text-[#555] tracking-[0.2em] transition-colors uppercase">O carro dos seus sonhos sem burocracia.</h3>
                     </div>
                     <ArrowRight className="w-6 h-6 text-black group-hover/btn:text-[#555] group-hover/btn:translate-x-2 transition-all" />
                  </button>
                  <div className="absolute -bottom-10 right-4 text-white font-['Architects_Daughter'] text-xl opacity-90 rotate-[-5deg]">
                     100% Online e Seguro.
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/[0.02] border-y border-white/5 py-40 px-6">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
           {[
             { label: "Veículos Entregues", value: "850+", icon: Car },
             { label: "Anos de Mercado", value: "12", icon: Zap },
             { label: "Consultores VIP", value: "45", icon: Star },
             { label: "Certificação Elite", value: "100%", icon: ShieldCheck }
           ].map((stat, i) => (
             <div key={i} className="space-y-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1dd1a1]">
                   <stat.icon size={28} />
                </div>
                <p className="text-4xl font-black text-white font-impact">{stat.value}</p>
                <p className="text-[9px] font-black text-[#576574] uppercase tracking-[0.3em]">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Simulator Modal */}
      <FinancingCalculator isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />

      {/* Premium Stores Showcase */}
      <section className="max-w-[1140px] mx-auto px-6 py-32 border-t border-white/5 mt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 font-impact italic">Fale com um Especialista Solara Auto</h2>
          <h3 className="text-[#576574] font-medium font-['Architects_Daughter'] text-xl">Atendimento Via WhatsApp — Resposta Imediata</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stores.map((store) => (
            <Link 
              key={store.id} 
              to={`/${store.slug}`} 
              className="group p-8 rounded-[32px] bg-[#0A0D10] border border-white/5 hover:border-[#1dd1a1] hover:bg-[#111] transition-all duration-500 text-center shadow-lg hover:-translate-y-2"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                {store.logo_url ? <img src={store.logo_url} className="w-full h-full object-contain p-2" /> : <Car className="w-10 h-10 text-[#222]" />}
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#1dd1a1] transition-colors uppercase font-impact tracking-widest">{store.name}</h3>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#555]">{store.city || 'Brazil'}</span>
            </Link>
          ))}
        </div>
      </section>


    </div>
  )
}

export default Home

