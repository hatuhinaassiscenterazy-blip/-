import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Sparkles, User, Video, ChevronRight, Play, Check, ChevronLeft, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FloatingPolaroids = () => {
  const images = [
    "./Woman_face_photo_restoration_202608141410.jpeg",
    "./boy-photo-v2.jpeg",
    "./1.jpeg",
    "./Girl_with_ladybug_on_finger_202607141209.jpeg",
    "./Wedding_couple_touching_forehead_2K_202608141441.jpeg",
    "./Create_watercolor_greeting_card_202608311346.jpeg"
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {images.map((src, i) => {
        const isLeft = i % 2 === 0;
        const sideIndex = Math.floor(i / 2);
        
        const positionX = isLeft ? 2 + sideIndex * 4 : 88 - sideIndex * 4; 
        const fixedDuration = 30;
        const delay = (sideIndex * (fixedDuration / 3)) + (isLeft ? 0 : 5);
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-md bg-white p-2 pb-5 shadow-2xl opacity-10"
            style={{ 
              left: `${positionX}%`, 
              top: '110%',
              width: '130px',
              height: 'auto',
              aspectRatio: '3/4'
            }}
            animate={{ 
              y: ['0vh', '-130vh'],
              rotate: [isLeft ? -15 : 15, isLeft ? 10 : -10],
              opacity: [0, 0.1, 0.1, 0]
            }}
            transition={{ 
              duration: fixedDuration,
              delay: delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-[#1c1715] overflow-hidden rounded-sm">
              <img src={src} className="w-full h-full object-cover grayscale opacity-70" alt="" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const BeforeAfterSlider = ({ beforeImage, afterImage, onExpand }: { beforeImage: string, afterImage: string, onExpand?: (src: string) => void }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:min-h-[520px] md:h-[650px] rounded-2xl overflow-hidden cursor-ew-resize border-glass shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,249,240,0.15)]"
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
    >
      <img src={afterImage} alt="После" className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={beforeImage} alt="До" className="absolute top-0 left-0 w-full h-full object-cover" style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }} />
      </div>
      
      <div 
        className="absolute top-0 bottom-0 w-1 bg-[#fff9f0] shadow-[0_0_15px_rgba(255,249,240,0.6)] z-10 flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-10 h-10 rounded-full bg-[#1c1715] border-2 border-[#fff9f0] flex items-center justify-center shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff9f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8L22 12L18 16M6 8L2 12L6 16M2 12H22"/>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-[rgba(28,23,21,0.85)] backdrop-blur-md border border-[rgba(255,249,240,0.2)] rounded-full text-[#fff9f0] text-sm font-medium tracking-wider shadow-xl whitespace-nowrap">
        Не просто снимок, а часть вашей истории
      </div>
      {onExpand && (
        <button 
          onClick={(e) => { e.stopPropagation(); onExpand(afterImage); }}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.3)] flex items-center justify-center text-[#fff9f0] hover:bg-[rgba(255,249,240,0.2)] transition-colors shadow-lg"
          title="Увеличить"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const ImageCarousel = ({ images, altPrefix, aspectRatio = "aspect-[4/5]", onExpand }: { images: string[], altPrefix: string, aspectRatio?: string, onExpand?: (src: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={`relative ${aspectRatio} rounded-3xl overflow-hidden mb-6 border-glass group/carousel bg-[#1c1715]`}>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${altPrefix} ${currentIndex + 1}`}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/carousel:scale-105"
        />
      </AnimatePresence>
      
      {onExpand && (
        <button 
          onClick={(e) => { e.stopPropagation(); onExpand(images[currentIndex]); }}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.3)] flex items-center justify-center text-[#fff9f0] opacity-100  hover:bg-[rgba(255,249,240,0.2)] transition-all shadow-lg"
          title="Увеличить"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#120f0e] via-transparent to-transparent opacity-80 pointer-events-none" />

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.2)] flex items-center justify-center text-[#fff9f0] opacity-100  transition-opacity hover:bg-[rgba(255,249,240,0.1)] z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.2)] flex items-center justify-center text-[#fff9f0] opacity-100  transition-opacity hover:bg-[rgba(255,249,240,0.1)] z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <button 
            key={idx}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#fff9f0] w-3' : 'bg-[rgba(255,249,240,0.4)] hover:bg-[rgba(255,249,240,0.8)]'}`}
          />
        ))}
      </div>
    </div>
  );
};

const Lightbox = ({ src, onClose }: { src: string | null, onClose: () => void }) => {
  if (!src) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000e6] p-4 md:p-8 cursor-pointer backdrop-blur-sm"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-50 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          src={src}
          alt="Увеличенное изображение"
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
        />
      </motion.div>
    </AnimatePresence>
  );
};

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative aspect-video rounded-3xl overflow-hidden border-glass shadow-2xl bg-[#1c1715]">
      {!isPlaying && (
        <div className="absolute inset-0 group cursor-pointer" onClick={handlePlay}>
          <img src="./1.jpeg" alt="Постер сказки" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[rgba(255,249,240,0.2)] backdrop-blur-md border border-[rgba(255,249,240,0.3)] flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-[#fff9f0] ml-1" />
            </div>
          </div>
        </div>
      )}
      <video 
        ref={videoRef}
        className={`w-full h-full object-cover ${isPlaying ? 'block' : 'hidden'}`} 
        controls 
        playsInline
      >
        <source src="./0807.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
};

const Calculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [additionalPeople, setAdditionalPeople] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const baseOptions = [
    { id: 'selfie', label: 'Нейрофотосессия по селфи (1 человек)', price: 300 },
    { id: 'restore', label: 'Реставрация фото', price: 200 },
    { id: 'restore_color', label: 'Реставрация + колоризация', price: 300 },
    { id: 'commerce', label: 'Коммерческий визуал / карточка товара', price: 300 },
    { id: 'lookbook', label: 'Лукбук / каталог одежды', price: 500 },
    { id: 'fairytale', label: 'Персональная детская сказка (1 мин)', price: 1000 },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const calculateTotal = () => {
    let total = selectedServices.reduce((sum, id) => {
      return sum + (baseOptions.find(o => o.id === id)?.price || 0);
    }, 0);
    if (selectedServices.includes('selfie') && additionalPeople > 0) {
      total += additionalPeople * 150;
    }
    return total;
  };

  const getOrderText = () => {
    if (selectedServices.length === 0) return 'Здравствуйте! Хочу сделать заказ.';
    let text = `Здравствуйте! Хочу заказать:\n`;
    selectedServices.forEach(id => {
      text += `- ${baseOptions.find(o => o.id === id)?.label}\n`;
    });
    if (selectedServices.includes('selfie') && additionalPeople > 0) {
      text += `Дополнительных людей: ${additionalPeople}\n`;
    }
    text += `Итоговая сумма: ${calculateTotal()} ₽`;
    return encodeURIComponent(text);
  };

  return (
    <div className="bg-glass border-glass rounded-3xl p-6 md:p-12 shadow-2xl relative z-10">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4 text-[#fff9f0]">Рассчитать стоимость</h3>
        <p className="text-[#f3e8d8] text-lg">Покажите снимок, который хочется вернуть к жизни, или товар, которому нужен продающий кадр</p>
      </div>
      
      {/* Image Upload */}
      <div className="mb-10">
        <label className="block w-full border-2 border-dashed border-[rgba(255,249,240,0.2)] hover:border-[rgba(255,249,240,0.5)] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[rgba(255,255,255,0.02)]">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {previewImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-xl overflow-hidden border border-[rgba(255,249,240,0.2)] bg-[#1c1715]">
                <img src={previewImage} alt="Превью" className="w-full h-full object-cover" />
              </div>
              <span className="text-[#fff9f0] font-medium text-sm px-4 py-2 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,249,240,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">Заменить фото</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,249,240,0.05)] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-[#fff9f0]" />
              </div>
              <span className="text-[#fff9f0] font-medium text-lg">Прикрепить фото / исходник</span>
              <span className="text-[#f3e8d8] text-sm opacity-80">Нажмите или перетащите файл</span>
            </div>
          )}
        </label>
      </div>

      <div className="space-y-4 mb-8">
        {baseOptions.map((opt) => {
          const isSelected = selectedServices.includes(opt.id);
          return (
            <label 
              key={opt.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer relative z-20 ${
                isSelected 
                  ? 'border-[#fff9f0] bg-[rgba(255,249,240,0.05)]' 
                  : 'border-[rgba(255,249,240,0.1)] hover:border-[rgba(255,249,240,0.3)]'
              }`}
            >
              <input 
                type="checkbox" 
                value={opt.id}
                checked={isSelected}
                onChange={() => toggleService(opt.id)}
                className="absolute opacity-0 w-0 h-0"
              />
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[#fff9f0] bg-[#fff9f0]' : 'border-gray-500'}`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#120f0e]" strokeWidth={3} />}
                </div>
                <span className="text-[#fff9f0] font-medium leading-tight">{opt.label}</span>
              </div>
              <span className="text-[#f3e8d8] shrink-0 ml-9 sm:ml-4">от {opt.price} ₽</span>
            </label>
          );
        })}
      </div>

      {selectedServices.includes('selfie') && (
        <div className="mb-8 p-6 rounded-xl border border-[rgba(255,249,240,0.1)] bg-[rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#fff9f0] font-medium mb-1">Дополнительные люди в кадре</div>
              <div className="text-[#f3e8d8] text-sm">+150 ₽ за каждого</div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAdditionalPeople(Math.max(0, additionalPeople - 1))}
                className="w-8 h-8 rounded-full border border-[rgba(255,249,240,0.2)] flex items-center justify-center text-[#fff9f0] hover:bg-[rgba(255,255,255,0.05)] transition-colors relative z-20"
              >-</button>
              <span className="text-[#fff9f0] font-medium w-4 text-center">{additionalPeople}</span>
              <button 
                onClick={() => setAdditionalPeople(additionalPeople + 1)}
                className="w-8 h-8 rounded-full border border-[rgba(255,249,240,0.2)] flex items-center justify-center text-[#fff9f0] hover:bg-[rgba(255,255,255,0.05)] transition-colors relative z-20"
              >+</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-8 border-t border-[rgba(255,249,240,0.1)] gap-6">
        <div>
          <div className="text-[#f3e8d8] text-sm mb-1">Итоговая стоимость:</div>
          <div className="text-3xl font-semibold text-[#fff9f0]">{calculateTotal()} ₽</div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a href={`https://t.me/hatyhinavika?text=${getOrderText()}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,249,240,0.2)] hover:bg-[#fff9f0] hover:text-[#120f0e] text-[#fff9f0] transition-all font-medium shadow-[0_0_15px_rgba(255,249,240,0.05)] hover:shadow-[0_0_20px_rgba(255,249,240,0.2)]">
            Заказать в Telegram
          </a>
          <a href={`https://vk.ru/im?sel=-240849361&text=${getOrderText()}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,249,240,0.2)] hover:bg-[#fff9f0] hover:text-[#120f0e] text-[#fff9f0] transition-all font-medium shadow-[0_0_15px_rgba(255,249,240,0.05)] hover:shadow-[0_0_20px_rgba(255,249,240,0.2)]">
            Заказать в VK
          </a>
          <a href={`https://clck.ru/3Vh6Je`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,249,240,0.2)] hover:bg-[#fff9f0] hover:text-[#120f0e] text-[#fff9f0] transition-all font-medium shadow-[0_0_15px_rgba(255,249,240,0.05)] hover:shadow-[0_0_20px_rgba(255,249,240,0.2)]">
            Заказать в Max
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      <FloatingPolaroids />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#fff9f0] rounded-full blur-[150px] opacity-[0.03] animate-glare" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#f3e8d8] rounded-full blur-[180px] opacity-[0.02] animate-glare" style={{ animationDelay: '-10s' }} />
        
        <div className="absolute top-[30%] right-[25%] w-[300px] h-[400px] rounded-2xl border border-[rgba(255,249,240,0.1)] bg-[rgba(255,255,255,0.01)] animate-card-1" />
        <div className="absolute bottom-[25%] left-[15%] w-[350px] h-[250px] rounded-2xl border border-[rgba(255,249,240,0.1)] bg-[rgba(255,255,255,0.01)] animate-card-2" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 bg-[rgba(18,15,14,0.8)] backdrop-blur-xl border-b border-glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-serif tracking-wide text-[#fff9f0]">
            Виктория Арт <span className="opacity-50 text-sm ml-2 font-sans tracking-normal hidden sm:inline-block">| Цифровой художник & AI-продакшн</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#f3e8d8]">
            <a href="#personal-photo" className="hover:text-[#fff9f0] transition-colors">Услуги</a>
            <a href="#calculator" className="hover:text-[#fff9f0] transition-colors">Калькулятор</a>
            <a href="#about" className="hover:text-[#fff9f0] transition-colors">Обо мне</a>
            <a href="#contact" className="hover:text-[#fff9f0] transition-colors">Контакты</a>
          </nav>
          
          <a href="#calculator" className="hidden sm:inline-flex px-6 py-2.5 rounded-full border border-[rgba(255,249,240,0.3)] text-[#fff9f0] text-sm font-medium hover:bg-[#fff9f0] hover:text-[#120f0e] transition-all duration-300">
            Рассчитать стоимость
          </a>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 min-h-[75vh] flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-6 tracking-[0.2em] text-xs font-semibold text-[#f3e8d8] uppercase border border-[rgba(255,249,240,0.2)] px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)]">
                Виктория Арт | Цифровой художник & AI-продакшн
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-8">
                Создаю живые кадры из ваших селфи и продающий визуал для бизнеса
              </h1>
              
              <p className="text-lg md:text-xl text-[#f3e8d8] leading-relaxed mb-8 max-w-xl">
                Творю чудо там, где обычная камера бессильна: от каталогов одежды до новой жизни семейных архивов.
              </p>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-4 rounded-xl border border-[rgba(255,249,240,0.2)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
                  <div className="text-[#fff9f0] font-medium mb-1">Без предоплаты</div>
                  <div className="text-sm text-[#f3e8d8] opacity-80 leading-snug">Оплата только после утверждения готового результата.</div>
                </div>
                <div className="p-4 rounded-xl border border-[rgba(255,249,240,0.2)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
                  <div className="text-[#fff9f0] font-medium mb-1">Сроки от 8 часов</div>
                  <div className="text-sm text-[#f3e8d8] opacity-80 leading-snug">Первые варианты и готовые кадры уже в день заказа.</div>
                </div>
                <div className="p-4 rounded-xl border border-[rgba(255,249,240,0.2)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
                  <div className="text-[#fff9f0] font-medium mb-1">Бесплатные правки</div>
                  <div className="text-sm text-[#f3e8d8] opacity-80 leading-snug">Довожу каждую деталь до идеала без доплат.</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap items-center gap-6 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a href="#calculator" className="px-8 py-4 rounded-full bg-[#fff9f0] text-[#120f0e] font-semibold hover:bg-white transition-all shadow-[0_0_30px_rgba(255,249,240,0.2)]">
                  Рассчитать проект
                </a>
                <a href="#personal-photo" className="flex items-center gap-2 text-[#fff9f0] font-medium group hover:opacity-80 transition-opacity">
                  Смотреть работы <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="px-5 py-3 rounded-2xl border-glass bg-glass text-sm font-medium text-[#fff9f0]">Реставрация <span className="text-[#f3e8d8] ml-1">от 200 ₽</span></div>
                <div className="px-5 py-3 rounded-2xl border-glass bg-glass text-sm font-medium text-[#fff9f0]">Нейрофотосессия по селфи <span className="text-[#f3e8d8] ml-1">от 300 ₽</span></div>
                <div className="px-5 py-3 rounded-2xl border-glass bg-glass text-sm font-medium text-[#fff9f0]">Каталоги и примерка <span className="text-[#f3e8d8] ml-1">от 500 ₽</span></div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <BeforeAfterSlider 
                beforeImage="./IMG_20260717_175948.png_202607201234.jpeg"
                afterImage="./Beauty_portrait_melting_ice_lilac_202607141210.jpeg"
                onExpand={setSelectedImage}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* How it works Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
          <div className="text-center mb-16">
            <div className="inline-block tracking-[0.2em] text-sm font-semibold text-[#f3e8d8] mb-4">— ВСЁ ПРОСТО</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#fff9f0]">От вашей идеи до готового результата</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[rgba(243,232,216,0.18)]">
            <div className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <div className="text-3xl font-serif text-[#fff9f0] opacity-40 mb-4">01</div>
              <h3 className="text-xl font-medium text-[#fff9f0] mb-3">Пришлите фото или напишите запрос</h3>
              <p className="text-[#f3e8d8] opacity-80 leading-relaxed text-sm">Подойдет домашнее селфи, снимок старого кадра из альбома на телефон или задача для карточки товара.</p>
            </div>
            <div className="lg:px-8">
              <div className="text-3xl font-serif text-[#fff9f0] opacity-40 mb-4">02</div>
              <h3 className="text-xl font-medium text-[#fff9f0] mb-3">Обсудим задачу</h3>
              <p className="text-[#f3e8d8] opacity-80 leading-relaxed text-sm">Выберем образ, локацию или степень реставрации. Назову точную стоимость и согласуем детали до старта.</p>
            </div>
            <div className="lg:px-8">
              <div className="text-3xl font-serif text-[#fff9f0] opacity-40 mb-4">03</div>
              <h3 className="text-xl font-medium text-[#fff9f0] mb-3">Оцените результат</h3>
              <p className="text-[#f3e8d8] opacity-80 leading-relaxed text-sm">Показываю готовые образцы работы, вношу аккуратные правки, пока вам всё не понравится.</p>
            </div>
            <div className="lg:px-8">
              <div className="text-3xl font-serif text-[#fff9f0] opacity-40 mb-4">04</div>
              <h3 className="text-xl font-medium text-[#fff9f0] mb-3">Заберите готовые кадры</h3>
              <p className="text-[#f3e8d8] opacity-80 leading-relaxed text-sm">Отправляю исходники в максимальном разрешении: для печати в фотокнигу, соцсетей или маркетплейсов.</p>
            </div>
          </div>
        </motion.section>

        {/* Family Photos Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="personal-photo" className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-semibold mb-10 md:mb-16 text-center">Фотографии для себя и семьи</h2>
          
          <div className="space-y-8">
            <article className="bg-[#1c1715] border-glass rounded-3xl p-6 md:p-12 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(255,249,240,0.1)] flex items-center justify-center mb-6">
                  <Camera className="w-6 h-6 text-[#fff9f0]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Фотосессия по вашим селфи или домашнему фото</h3>
                <p className="text-[#f3e8d8] text-lg leading-relaxed">Индивидуальные, парные и семейные съемки в любых сюжетах на основе ваших домашних фото. Создаю профессиональные кадры без студии.</p>
              </div>
              <div className="w-full md:w-1/2 md:max-w-[400px]">
                <ImageCarousel 
                  onExpand={setSelectedImage}
                  aspectRatio="aspect-[3/4]"
                  images={[
                    "./Wedding_couple_touching_forehead_2K_202608141441.jpeg",
                    "./boy-photo-v2.jpeg",
                    "./Girl_standing_in_meadow_202607261427.jpeg"
                  ]}
                  altPrefix="Фотосессия"
                />
              </div>
            </article>

            <article className="bg-[#1c1715] border-glass rounded-3xl p-6 md:p-12 flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(255,249,240,0.1)] flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-[#fff9f0]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Новая жизнь для семейных архивов</h3>
                <p className="text-[#f3e8d8] text-lg leading-relaxed">Бережное удаление трещин, заломов, восстановление черт лица и аккуратная колоризация черно-белых архивных снимков с уважением к прошлому.</p>
              </div>
              <div className="w-full md:w-1/2 md:max-w-[400px]">
                <ImageCarousel 
                  onExpand={setSelectedImage}
                  aspectRatio="aspect-[3/4]"
                  images={[
                    "./Woman_face_photo_restoration_202608141410.jpeg",
                    "./Creating_vintage_family_photo_co_202608221325.jpeg",
                    "./Creating_vintage_wedding_photo_c_202608221326.jpeg"
                  ]}
                  altPrefix="Реставрация"
                />
              </div>
            </article>

            <article className="bg-[#1c1715] border-glass rounded-3xl p-6 md:p-12 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(255,249,240,0.1)] flex items-center justify-center mb-6">
                  <ImageIcon className="w-6 h-6 text-[#fff9f0]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Праздничные поздравления</h3>
                <p className="text-[#f3e8d8] text-lg leading-relaxed">Авторские поздравительные открытки и персональные песни к важным датам, созданные специально для ваших близких.</p>
              </div>
              <div className="w-full md:w-1/2 md:max-w-[400px]">
                <ImageCarousel 
                  onExpand={setSelectedImage}
                  aspectRatio="aspect-[3/4]"
                  images={[
                    "./Create_watercolor_greeting_card_202608311346.jpeg",
                    "./IMG_20260815_122827.png",
                    "./IMG_20260815_122824.png"
                  ]}
                  altPrefix="Открытка"
                />
              </div>
            </article>
          </div>
        </motion.section>

        {/* Business Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="portfolio" className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-semibold mb-10 md:mb-16 text-center">Визуал для бизнеса</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="group">
              <ImageCarousel 
                onExpand={setSelectedImage}
                aspectRatio="aspect-[4/5]"
                images={[
                  "./Woman_wearing_layered_necklaces_2K_202608091432.jpeg",
                  "./Man_wearing_brown_hoodie_2K_202608091432.jpeg",
                  "./Man_and_woman_posing_together_202608091436.jpeg"
                ]}
                altPrefix="Каталог одежды"
              />
              <h3 className="text-2xl font-semibold mb-3">Каталоги одежды и примерка</h3>
              <p className="text-[#f3e8d8] leading-relaxed">Показ коллекций брендов на виртуальных моделях в любых локациях.</p>
            </article>

            <article className="group md:mt-12">
              <ImageCarousel 
                onExpand={setSelectedImage}
                aspectRatio="aspect-[4/5]"
                images={[
                  "./Gift_card_design_for_soap_202608131918.jpeg",
                  "./Soap_bunny_blowing_kiss_202608251117.jpeg",
                  "./Soap_bouquet_in_paper_bag_202608251116.jpeg"
                ]}
                altPrefix="Карточка товара"
              />
              <h3 className="text-2xl font-semibold mb-3">Карточки товаров и инфографика</h3>
              <p className="text-[#f3e8d8] leading-relaxed">Продающий дизайн для маркетплейсов и соцсетей (мыло ручной работы, косметика и др.).</p>
            </article>

            <article className="group">
              <ImageCarousel 
                onExpand={setSelectedImage}
                aspectRatio="aspect-[3/4]"
                images={[
                  "./Gemini_Generated_Image_5rbplg5rbplg5rbp.jpg",
                  "./Beauty_studio_price_list_menu_2K_202609042009.jpeg"
                ]}
                altPrefix="Визитка"
              />
              <h3 className="text-2xl font-semibold mb-3">Дизайн для мастеров и услуг</h3>
              <p className="text-[#f3e8d8] leading-relaxed">Брендовые визитки и наглядные прайсы (комплект для мастера ногтевого сервиса).</p>
            </article>
          </div>
        </motion.section>

        {/* Video Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto px-6 mb-20 md:mb-32 text-center">
          <div className="inline-block mb-6 p-4 rounded-full bg-[rgba(255,249,240,0.05)] border-glass">
            <Video className="w-6 h-6 text-[#fff9f0]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold mb-10 md:mb-12 text-[#fff9f0]">Персональная детская сказка с авторской озвучкой</h2>
          <VideoPlayer />
        </motion.section>

        {/* Calculator Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="calculator" className="max-w-4xl mx-auto px-6 mb-20 md:mb-32">
          <Calculator />
        </motion.section>

        {/* About Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="about" className="max-w-6xl mx-auto px-6 mb-16 md:mb-24">
          <div className="bg-[#1c1715] border-glass rounded-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 p-6 md:p-12 border-b md:border-b-0 md:border-r border-[rgba(255,249,240,0.1)]">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-glass relative group">
                  <img src="./Girl_with_ladybug_on_finger_202607141209.jpeg" alt="Виктория Арт" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-[rgba(18,15,14,0.8)] backdrop-blur-md rounded-xl border border-[rgba(255,249,240,0.15)] text-center">
                    <span className="font-serif text-xl tracking-wide text-[#fff9f0]">Виктория Арт</span>
                  </div>
                  <button 
                    onClick={() => setSelectedImage("./Girl_with_ladybug_on_finger_202607141209.jpeg")}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.3)] flex items-center justify-center text-[#fff9f0] opacity-100  hover:bg-[rgba(255,249,240,0.2)] transition-all shadow-lg"
                    title="Увеличить"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8 text-[#fff9f0]">Обо мне & Доверие</h2>
                <div className="space-y-6 text-[#f3e8d8] text-lg leading-relaxed mb-10">
                  <p>
                    Я — художник, который с помощью нейросетей переносит ваши идеи в реальность. Моя главная задача — создавать эстетичный и коммерчески эффективный визуал.
                  </p>
                  <p>
                    Ко мне обращаются, когда нужна красивая студийная съемка, но нет времени ехать в студию. Когда хочется подарить новую жизнь старым фото или создать каталог для бренда без аренды локаций и моделей.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,249,240,0.1)] hover:border-[rgba(255,249,240,0.3)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#251f1c] border border-[#fff9f0] flex items-center justify-center shrink-0 mb-4">
                      <User className="w-5 h-5 text-[#fff9f0]" />
                    </div>
                    <h4 className="text-xl font-serif text-[#fff9f0] mb-2">Индивидуальный подход</h4>
                    <p className="text-sm text-[#f3e8d8] leading-relaxed">
                      Я работаю лично с каждым заказом, не используя автоматические фильтры. Только ручная промт-настройка и детализация.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,249,240,0.1)] hover:border-[rgba(255,249,240,0.3)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#251f1c] border border-[#fff9f0] flex items-center justify-center shrink-0 mb-4">
                      <Check className="w-5 h-5 text-[#fff9f0]" />
                    </div>
                    <h4 className="text-xl font-serif text-[#fff9f0] mb-2">Сертифицированный специалист</h4>
                    <p className="text-sm text-[#f3e8d8] leading-relaxed mb-4">
                      Прошла профильное обучение и успешно завершила курс «Нейро-Дизайнер 1.0».
                      <br />
                      Автор: Алексей Рыков. Сертификат № 12630.
                    </p>
                    <div className="aspect-[3/4] rounded-2xl border-glass overflow-hidden relative group bg-[#1c1715]">
                      <img src="./diploma25613405.png" alt="Сертификат" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none group-hover:bg-transparent transition-colors duration-500">
                        <span className="text-[#fff9f0] font-medium tracking-wider text-sm border border-[rgba(255,249,240,0.3)] px-4 py-2 rounded-full backdrop-blur-md bg-[rgba(28,23,21,0.5)]">Сертификат</span>
                      </div>
                      <button 
                        onClick={() => setSelectedImage("./diploma25613405.png")}
                        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[rgba(28,23,21,0.5)] backdrop-blur-sm border border-[rgba(255,249,240,0.3)] flex items-center justify-center text-[#fff9f0] opacity-100  hover:bg-[rgba(255,249,240,0.2)] transition-all shadow-lg"
                        title="Увеличить"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer id="contact" className="border-t border-glass bg-[#120f0e] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-2xl font-serif tracking-wide text-[#fff9f0] mb-6">
              Виктория Арт
            </div>
            <p className="text-[#f3e8d8] max-w-sm leading-relaxed mb-8">
              Создание живых кадров, реставрация и продающий визуал.
            </p>
            <div className="text-sm text-[rgba(243,232,216,0.6)]">
              © 2026 Виктория Арт. Все права защищены.
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-4">
            <a href="tel:+79002059133" className="text-xl font-medium text-[#fff9f0] hover:opacity-80 transition-opacity">
              8 900 205-91-33
            </a>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="https://t.me/hatyhinavika" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full border border-[rgba(255,249,240,0.2)] text-[#f3e8d8] hover:text-[#fff9f0] hover:border-[#fff9f0] transition-all">
                Telegram
              </a>
              <a href="https://vk.ru/im?sel=-240849361" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full border border-[rgba(255,249,240,0.2)] text-[#f3e8d8] hover:text-[#fff9f0] hover:border-[#fff9f0] transition-all">
                Группа ВК
              </a>
              <a href="https://clck.ru/3Vh6Je" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full border border-[rgba(255,249,240,0.2)] text-[#f3e8d8] hover:text-[#fff9f0] hover:border-[#fff9f0] transition-all">
                Max
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
