<?php
/**
 * Hedab Al-Khaleej Contracting (شركة هضاب الخليج للمقاولات)
 * Enterprise Dynamic SEO, Canonical & Semantic HTML Pre-Renderer
 * Official Domain: https://hedabkh.com.sa
 */

// 1. Determine Requested Path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedUrl = parse_url($requestUri);
$path = rtrim($parsedUrl['path'] ?? '/', '/');
if ($path === '') {
    $path = '/';
}

$baseUrl = 'https://hedabkh.com.sa';
$canonicalUrl = ($path === '/') ? $baseUrl . '/ar' : $baseUrl . $path;

// Detect language (default 'ar')
$isEn = (strpos($path, '/en') === 0);
$locale = $isEn ? 'en' : 'ar';

// Default Metadata
$title = $isEn 
    ? 'Gulf Hills Contracting | Leading Infrastructure & Public Utilities Contractors in Saudi Arabia'
    : 'شركة هضاب الخليج للمقاولات | رواد مقاولات البنية التحتية، سفلتة الطرق وتصريف السيول في السعودية';

$description = $isEn
    ? 'Gulf Hills Contracting - Approved national contractor for road paving, bridges, flood mitigation, New Jersey barrier manufacturing and government facilities operation across Saudi Arabia.'
    : 'شركة هضاب الخليج العربي للمقاولات - الشريك المعتمد في مقاولات البنية التحتية، سفلتة الطرق، تصريف السيول، تصنيع حواجز نيوجيرسي الخرسانية، وتشغيل وصيانة المرافق في المملكة العربية السعودية.';

$keywords = $isEn
    ? 'Gulf Hills Contracting, general contracting Saudi Arabia, infrastructure Riyadh, road paving, stormwater drainage networks, New Jersey precast barriers, facility maintenance, MOMRA contractor'
    : 'هضاب الخليج للمقاولات, مقاولات بنية تحتية, سفلتة طرق, تصريف سيول, حواجز نيوجيرسي خرسانية, صيانة مرافق, بلديات, مقاولات السعودية, الرياض, تصنيف المقاولين';

$image = $baseUrl . '/images/hero-bg.webp';
$ogType = 'website';
$semanticBody = '';

// ==============================================================================
// 2. Semantic Content Generators for All Routes
// ==============================================================================

if ($path === '/' || $path === '/ar' || $path === '/en') {
    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">شركة هضاب الخليج للمقاولات | رواد مقاولات البنية التحتية في السعودية</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">شركة رائدة ومصنفة سيادياً في تنفيذ مشاريع الطرق والكباري، تصريف السيول ودرء أخطار الفيضانات، تصنيع حواجز نيوجيرسي الخرسانية، وتشغيل وصيانة المباني والمرافق العامة لصالح كبرى الوزارات والهيئات الحكومية بالمملكة العربية السعودية.</p>
            </header>
            <section style="margin-top: 30px;">
                <h2 style="font-size: 1.8rem; color: #F59E0B;">مجالات الاختصاص والخدمات السيادية</h2>
                <ul style="font-size: 1.1rem; line-height: 2; color: #CBD5E1;">
                    <li><strong>تشغيل وصيانة المباني الحكومية:</strong> إدارة المرافق، الصيانة الوقائية، والأنظمة الإلكتروميكانيكية المتكاملة.</li>
                    <li><strong>إنشاء وتطوير شبكات تصريف مياه الأمطار والسيول:</strong> مد أنابيب خرسانية حتى 2400 ملم وتشييد مصائد وقنوات السيول.</li>
                    <li><strong>إصلاح وصيانة الطرق والشبكات الأرضية:</strong> كشط وسفلتة الطرق بأحدث كاشطات فيرتغن، تركيب البردورات والإنترلوك.</li>
                    <li><strong>تصنيع وتوريد حواجز نيوجيرسي الخرسانية:</strong> حواجز أمان خرسانية مسبقة الصب معتمدة لوزارة النقل والأمانات.</li>
                    <li><strong>إزالة عناصر التشوه البصري ونقل الهدميات:</strong> عقود نظافة وتسوية الأراضي ونقل الأنقاض للمواقع المعتمدة.</li>
                </ul>
            </section>
        </main>';
    } else {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">Gulf Hills Contracting | Leaders in Infrastructure Contracting in Saudi Arabia</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">Sovereign-classified general contracting firm executing road paving, stormwater drainage networks, precast concrete New Jersey barriers, and government facilities operation across Saudi Arabia.</p>
            </header>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Team Page (/ar/team or /en/team)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/team' || $path === '/en/team') {
    $title = $isEn
        ? 'Executive Leadership & Engineering Team | Gulf Hills Contracting'
        : 'فريق العمل والقيادة التنفيذية | نخبة الخبراء والمهندسين | هضاب الخليج';
    $description = $isEn
        ? 'Meet our executive leadership, certified project directors and engineering team leading major infrastructure operations in Saudi Arabia.'
        : 'كوادر هندسية وإدارية ذات خبرات ميدانية واسعة تزيد عن 20 عاماً لقيادة العمليات الإنشائية بأعلى معايير الحوكمة والجودة والسلامة المهنية.';
    $image = $baseUrl . '/images/team/team-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">فريق العمل والقيادة التنفيذية بشركة هضاب الخليج</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">تضم شركة هضاب الخليج نخبة من الكفاءات الوطنية والخبرات الهندسية والإدارية المتخصصة في إدارة مشاريع البنية التحتية، الطرق، والتشغيل والصيانة الحكومية.</p>
            </header>
            <section style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 8px;">م. أيمن جميل الحاتم</h2>
                    <h3 style="font-size: 1.1rem; color: #38BDF8; margin-bottom: 12px;">الرئيس التنفيذي والمؤسس</h3>
                    <p style="color: #CBD5E1; line-height: 1.7;">خبرة تزيد عن 20 عاماً في إدارة مشاريع الطرق والبنية التحتية الوطنية والإشراف على عقود التجهيزات والتشغيل الحكومية بالمملكة العربية السعودية وفق مستهدفات رؤية 2030.</p>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 8px;">م. طارق م. الشمري</h2>
                    <h3 style="font-size: 1.1rem; color: #38BDF8; margin-bottom: 12px;">مدير مشاريع التشييد والتشغيل</h3>
                    <p style="color: #CBD5E1; line-height: 1.7;">متخصص في إدارة عقود المقاولات الميدانية الكبرى، تشغيل وصيانة المرافق البلدية، وتطوير شبكات تصريف مياه السيول والأمطار في منطقة الرياض والقصيم.</p>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 8px;">م. ياسر أ. الحربي</h2>
                    <h3 style="font-size: 1.1rem; color: #38BDF8; margin-bottom: 12px;">مدير التشغيل وصيانة المعدات</h3>
                    <p style="color: #CBD5E1; line-height: 1.7;">يشرف على تشغيل وإدارة أسطول الآليات والمعدات الثقيلة (كاشطات فيرتغن، شاحنات أكتروس، حفارات كوماتسو) بالبلديات الفرعية والمناطق الإدارية بالأمانات.</p>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 8px;">أ. عبد الرحمن أ. الشهري</h2>
                    <h3 style="font-size: 1.1rem; color: #38BDF8; margin-bottom: 12px;">مدير ضبط الجودة والعلاقات الحكومية</h3>
                    <p style="color: #CBD5E1; line-height: 1.7;">يتابع الالتزام بالمعايير البلدية وتراخيص تصنيف المقاولين وتطبيق اشتراطات الصحة والسلامة المهنية وإدارة شهادات الآيزو (ISO 9001 / 14001 / 45001).</p>
                </article>
            </section>
        </main>';
    } else {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">Executive Leadership & Team | Gulf Hills Contracting</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">Elite team of certified project directors, licensed engineers and operational executives delivering sovereign infrastructure projects across Saudi Arabia.</p>
            </header>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Equipment Page (/ar/equipment or /en/equipment)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/equipment' || $path === '/en/equipment') {
    $title = $isEn
        ? 'Heavy Equipment Fleet & Machinery | Gulf Hills Contracting Fleet'
        : 'أسطول المعدات والآليات الثقيلة | كاشطات، شاحنات، مداحل، حفارات | هضاب الخليج';
    $description = $isEn
        ? 'Modern heavy machinery fleet including Wirtgen cold milling machines, Actros tippers, rollers, Komatsu & CAT hydraulic excavators.'
        : 'أسطول آليات ثقيلة متكامل يضم كاشطات فيرتغن الألمانية، شاحنات أكتروس، مداحل ديناباك، وحفارات كاتربيلر لتنفيذ مشاريع البنية التحتية بدقة متناهية.';
    $image = $baseUrl . '/images/equipment/fleet-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">أسطول المعدات والآليات الثقيلة لشركة هضاب الخليج</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">تمتلك شركة هضاب الخليج للمقاولات أسطولاً متطوراً ومكتملاً من أحدث الآليات والمعدات الثقيلة المجهزة بأحدث أنظمة التوجيه الليزري والتحكم الآلي، لضمان أعلى درجات السرعة والكفاءة والدقة الهندسية في تنفيذ مشاريع الطرق وتصريف السيول.</p>
            </header>
            <section style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 6px;">كاشطة أسفلت ألمانية عالية الدقة (Wirtgen W 2000)</h2>
                    <h3 style="font-size: 1rem; color: #38BDF8; margin-bottom: 10px;">القدرة: عرض كشط 2.0 م وعمق حتى 32 سم (4 وحدات متوفرة)</h3>
                    <ul style="color: #CBD5E1; line-height: 1.8; padding-right: 20px;">
                        <li>نظام ليزري ثلاثي الأبعاد للتحكم التلقائي بمناسيب الكشط وميول الطرق.</li>
                        <li>محرك ديزل كاتربيلر بقوة 433 كيلوواط بقدرة كشط تصل إلى 450 طن/ساعة.</li>
                        <li>سير ناقل هيدروليكي قابل للدوران والارتفاع لتحميل شاحنات الركام مباشرة.</li>
                    </ul>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 6px;">مدحلة ورصاصة أسفلت اهتزازية مزدوجة (Dynapac CC522)</h2>
                    <h3 style="font-size: 1rem; color: #38BDF8; margin-bottom: 10px;">القدرة: وزن تشغيلي 12.5 طن (6 وحدات متوفرة)</h3>
                    <ul style="color: #CBD5E1; line-height: 1.8; padding-right: 20px;">
                        <li>نظام رش مياه مضغوط مزدوج لمنع التصاق الأسفلت بالأسطوانات الفولاذية.</li>
                        <li>تردد وسعة اهتزاز مزدوجة لتحقيق أعلى كثافة دمك مطابقة للمواصفات السعودية.</li>
                        <li>حساسات حرارية مدمجة لقياس درجة حرارة الأسفلت المباشرة أثناء الرص.</li>
                    </ul>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 6px;">حفار هيدروليكي ثقيل لتمديد قنوات السيول (Caterpillar 320D)</h2>
                    <h3 style="font-size: 1rem; color: #38BDF8; margin-bottom: 10px;">القدرة: عمق حفر 6.7 م وسعة باكت 1.2 م³ (8 وحدات متوفرة)</h3>
                    <ul style="color: #CBD5E1; line-height: 1.8; padding-right: 20px;">
                        <li>ذراع مقوى ومخصص لتنزيل وتثبيت مواسير السيول الخرسانية العملاقة.</li>
                        <li>تجهيزات خاصة وتدريع للعمل في الأراضي والطبقات الصخرية القاسية.</li>
                        <li>ملحقات شاكوش هيدروليكي لتكسير الصخور وتهيئة مسارات القنوات.</li>
                    </ul>
                </article>
                <article style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="font-size: 1.4rem; color: #F59E0B; margin-bottom: 6px;">شاحنات قلاب ثقيلة لنقل الأسفلت والركام (Mercedes Actros 4140)</h2>
                    <h3 style="font-size: 1rem; color: #38BDF8; margin-bottom: 10px;">القدرة: حمولة 24 م³ دفع 8x4 (15 وحدة متوفرة)</h3>
                    <ul style="color: #CBD5E1; line-height: 1.8; padding-right: 20px;">
                        <li>صندوق معزول حرارياً للحفاظ على درجة حرارة الخلطات الأسفلتية الساخنة.</li>
                        <li>نظام تتبع GPS وإدارة حركة الأسطول اللحظية وتحديد المواقع.</li>
                        <li>محركات حديثة مطابقة للاشتراطات البيئية لتقليل الانبعاثات.</li>
                    </ul>
                </article>
            </section>
        </main>';
    } else {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">Heavy Equipment Fleet | Gulf Hills Contracting</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">State-of-the-art heavy machinery fleet including Wirtgen cold milling machines, Dynapac vibratory rollers, Caterpillar excavators and Actros dump trucks.</p>
            </header>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// About Page (/ar/about or /en/about)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/about' || $path === '/en/about') {
    $title = $isEn
        ? 'About Us - Gulf Hills Contracting Profile | Vision, Mission & Values'
        : 'من نحن - نبذة عن شركة هضاب الخليج للمقاولات | تاريخنا ورؤيتنا 2030';
    $description = $isEn
        ? 'Learn about Gulf Hills Contracting history, sovereign classifications and commitment to Saudi Vision 2030 infrastructure development.'
        : 'تعرف على شركة هضاب الخليج للمقاولات، تاريخنا في خدمة المشاريع الوطنية والبلدية، تصنيفنا السيادي ورؤيتنا المنسجمة مع رؤية المملكة 2030.';
    $image = $baseUrl . '/images/about/about-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">من نحن | شركة هضاب الخليج للمقاولات</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">تعد شركة هضاب الخليج للمقاولات إحدى الكيانات الوطنية الرائدة في قطاع المقاولات العامة والإنشاءات والبنية التحتية في المملكة العربية السعودية. على مدار سنوات من الخبرة والإنجاز، نفذت الشركة عشرات المشاريع السيادية والحيوية لصالح الوزارات والأمانات والبلديات.</p>
            </header>
            <section style="margin-top: 30px;">
                <h2 style="font-size: 1.8rem; color: #F59E0B;">رؤيتنا ورسالتنا</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #CBD5E1;"><strong>الرؤية:</strong> أن نكون الخيار الأول والشريك الأكثر موثوقية في تنفيذ مشاريع البنية التحتية العملاقة وتطوير المدن والمرافق الحضرية بالمملكة.<br>
                <strong>الرسالة:</strong> تقديم حلول هندسية وإنشائية مبتكرة ومستدامة بأعلى معايير الجودة العالمية والسلامة المهنية، للإسهام الفاعل في تحقيق مستهدفات رؤية المملكة 2030.</p>
            </section>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Services Page (/ar/services or /en/services)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/services' || $path === '/en/services') {
    $title = $isEn
        ? 'Specialized Engineering & Contracting Services | Gulf Hills'
        : 'خدماتنا الهندسية والمقاولات المتخصصة | تشغيل، صيانة، طرق، تصريف سيول | هضاب الخليج';
    $description = $isEn
        ? 'Comprehensive contracting services including government facilities maintenance, stormwater networks, road paving and New Jersey barriers.'
        : 'تشغيل وصيانة المباني الحكومية، شبكات تصريف السيول، كشط وسفلتة الشوارع، تصنيع حواجز نيوجيرسي الخرسانية، ونقل الهدميات.';
    $image = $baseUrl . '/images/services/services-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">خدمات المقاولات المتخصصة بشركة هضاب الخليج</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">نقدم باقة متكاملة من الخدمات الهندسية والميدانية المعتمدة من وزارة الشؤون البلدية والقروية والإسكان.</p>
            </header>
            <section style="margin-top: 30px;">
                <article style="margin-bottom: 25px;">
                    <h2 style="font-size: 1.6rem; color: #F59E0B;">1. تشغيل وصيانة المباني والمرافق الحكومية</h2>
                    <p style="color: #CBD5E1; line-height: 1.8;">إدارة المرافق المتكاملة والصيانة الوقائية والدورية للأنظمة الكهروميكانيكية، التكييف المركزي، وشبكات الإنذار والسلامة.</p>
                </article>
                <article style="margin-bottom: 25px;">
                    <h2 style="font-size: 1.6rem; color: #F59E0B;">2. إنشاء وتطوير شبكات تصريف مياه الأمطار والسيول</h2>
                    <p style="color: #CBD5E1; line-height: 1.8;">تخطيط وتمديد قنوات تصريف المياه الجوفية والسطحية وخطوط الأنابيب الخرسانية المسلحة لدرء أخطار السيول بالأحياء السكنية.</p>
                </article>
                <article style="margin-bottom: 25px;">
                    <h2 style="font-size: 1.6rem; color: #F59E0B;">3. إصلاح وصيانة الطرق وسفلتة الشوارع</h2>
                    <p style="color: #CBD5E1; line-height: 1.8;">أعمال الكشط وإعادة السفلتة بطبقات أسفلتية حرارية مطابقة للمواصفات، تركيب البردورات والإنترلوك وصيانة الإنارة.</p>
                </article>
            </section>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Projects Catalog Page (/ar/projects or /en/projects)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/projects' || $path === '/en/projects') {
    $title = $isEn
        ? 'National & Sovereign Projects Portfolio | Gulf Hills Contracting'
        : 'سجل المشاريع الوطنية والسيادية المنجزة والجارية | شركة هضاب الخليج للمقاولات';
    $description = $isEn
        ? 'Explore 25+ major infrastructure and contracting projects delivered for Saudi ministries and municipal secretariats.'
        : 'استعرض أكثر من 25 مشروعاً سيادياً تم إنجازها لصالح وزارة الحرس الوطني، أمانة منطقة الرياض، أمانة منطقة القصيم وبلدية الخرج.';
    $image = $baseUrl . '/images/projects/projects-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">سجل المشاريع الوطنية لشركة هضاب الخليج للمقاولات</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">نفخر في شركة هضاب الخليج بسجل حافل يضم أكثر من 25 مشروعاً سيادياً كبيراً نُفذت بأعلى معايير الجودة الهندسية والمواصفات البلدية المعتمدة.</p>
            </header>
            <section style="margin-top: 30px;">
                <ul style="font-size: 1.1rem; line-height: 2.2; color: #CBD5E1;">
                    <li><a href="/ar/projects/proj-1" style="color: #38BDF8;">مشروع تشغيل وصيانة مقابر المسلمين بمدينة الرياض (عقد 221139835687)</a> - أمانة منطقة الرياض</li>
                    <li><a href="/ar/projects/proj-2" style="color: #38BDF8;">مشروع صيانة الشوارع نطاق بلدية شرق بريدة (عقد 442129)</a> - أمانة منطقة القصيم</li>
                    <li><a href="/ar/projects/proj-3" style="color: #38BDF8;">مشروع معالجة بلاغات 940 والتشوهات البصرية شمال بريدة (عقد 452126)</a> - أمانة منطقة القصيم</li>
                    <li><a href="/ar/projects/proj-4" style="color: #38BDF8;">مشروع إعادة تهيئة خزانات مياه الصرف والأمطار والشرب</a> - الشؤون الصحية بوزارة الحرس الوطني</li>
                    <li><a href="/ar/projects/proj-5" style="color: #38BDF8;">مشروع تشغيل وصيانة مباني ومرافق بلدية محافظة الخرج (عقد 444/443/116)</a> - بلدية الخرج</li>
                    <li><a href="/ar/projects/proj-8" style="color: #38BDF8;">مشروع صيانة وتشغيل شبكات تصريف السيول ببلدية العزيزية بالرياض (عقد 241039021963)</a></li>
                    <li><a href="/ar/projects/proj-9" style="color: #38BDF8;">مشروع صيانة وتأهيل قنوات تصريف السيول ببلديتي الشفا والحائر (عقد 241039021961)</a></li>
                </ul>
            </section>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Certificates Page (/ar/certificates or /en/certificates)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/certificates' || $path === '/en/certificates') {
    $title = $isEn
        ? 'Certificates, ISO Accreditations & Contractor Classification | Gulf Hills'
        : 'الشهادات والاعتمادات والتصنيف السيادي | آيزو وتصنيف بلدي معتمد | هضاب الخليج';
    $description = $isEn
        ? 'Certified under ISO 9001, ISO 14001, ISO 45001 and accredited by Saudi Ministry of Municipal & Rural Affairs.'
        : 'حاصلون على شهادات الجودة والسلامة والبيئة ISO 9001 / 14001 / 45001 وتصنيف المقاولين المعتمد في السعودية.';
    $image = $baseUrl . '/images/certificates/iso-certificates.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">الشهادات والاعتمادات الرسمية والتصنيف السيادي</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">تلتزم شركة هضاب الخليج للمقاولات بأعلى المعايير والمواصفات التنظيمية والمهنية المعتمدة في المملكة العربية السعودية.</p>
            </header>
            <section style="margin-top: 30px;">
                <ul style="font-size: 1.1rem; line-height: 2; color: #CBD5E1;">
                    <li><strong>شهادات الآيزو العالمية:</strong> ISO 9001 (إدارة الجودة)، ISO 14001 (الإدارة البيئية)، و ISO 45001 (السلامة والصحة المهنية).</li>
                    <li><strong>شهادة تصنيف المقاولين:</strong> معتمدة من وزارة الشؤون البلدية والقروية والإسكان في مجالات الطرق والإنشاءات وصيانة المرافق.</li>
                    <li><strong>شهادة تسجيل ضريبة القيمة المضافة والزكاة:</strong> صادرة من هيئة الزكاة والضريبة والجمارك.</li>
                </ul>
            </section>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Dynamic Projects (/ar/projects/proj-X or /en/projects/proj-X)
// ------------------------------------------------------------------------------
elseif (preg_match('#^/(ar|en)/projects/(proj-\\d+)$#', $path, $matches)) {
    $projLang = $matches[1];
    $projId = $matches[2];
    $pNum = str_replace('proj-', '', $projId);
    $image = $baseUrl . '/images/projects/project-' . $pNum . '.jpg';

    $projectTitlesAr = [
        'proj-1' => 'مشروع تشغيل وصيانة مقابر المسلمين بمدينة الرياض - عقد رقم 221139835687',
        'proj-2' => 'مشروع صيانة الشوارع نطاق بلدية شرق بريدة - كشط وسفلتة وبردورات',
        'proj-3' => 'مشروع معالجة بلاغات 940 والتشوهات البصرية شمال مدينة بريدة',
        'proj-4' => 'مشروع إعادة تهيئة خزانات مياه الصرف والأمطار والشرب بالشؤون الصحية بالحرس الوطني',
        'proj-5' => 'مشروع تشغيل وصيانة مباني ومرافق بلدية محافظة الخرج',
        'proj-6' => 'مشروع تشغيل وصيانة مقبرة غير المسلمين بمدينة الرياض',
        'proj-7' => 'مشروع إزالة عناصر التشوه البصري بالمحاور الرئيسية بمدينة الرياض',
        'proj-8' => 'مشروع صيانة وتشغيل شبكات تصريف السيول ببلدية العزيزية بالرياض',
        'proj-9' => 'مشروع صيانة وتشغيل شبكات تصريف السيول ببلديتي الشفا والحائر بالرياض',
        'proj-10' => 'مشروع نقل وترحيل السيارات المهملة داخل أحياء مدينة الرياض'
    ];

    $pName = $projectTitlesAr[$projId] ?? ('مشروع وطني سيادي رقم ' . $pNum);
    $title = $pName . ' | شركة هضاب الخليج للمقاولات';
    $description = 'تفاصيل ' . $pName . ' المنفذ بواسطة شركة هضاب الخليج للمقاولات بأعلى معايير الجودة والسلامة المعتمدة.';

    $semanticBody = '
    <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
        <header>
            <h1 style="font-size: 2.2rem; color: #0070BA; font-weight: 800;">' . htmlspecialchars($pName) . '</h1>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">مشروع وطني تم تنفيذه وإدارته بواسطة شركة هضاب الخليج للمقاولات وفق أعلى معايير الجودة والسلامة المعتمدة لدى الجهات الحكومية والبلدية بالمملكة العربية السعودية.</p>
        </header>
        <section style="margin-top: 25px;">
            <h2 style="font-size: 1.6rem; color: #F59E0B;">نطاق العمل ومواصفات المشروع</h2>
            <p style="color: #CBD5E1; line-height: 1.8;">يتضمن المشروع تنفيذ الأعمال الميدانية والهندسية الشاملة، تطبيق أنظمة المراقبة الدورية، وتوفير الكوادر الفنية والآليات المتخصصة لضمان استمرارية التشغيل والكفاءة التشغيلية.</p>
        </section>
    </main>';
}

// ------------------------------------------------------------------------------
// Dynamic News Articles (/ar/news/slug or /en/news/slug)
// ------------------------------------------------------------------------------
elseif (preg_match('#^/(ar|en)/news/([a-zA-Z0-9-]+)$#', $path, $matches)) {
    $newsSlug = $matches[2];
    $newsCatalog = [
        'riyadh-infrastructure-road-paving-2026' => [
            'title' => 'هضاب الخليج تعلن إنجاز 75% من أعمال إعادة سفلتة وتأهيل المحاور الرئيسية بمدينة الرياض',
            'desc' => 'أعلنت شركة هضاب الخليج للمقاولات عن تحقيق نسبة إنجاز متقدمة بلغت 75% في أعمال مشروع صيانة وتأهيل الشوارع والمحاور الرئيسية، مع الالتزام بأعلى معايير الجودة وكشط الأسفلت بأحدث المعدات الألمانية.',
            'img' => '/images/projects/project-2.jpg'
        ],
        'iso-certifications-quality-safety-accreditations' => [
            'title' => 'تجديد اعتمادات الآيزو العالمية (ISO 9001 / 14001 / 45001) لشركة هضاب الخليج للمقاولات',
            'desc' => 'أعلنت شركة هضاب الخليج للمقاولات عن تجديد اعتماداتها وشهادات الجودة العالمية بعد اجتياز كافة متطلبات التدقيق الخارجي.',
            'img' => '/images/certificates/iso-certificates.jpg'
        ],
        'technical-specs-precast-new-jersey-barriers' => [
            'title' => 'المواصفات الهندسية لحواجز نيوجيرسي الخرسانية مسبقة الصب المعتمدة في مشاريع الطرق السريعة',
            'desc' => 'تقرير فني شامل يستعرض المعايير الهندسية واختبارات القوة والصلابة لحواجز نيوجيرسي الخرسانية المصنعة لدى هضاب الخليج.',
            'img' => '/images/equipment/fleet-hero.jpg'
        ]
    ];

    if (isset($newsCatalog[$newsSlug])) {
        $n = $newsCatalog[$newsSlug];
        $title = $n['title'] . ' | المركز الإعلامي - هضاب الخليج';
        $description = $n['desc'];
        $image = $baseUrl . $n['img'];

        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.2rem; color: #0070BA; font-weight: 800;">' . htmlspecialchars($n['title']) . '</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">' . htmlspecialchars($n['desc']) . '</p>
            </header>
        </main>';
    }
}

// ------------------------------------------------------------------------------
// Fallback for Other Static Pages (Chairman, Contact, News Listing)
// ------------------------------------------------------------------------------
elseif ($path === '/ar/chairman-message' || $path === '/en/chairman-message') {
    $title = $isEn ? 'Chairman Statement | Gulf Hills Contracting' : 'كلمة رئيس مجلس الإدارة | شركة هضاب الخليج للمقاولات';
    $description = $isEn ? 'A message from our Chairman on our commitment to infrastructure excellence and Saudi Vision 2030.' : 'رسالة رئيس مجلس الإدارة حول التزامنا بالجودة والسلامة والريادة في قطاع المقاولات والبنية التحتية في المملكة.';
    $image = $baseUrl . '/images/about/chairman.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">كلمة رئيس مجلس الإدارة</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">منذ انطلاقة شركة هضاب الخليج للمقاولات، وضعنا نصب أعيننا أن نكون شريكاً فاعلاً في مسيرة البناء والتنمية الشاملة التي تشهدها مملكتنا الحبيبة في ظل قيادتها الرشيدة ورؤية 2030 الطموحة.</p>
            </header>
        </main>';
    }
} elseif ($path === '/ar/contact' || $path === '/en/contact') {
    $title = $isEn ? 'Contact Us & Corporate Inquiries | Gulf Hills Riyadh' : 'اتصل بنا وقنوات التواصل | المقر الرئيسي بالرياض | شركة هضاب الخليج';
    $description = $isEn ? 'Get in touch with Gulf Hills headquarters in Riyadh for tenders, RFPs and contracting partnerships.' : 'تواصل معنا لطلب عروض الأسعار، الاستشارات الهندسية، وبحث الشراكات في مشاريع البنية التحتية والمقاولات.';
    $image = $baseUrl . '/images/contact/contact-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">اتصل بشركة هضاب الخليج للمقاولات</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">يسعدنا التواصل معكم لتلقي طلبات عروض الأسعار والمنافسات واستفسارات مشاريع البنية التحتية والمقاولات العامة.</p>
            </header>
            <section style="margin-top: 20px;">
                <p style="color: #CBD5E1; font-size: 1.1rem;"><strong>المقر الرئيسي:</strong> طريق الملك فهد، الرياض، المملكة العربية السعودية.<br><strong>البريد الإلكتروني:</strong> info@hedabkh.com.sa</p>
            </section>
        </main>';
    }
} elseif ($path === '/ar/news' || $path === '/en/news') {
    $title = $isEn ? 'Media Center & Infrastructure News | Gulf Hills' : 'المركز الإعلامي وآخر الأخبار والتقارير الميدانية | شركة هضاب الخليج';
    $description = $isEn ? 'Read our latest company press releases, milestone announcements and engineering articles.' : 'تابع آخر أخبار مشاريع هضاب الخليج، التقارير التقنية، وتطورات قطاع البنية التحتية والإنشاءات بالمملكة.';
    $image = $baseUrl . '/images/news/news-hero.jpg';

    if (!$isEn) {
        $semanticBody = '
        <main class="semantic-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: Cairo, sans-serif;">
            <header>
                <h1 style="font-size: 2.4rem; color: #0070BA; font-weight: 800;">المركز الإعلامي لشركة هضاب الخليج للمقاولات</h1>
                <p style="font-size: 1.2rem; line-height: 1.8; color: #E2E8F0;">أحدث الأخبار والبيانات الصحفية والتقارير الفنية حول مشاريع البنية التحتية والطرق وشبكات السيول بالمملكة.</p>
            </header>
        </main>';
    }
}

// ==============================================================================
// 3. Alternate Language Links
// ==============================================================================
$oppositeLang = ($locale === 'ar') ? 'en' : 'ar';
$altPath = preg_replace('#^/(ar|en)#', '/' . $oppositeLang, $path);
if ($altPath === $path) {
    $altPath = '/' . $oppositeLang . (($path === '/') ? '' : $path);
}
$arHref = ($locale === 'ar') ? $canonicalUrl : ($baseUrl . $altPath);
$enHref = ($locale === 'en') ? $canonicalUrl : ($baseUrl . $altPath);

// ==============================================================================
// 4. Read and Hydrate index.html Template
// ==============================================================================
$templatePath = __DIR__ . '/index.html';
if (!file_exists($templatePath)) {
    http_response_code(500);
    echo '<!DOCTYPE html><html><head><title>System Error</title></head><body><h1>Template missing</h1></body></html>';
    exit;
}

$html = file_get_contents($templatePath);

// Replace Title & Metadata
$safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$safeDesc = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
$safeKeywords = htmlspecialchars($keywords, ENT_QUOTES, 'UTF-8');
$safeCanonical = htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8');
$safeImage = htmlspecialchars($image, ENT_QUOTES, 'UTF-8');
$safeArHref = htmlspecialchars($arHref, ENT_QUOTES, 'UTF-8');
$safeEnHref = htmlspecialchars($enHref, ENT_QUOTES, 'UTF-8');

$html = preg_replace('/<title>.*?<\\/title>/i', '<title>' . $safeTitle . '</title>', $html, 1);
$html = preg_replace('/<meta name="description" content=".*?"\\s*\\/?>/i', '<meta name="description" content="' . $safeDesc . '" />', $html, 1);
$html = preg_replace('/<link rel="canonical" href=".*?"\\s*\\/?>/i', '<link rel="canonical" href="' . $safeCanonical . '" />', $html, 1);

// Open Graph
$html = preg_replace('/<meta property="og:title" content=".*?"\\s*\\/?>/i', '<meta property="og:title" content="' . $safeTitle . '" />', $html, 1);
$html = preg_replace('/<meta property="og:description" content=".*?"\\s*\\/?>/i', '<meta property="og:description" content="' . $safeDesc . '" />', $html, 1);
$html = preg_replace('/<meta property="og:url" content=".*?"\\s*\\/?>/i', '<meta property="og:url" content="' . $safeCanonical . '" />', $html, 1);
$html = preg_replace('/<meta property="og:image" content=".*?"\\s*\\/?>/i', '<meta property="og:image" content="' . $safeImage . '" />', $html, 1);

// Twitter Cards
$html = preg_replace('/<meta name="twitter:title" content=".*?"\\s*\\/?>/i', '<meta name="twitter:title" content="' . $safeTitle . '" />', $html, 1);
$html = preg_replace('/<meta name="twitter:description" content=".*?"\\s*\\/?>/i', '<meta name="twitter:description" content="' . $safeDesc . '" />', $html, 1);
$html = preg_replace('/<meta name="twitter:image" content=".*?"\\s*\\/?>/i', '<meta name="twitter:image" content="' . $safeImage . '" />', $html, 1);

// Alternates
$html = preg_replace('/<link rel="alternate" hreflang="ar" href=".*?"\\s*\\/?>/i', '<link rel="alternate" hreflang="ar" href="' . $safeArHref . '" />', $html, 1);
$html = preg_replace('/<link rel="alternate" hreflang="en" href=".*?"\\s*\\/?>/i', '<link rel="alternate" hreflang="en" href="' . $safeEnHref . '" />', $html, 1);
$html = preg_replace('/<link rel="alternate" hreflang="x-default" href=".*?"\\s*\\/?>/i', '<link rel="alternate" hreflang="x-default" href="' . $safeArHref . '" />', $html, 1);

// Inject Pre-rendered Semantic HTML inside <div id="root">
if (!empty($semanticBody)) {
    $html = str_replace('<div id="root"></div>', '<div id="root">' . $semanticBody . '</div>', $html);
}

// Send Clean Headers
header('Content-Type: text/html; charset=UTF-8');
header('X-Robots-Tag: all');
echo $html;
