import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Scroll Animation Component
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Contact Form Component
const ContactForm = () => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тема</label>
              <input
                type="text"
                name="subject"
                placeholder="Тема сообщения"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Сообщение</label>
              <textarea
                name="message"
                placeholder="Ваше сообщение..."
                rows="4"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              ></textarea>
            </div>

            {isError && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Отправка...
                </>
              ) : (
                <>
                  <SafeIcon name="send" size={20} />
                  Отправить сообщение
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center py-12"
          >
            <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon name="check-circle" size={40} className="text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Сообщение отправлено!
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
            </p>
            <button
              onClick={resetForm}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Отправить еще сообщение
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { id: 'about', label: 'О нас' },
    { id: 'services', label: 'Услуги' },
    { id: 'testimonials', label: 'Отзывы' },
    { id: 'contact', label: 'Контакты' }
  ]

  const services = [
    {
      icon: 'zap',
      title: 'Быстрая разработка',
      description: 'Создаем современные веб-приложения с использованием передовых технологий и лучших практик разработки.'
    },
    {
      icon: 'shield',
      title: 'Надежность',
      description: 'Обеспечиваем стабильную работу ваших проектов с гарантией безопасности и защиты данных.'
    },
    {
      icon: 'users',
      title: 'Поддержка 24/7',
      description: 'Предоставляем круглосуточную техническую поддержку и консультации по всем вопросам.'
    },
    {
      icon: 'trending-up',
      title: 'Рост бизнеса',
      description: 'Помогаем масштабировать ваш бизнес с помощью цифровых решений и автоматизации процессов.'
    },
    {
      icon: 'sparkles',
      title: 'Уникальный дизайн',
      description: 'Разрабатываем индивидуальные дизайн-решения, которые выделят ваш бренд среди конкурентов.'
    },
    {
      icon: 'award',
      title: 'Гарантия качества',
      description: 'Каждый проект проходит строгое тестирование перед запуском для обеспечения идеального результата.'
    }
  ]

  const testimonials = [
    {
      name: 'Александр Петров',
      role: 'CEO, TechStart',
      content: 'Отличная работа! Команда профессионалов создала для нас именно тот продукт, который мы искали. Рекомендую всем.',
      rating: 5
    },
    {
      name: 'Мария Иванова',
      role: 'Маркетолог, BrandHub',
      content: 'Сотрудничеством очень довольны. Понимание потребностей клиента на высшем уровне. Сроки соблюдены идеально.',
      rating: 5
    },
    {
      name: 'Дмитрий Сидоров',
      role: 'Основатель, AppCraft',
      content: 'Профессиональный подход к делу, внимание к деталям и отличная коммуникация на всех этапах проекта.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <SafeIcon name="sparkles" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">YourBrand</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Начать проект
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block w-full text-left text-gray-300 hover:text-white py-2 font-medium"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold mt-4"
                >
                  Начать проект
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              Создаем будущее веб-разработки
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight">
              Превратим ваши<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">идеи в реальность</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Мы разрабатываем современные веб-приложения, которые помогают бизнесу расти и развиваться в цифровом пространстве
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                Обсудить проект
                <SafeIcon name="arrow-right" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="bg-slate-800/50 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border border-slate-700 hover:border-slate-600"
              >
                Наши услуги
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '150+', label: 'Проектов' },
              { value: '50+', label: 'Клиентов' },
              { value: '5+', label: 'Лет опыта' },
              { value: '24/7', label: 'Поддержка' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    alt="Team working"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <SafeIcon name="heart" size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-gray-400 text-sm">Довольных клиентов</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <span className="text-blue-400 font-medium mb-4 block">О нас</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Команда профессионалов, создающая <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">цифровые шедевры</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Мы — группа увлеченных разработчиков, дизайнеров и стратегов, которые верят в силу качественного веб-присутствия. С 2019 года мы помогаем компаниям разных размеров находить свое место в цифровом мире.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Наш подход основан на глубоком понимании потребностей клиента, внимании к деталям и стремлении превзойти ожидания. Каждый проект для нас — это возможность создать что-то уникальное.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <SafeIcon name="check" size={20} className="text-blue-500" />
                  <span>Индивидуальный подход</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <SafeIcon name="check" size={20} className="text-blue-500" />
                  <span>Современные технологии</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <SafeIcon name="check" size={20} className="text-blue-500" />
                  <span>Прозрачные процессы</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-400 font-medium mb-4 block">Наши услуги</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Что мы <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">предлагаем</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Полный спектр услуг по разработке и поддержке веб-проектов любой сложности
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="group bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                    <SafeIcon name={service.icon} size={28} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-400 font-medium mb-4 block">Отзывы</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Что говорят <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">наши клиенты</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <SafeIcon key={i} name="star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="mb-6 flex-grow">
                    <SafeIcon name="quote" size={32} className="text-blue-600/30 mb-4" />
                    <p className="text-gray-300 leading-relaxed">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <span className="text-blue-400 font-medium mb-4 block">Контакты</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Давайте <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">поговорим</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Готовы начать новый проект или хотите узнать больше о наших услугах? Заполните форму или свяжитесь с нами напрямую.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mail" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="font-medium">hello@yourbrand.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                      <SafeIcon name="phone" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Телефон</div>
                      <div className="font-medium">+7 (999) 123-45-67</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                      <SafeIcon name="map-pin" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Адрес</div>
                      <div className="font-medium">Москва, ул. Примерная, 123</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Отправить сообщение</h3>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="sparkles" size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold">YourBrand</span>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              © 2024 YourBrand. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App