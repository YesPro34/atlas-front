"use client"
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faLinkedin, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Link from 'next/link';

const AtlasLandingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const faqData = [
    {
      question: "ما هي المزايا التي أحصل عليها من خلال خدماتكم بدلاً من التسجيل بنفسي؟",
      answer: "التسجيل معنا يضمن لك إتمام عملية التسجيل بشكل صحيح مع المتابعة المستمرة، مما يتيح لك التركيز على دراستك والتحضير للامتحانات دون قلق. نحن نوفر لك الكثير من الوقت ونتجنب القلق المرتبط بالأخطاء التقنية أو التأخير."
    },
    {
      question: "متى يجب أن أسجل للاستفادة من خدماتكم؟",
      answer: "يفضل التسجيل في أقرب وقت ممكن لضمان الاستفادة من جميع الخدمات والمتابعة الشخصية."
    },
    {
      question: "كيف يمكنني متابعة حالتي بعد التسجيل؟",
      answer: "ستحصل على تحديثات مستمرة حول حالة تسجيلك عبر البريد الإلكتروني أو الهاتف."
    },
    {
      question: "هل بدأت عملية التسجيل في المدارس الآن؟",
      answer: "نعم، عملية التسجيل بدأت ويمكنك التواصل معنا لمعرفة التفاصيل الخاصة بكل مدرسة."
    },
    {
      question: "هل يمكنني الحصول على متابعة شخصية؟",
      answer: "بالطبع، جميع خدماتنا تشمل المتابعة الشخصية لكل تلميذ لضمان أفضل النتائج."
    }
  ];
  return (
    <div className="font-sans text-gray-900 scroll-smooth">
      {/* Top Bar */}
      <div className="bg-white border-b text-sm text-gray-700 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-2">
            <div className="flex items-center gap-3 text-xl">
              <a href="#" aria-label="YouTube" className="hover:text-primary"><FontAwesomeIcon icon={faYoutube} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-primary"><FontAwesomeIcon icon={faLinkedin} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-primary"><FontAwesomeIcon icon={faFacebook} /></a>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="flex items-center gap-1">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                أكادير, المغرب
              </span>
              <span className="flex items-center gap-1">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" strokeWidth="2" /><path d="M16 2v4H8V2" strokeWidth="2" /></svg>
                atlastawjih@gmail.com
              </span>
              <span className="flex items-center gap-1">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" strokeWidth="2" /></svg>
                0703244407
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left: Login Button (Hidden on Mobile) */}
            <div className="hidden md:block">
              <Link href="/login">
                <Button size="sm" className="bg-[#0ab99d] hover:bg-[#10a58c] text-white text-md px-6 sm:px-10 py-6 sm:py-8 font-bold cursor-pointer">
                  ←  دخول
                </Button>
              </Link>
            </div>

            {/* Right: Logo, Navigation, and Mobile Menu Button */}
            <div className="hidden md:flex items-center gap-8">
              <nav>
                <ul className="flex flex-row-reverse gap-6 font-semibold text-md">
                  <li><a href="#hero" className="hover:text-primary cursor-pointer">الرئيسية</a></li>
                  <li><a href="#team" className="hover:text-primary cursor-pointer">من نحن</a></li>
                  <li><a href="#features" className="hover:text-primary cursor-pointer">خدمتنا</a></li>
                  <li><a href="#pricing" className="hover:text-primary cursor-pointer">باقات</a></li>
                  <li><a href="#contact" className="hover:text-primary cursor-pointer">اتصل بنا</a></li>
                </ul>
              </nav>
              <Link href="/">
                <img src="/images/logo/logo.png" alt="Logo" className="h-16 sm:h-20 w-auto" />
              </Link>
            </div>

            {/* Mobile: Centered logo only */}
            <div className="flex w-full md:hidden justify-center items-center">
              <Link href="/">
                <img src="/images/logo/logo.png" alt="Logo" className="h-16 sm:h-20 w-auto" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
            <div className="flex flex-col items-center gap-4 py-4 border-t">
              <nav className="w-full">
                <ul className="flex flex-col items-center gap-4 font-semibold text-md">
                  <li className="hover:text-primary cursor-pointer w-full text-center py-2">الرئيسية</li>
                  <li className="hover:text-primary cursor-pointer w-full text-center py-2">من نحن</li>
                  <li className="hover:text-primary cursor-pointer w-full text-center py-2">خدمتنا</li>
                  <li className="hover:text-primary cursor-pointer w-full text-center py-2">باقات</li>
                  <li className="hover:text-primary cursor-pointer w-full text-center py-2">اتصل بنا</li>
            </ul>
              </nav>
              <Link href="/login" className="w-full">
                <Button size="sm" className="bg-[#0ab99d] hover:bg-[#10a58c] text-white text-md px-6 py-6 font-bold cursor-pointer w-full">
                  ←  دخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-white to-green-100 py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center text-right">
            <img src="/images/hero/hero-1.png" className="w-full h-auto" />
          <div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-relaxed mb-4">
              لماذا تحتاج إلى توجيه دراسي
              <br />
              <span className="text-primary">للحصول على شهادة البكالوريا؟</span>
            </h1>
              <p className="mb-6 text-lg sm:text-2xl">نحن هنا لمساعدتك على تحديد أهدافك التعليمية ومرافقتك في جميع مراحل دراستك.</p>
              <Button size="lg" className="bg-[#0ab99d] hover:bg-[#10a58c] text-white px-6 sm:px-8 py-6 sm:py-7 font-bold w-full sm:w-auto">ابدأ الآن</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-16 bg-white" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10 text-center">
            # أطلس توجيه... لأن <span className="text-primary underline underline-offset-4 decoration-2">نجاحك</span> هو هدفنا
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className=" bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-check-circle"></i>
              </span>
              <h3 className="text-lg text-center font-bold mb-2 group-hover:text-white transition-colors duration-300">التكفل بالترشيحات الإلكترونية والمتابعة</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                نحن نتولى التسجيل الإلكتروني الأولي والنهائي في المدارس والمعاهد بالمغرب، ونتابع جميع المراحل (لوائح الانتقاء، اللوائح الرئيسية، لوائح الانتظار) ونقوم بإبلاغ المشتركين بالنتائج.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-graduation-cap"></i>
              </span>
              <h3 className="text-lg text-center font-bold mb-2 group-hover:text-white transition-colors duration-300">التسجيل في المنح الدراسية</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                نتولى التسجيل في المنح الدراسية داخل المغرب وخارجه.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-file-alt"></i>
              </span>
              <h3 className="text-lg text-center font-bold mb-2 group-hover:text-white transition-colors duration-300">التحضير للمباريات</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                نوجهكم نحو أفضل مراكز التحضير للمباريات، مع تقديم تخفيضات حصرية تصل إلى 15%.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-paper-plane"></i>
              </span>
              <h3 className="text-lg text-center font-bold mb-2 group-hover:text-white transition-colors duration-300">توجيه حاملي شهادة BAC+2</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                نقوم بمساعدة حاملي دبلومات ما بعد البكالوريا (+2)، مثل DEUG، DEUP، DUT، DEUST لمواصلة دراستهم في مدارس عليا داخل وخارج المغرب.
              </p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-globe"></i>
              </span>
              <h3 className="text-lg text-center font-bold mb-2 group-hover:text-white transition-colors duration-300">التسجيل في برامج الهجرة إلى الولايات المتحدة</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                التسجيل في برامج الهجرة إلى الولايات المتحدة، مع تزويدكم بمعلومات حول المتطلبات والشروط الأساسية.
              </p>
            </div>
            {/* Card 6 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 hover:bg-[#0ab99d] group">
              <span className="bg-[#0ab99d] group-hover:bg-white text-white group-hover:text-[#0ab99d] rounded-full p-4 mb-4 text-3xl transition-all duration-300">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <h3 className="text-lg text-center  font-bold mb-2 group-hover:text-white transition-colors duration-300">الدراسة في فرنسا</h3>
              <p className="text-gray-600 text-center text-md group-hover:text-white transition-colors duration-300">
                تستهدف خدمتنا تلاميذ السنة الثانية من البكالوريا والطلبة (ما فوق الباك) الراغبين في مواصلة دراستهم في فرنسا.
              </p>
              </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-16 bg-gray-100" id="team">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-right">
              <span className="inline-block bg-primary/10 text-primary px-3 sm:px-4 py-1 rounded-full mb-4 text-sm font-semibold">من نحن</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-relaxed">
                وفر وقتك وأموالك باختيار <span className="relative inline-block">
                  <span className="z-10 relative">فريقنا المحترف</span>
                </span>
              </h2>
              <div className="text-gray-700 text-base sm:text-lg space-y-4 mb-6 sm:mb-8">
                <p>
                  في قلب مدينة أكادير، تأسست <span className="font-bold text-primary">Atlas Tawjih</span> برؤية شغوفة من السيد لحسن، بهدف واضح: تمكين التلاميذ من الوصول إلى الفرص الأكاديمية الأرقى داخل المغرب وخارجه.<br />
                  في <span className="font-bold text-primary">Atlas Tawjih</span> نحن نفق كجسر إلى آفاق لا حدود لها، ونقدم أكثر من مجرد توجيه.
                </p>
                <p>
                  نؤمن بأن كل تلميذ وتلميذة يستحق الوصول إلى أفضل الفرص. لذلك، نقوم بتمهيد الطريق لهم من خلال دعم متكامل في اختيار التخصصات، التسجيل في الجامعات، والمتابعة الشخصية لكل تلميذ وتلميذة؛ نرشدهم في كل خطوة ليصلوا إلى أحلامهم بأمان وثقة، سواء كان الهدف هو التميز في مؤسسات مغربية أو الانفتاح على تجارب دولية.
                </p>
                <p>
                  واليوم، مع استمرار <span className="font-bold text-primary">Atlas Tawjih</span> في الازدهار، تظل دعوتنا: ثق بنا لنكون بوصلة في عالم مليء بالفرص. انضم إلينا في صياغة قصة نجاحك، لأن أحلامك معنا لا تعرف حدودًا.
                </p>
              </div>
              <Button size="lg" className="bg-[#0ab99d] text-white px-6 sm:px-8 py-6 sm:py-7 font-bold w-full sm:w-auto">تواصل معنا ←</Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-col gap-4">
                <img src="/images/team/team1.jpg" alt="Team member 1" className="rounded-xl w-32 sm:w-40 h-40 sm:h-56 object-cover shadow-lg" />
                <img src="/images/team/team3.jpeg" alt="Team member 2" className="rounded-xl w-32 sm:w-40 h-40 sm:h-56 object-cover shadow-lg" />
              </div>
              <img src="/images/team/team2.png" alt="Main team" className="rounded-xl w-48 sm:w-64 h-[280px] sm:h-[370px] object-cover shadow-2xl ml-4" />
          </div>
          </div>
        </div>
      </section>

      {/* phone number contact Section */}
      <section
        id="contact"
        className="relative w-full h-[300px] sm:h-[400px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/slicer/slicer.jpeg')", // Adjust filename as needed
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#23374d]/80"></div>
        {/* Decorative SVGs (top-left, top-right, bottom-right, etc.) */}
        <svg className="absolute left-6 top-6 w-8 h-8 text-primary" fill="none" viewBox="0 0 32 32">
          <path d="M4 16a12 12 0 0 1 12-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <svg className="absolute right-0 top-0 w-64 h-32" viewBox="0 0 300 100" fill="none">
          <path d="M0,100 Q150,-50 300,100" stroke="#06b89d" strokeWidth="4" fill="none"/>
        </svg>
        <svg className="absolute right-16 bottom-8 w-16 h-6" viewBox="0 0 64 12" fill="none">
          <path d="M0,6 Q8,0 16,6 T32,6 T48,6 T64,6" stroke="#fff" strokeWidth="2" fill="none"/>
        </svg>
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8" viewBox="0 0 32 32" fill="none">
          <g>
            <circle cx="16" cy="16" r="2" fill="#fff" />
            <circle cx="16" cy="8" r="2" fill="#fff" />
            <circle cx="16" cy="24" r="2" fill="#fff" />
            <circle cx="8" cy="16" r="2" fill="#fff" />
            <circle cx="24" cy="16" r="2" fill="#fff" />
          </g>
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-7 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 text-white">تواصل معنا عبر الهاتف مباشرة</h2>
          <div className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-widest text-white">0703244407</div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8 sm:py-16 bg-white" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">
            <span>باقات </span>
            <span className="relative text-primary">
              الاشتراك
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-primary/20 rounded-full -z-10"></span>
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: الأداب */}
            <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col items-center">
              <div className="w-full bg-[#F9A825] text-white text-center text-lg font-bold py-2">باقة الآداب</div>
              <div className="w-full bg-[#0ab99d] h-16 rounded-b-[50%] -mb-8"></div>
              <div className="relative flex flex-col items-center w-full px-6 pt-0 pb-8">
                <div className="relative -top-8 mb-2 flex flex-col items-center">
                  <div className="border-2 border-[#F9A825] bg-white rounded-full w-32 h-32 mt-5  flex flex-col items-center justify-center text-3xl font-bold text-primary">
                    <span>1000</span>
                    <span className="text-base font-normal text-gray-700 mt-1">سنويا</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-right mb-5">بكالوريا شعبة علوم إنسانية و آداب</h3>
                <ul className="text-sm mb-6 space-y-2 text-right">
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نحن من يقوم بتسجيلك في المدارس والمنح</li>
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نقوم بالمتابعة والمواكبة الشخصية للتلميذ</li>
                </ul>
                <Button className="bg-[#0ab99d] text-white w-full">اشترك الآن ←</Button>
              </div>
            </div>
            {/* Card 2: العلوم التقنية */}
            <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col items-center">
              <div className="w-full bg-[#F9A825] text-white text-lg text-center  font-bold py-2">باقة العلوم التقنية</div>
              <div className="w-full bg-[#0ab99d] h-16 rounded-b-[50%] -mb-8"></div>
              <div className="relative flex flex-col items-center w-full px-6 pt-0 pb-8">
                <div className="relative -top-8 mb-2 flex flex-col items-center">
                  <div className="border-2 border-[#F9A825] bg-white rounded-full w-32 h-32 mt-5 flex flex-col items-center justify-center text-3xl font-bold text-primary">
                    <span>1500</span>
                    <span className="text-base font-normal text-gray-700 mt-1">سنويا</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-right mb-5">بكالوريا العلوم التقنية (STE & STM)</h3>
                <ul className="text-sm mb-6 space-y-2 text-right">
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نحن من يقوم بتسجيلك في المدارس والمنح</li>
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نقوم بالمتابعة والمواكبة الشخصية للتلميذ</li>
                </ul>
                <Button className="bg-[#0ab99d] text-white w-full">اشترك الآن ←</Button>
              </div>
            </div>
            {/* Card 4: العلوم */}
            <div className="bg-[#23374d] rounded-xl shadow-md overflow-hidden flex flex-col items-center">
              <div className="w-full bg-[#0ab99d] text-white text-lg text-center font-bold py-2">باقة العلوم</div>
              <div className="w-full bg-[#F9A825] h-16 rounded-b-[50%] -mb-8"></div>
              <div className="relative flex flex-col items-center w-full px-6 pt-0 pb-8">
                <div className="relative -top-8 mb-2 flex flex-col items-center">
                  <div className="border-2 border-[#F9A825] bg-white rounded-full w-32 h-32 mt-5 flex flex-col items-center justify-center text-3xl font-bold text-primary">
                    <span>2000</span>
                    <span className="text-base font-normal text-gray-700 mt-1">سنويا</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-right text-white mb-5">بكالوريا علوم فيزيائية، علوم الحياة والأرض، علوم رياضية</h3>
                <ul className="text-sm mb-6 space-y-2 text-right">
                  <li className="flex justify-end gap-2 text-white mb-5"><span>✓</span>نحن من يقوم بتسجيلك في المدارس والمنح</li>
                  <li className="flex justify-end gap-2 text-white mb-5"><span>✓</span>نقوم بالمتابعة والمواكبة الشخصية للتلميذ</li>
                </ul>
                <Button className="bg-[#F9A825] text-white w-full">اشترك الآن ←</Button>
              </div>
            </div>
            {/* Card 3: الاقتصاد */}
            <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col items-center">
              <div className="w-full bg-[#F9A825] text-white text-lg text-center font-bold py-2">باقة الاقتصاد</div>
              <div className="w-full bg-[#0ab99d] h-16 rounded-b-[50%] -mb-8"></div>
              <div className="relative flex flex-col items-center w-full px-6 pt-0 pb-8">
                <div className="relative -top-8 mb-2 flex flex-col items-center">
                  <div className="border-2 border-[#F9A825] bg-white rounded-full w-32 h-32 mt-5 flex flex-col items-center justify-center text-3xl font-bold text-primary">
                    <span>1500</span>
                    <span className="text-base font-normal text-gray-700 mt-1">سنويا</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-right mb-5">.بكالوريا شعبة الاقتصاد والمحاسبة</h3>
                <ul className="text-sm mb-6 space-y-2 text-right">
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نحن من يقوم بتسجيلك في المدارس والمنح</li>
                  <li className="flex justify-end gap-2 text-primary mb-5"><span>✓</span>نقوم بالمتابعة والمواكبة الشخصية للتلميذ</li>
                </ul>
                <Button className="bg-[#0ab99d] text-white w-full">اشترك الآن ←</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-16" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">الأسئلة الشائعة</h2>
          <div className="max-w-8xl mx-auto space-y-3 sm:space-y-4">
            {faqData.map((item, idx) => (
              <div key={idx} className="rounded border overflow-hidden">
                <button
                  className={`w-full flex justify-between items-center px-6 py-4 text-right font-bold text-lg transition focus:outline-none ${
                    openIndex === idx 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-black'
                  }`}
                  onClick={() => {
                    // Toggle open/close for clicked item
                    setOpenIndex(openIndex === idx ? null : idx);
                  }}
                  aria-expanded={openIndex === idx}
                >
                  <span className="text-2xl font-bold">
                    {openIndex === idx ? "−" : "+"}
                  </span>
                  <span>{item.question}</span>
                </button>
                {openIndex === idx && (
                  <div className="bg-white px-6 py-4 text-right text-lg text-[#23374d] border-t">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#232228] pt-8 sm:pt-16 pb-4 mt-8 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <img src="/images/logo/logo.png" alt="Logo" className="h-12 sm:h-16 mb-4 sm:mb-6" />
            <p className="text-white text-center md:text-xl sm:text-base  mb-4 sm:mb-6 leading-relaxed">
              وفر وقتك ومالك باختيار فريقنا المحترف. يضمن مديرنا الفعّال ومستشارونا الأكفاء سير العمل بسلاسة، مما يضمن لكم تجربة فريدة من نوعها مع Atlas Tawjih.<br />
              فريقنا بأكمله بمثابة حلفائكم في هذه الرحلة؛ نحن هنا لنستمع، نفهم، ونفتح آفاقًا جديدة لكم.
            </p>
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
              <a href="#" className="bg-[#393940] hover:bg-primary rounded-full p-3 text-white text-xl transition">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="bg-[#393940] hover:bg-primary rounded-full p-3 text-white text-xl transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="bg-[#393940] hover:bg-primary rounded-full p-3 text-white text-xl transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="bg-[#393940] hover:bg-primary rounded-full p-3 text-white text-xl transition">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          <div className="bg-[#232228] border-t border-[#393940] mt-4 pt-4">
            <p className="text-center text-gray-300 text-xs sm:text-sm">
              Copyright © {new Date().getFullYear()} <span className="text-[#0ab99d] font-bold">Atlas Tawjih</span> | All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AtlasLandingPage;