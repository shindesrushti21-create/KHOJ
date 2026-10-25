export type SelfCareLocale = 'en' | 'hi' | 'mr';

export type SelfCareCard = {
  title: string;
  intro?: string;
  points: string[];
  question?: string;
  disclaimer: string;
};

export const SELF_CARE_CONTENT: Record<SelfCareLocale, Record<string, SelfCareCard[]>> = {
  en: {
    eating: [
      { title: 'Iron-friendly ideas', intro: 'Foods that may help you include:', points: ['Dal, rajma, chana, ragi, bajra and jowar.', 'Leafy greens such as palak and methi, til, jaggery in moderation and dates.', 'Eggs, fish or meat if you eat them.', 'Pair these foods with vitamin C sources such as lemon, amla, guava or oranges to help absorption.'], question: 'Could the foods I eat support my iron needs?', disclaimer: 'General information. A doctor or dietitian can personalise this.' },
      { title: 'Things to be mindful of', points: ['Tea or coffee right with meals can reduce iron absorption; you could try spacing them an hour or two away.', 'Very salty or heavily processed foods can add to bloating for some people.', 'Alcohol may affect sleep and mood.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' },
      { title: 'Steady nourishment', points: ['Hydration, regular meals, protein and fibre can support everyday wellbeing.', 'On low-energy days, easy choices might include curd and fruit, a simple dal-rice meal, eggs, or roasted chana, depending on what suits you.', 'For comfort, some people enjoy warm fluids, light meals, or ginger or jeera water if it suits them.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' }
    ],
    rest: [
      { title: 'A gentle rhythm', points: ['A regular wind-down and wake-up routine may make rest feel easier.', 'A gentle walk or comfortable stretching can be an option when it feels right for you.', 'Rest when your body asks for it; movement is optional, and pacing yourself is okay.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' },
      { title: 'Warmth for comfort', points: ['A comfortably warm heat pad on the lower abdomen may feel soothing for cramps.', 'Keep a layer between the heat source and your skin, and take breaks.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' }
    ],
    comfort: [
      { title: 'Period products and hygiene', points: ['Choose period products that feel comfortable and are available to you.', 'Change pads or tampons every 4–8 hours, or sooner if needed; follow the product instructions.', 'Wash hands before and after changing products. Clean reusable products as directed and let them dry fully.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' },
      { title: 'Cramps and mood', points: ['Warmth, gentle movement, rest or a calming activity may feel supportive for some people.', 'Noticing how mood and energy shift over time can help you explain what you are experiencing.', 'If emotions feel hard to manage, consider talking with someone you trust or a health professional.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' }
    ],
    seek: [
      { title: 'When to seek care', points: ['Soaking a pad every hour for several hours.', 'Fainting or feeling at risk of fainting.', 'Severe pain, or bleeding that is very long for you.', 'If you feel unsafe or may harm yourself, seek immediate support from someone nearby or emergency services.'], disclaimer: 'General information. A doctor or dietitian can personalise this.' }
    ]
  },
  hi: {
    eating: [
      { title: 'आयरन से जुड़े भोजन के विचार', intro: 'कुछ खाद्य पदार्थ जो मदद कर सकते हैं:', points: ['दाल, राजमा, चना, रागी, बाजरा और ज्वार।', 'पालक और मेथी जैसी हरी पत्तेदार सब्ज़ियां, तिल, सीमित मात्रा में गुड़ और खजूर।', 'यदि आप खाते हैं तो अंडे, मछली या मांस।', 'आयरन के अवशोषण में मदद के लिए इनके साथ नींबू, आंवला, अमरूद या संतरे जैसे विटामिन C वाले खाद्य लें।'], question: 'क्या मेरा भोजन मेरी आयरन संबंधी ज़रूरतों में मदद कर सकता है?', disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' },
      { title: 'ध्यान रखने योग्य बातें', points: ['भोजन के साथ चाय या कॉफी लेने से आयरन का अवशोषण कम हो सकता है; इन्हें एक-दो घंटे के अंतर से लेना आज़मा सकते हैं।', 'बहुत नमकीन या ज़्यादा प्रोसेस किए हुए खाद्य कुछ लोगों में पेट फूलना बढ़ा सकते हैं।', 'शराब नींद और मनोदशा को प्रभावित कर सकती है।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' },
      { title: 'नियमित पोषण', points: ['पानी पीना, नियमित भोजन, प्रोटीन और फाइबर रोज़मर्रा की सेहत में सहायक हो सकते हैं।', 'कम ऊर्जा वाले दिनों में दही और फल, साधारण दाल-चावल, अंडे या भुना चना जैसे आसान विकल्प चुन सकते हैं, यदि वे आपको सूट करें।', 'आराम के लिए कुछ लोगों को गर्म पेय, हल्का भोजन या अदरक अथवा जीरे का पानी अच्छा लगता है, यदि वह आपको सूट करे।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' }
    ],
    rest: [
      { title: 'एक सहज दिनचर्या', points: ['सोने से पहले शांत होने और जागने का नियमित समय आराम को आसान बना सकता है।', 'जब सही लगे, हल्की सैर या आरामदायक स्ट्रेचिंग एक विकल्प हो सकता है।', 'शरीर को आराम की ज़रूरत लगे तो आराम करें; चलना-फिरना ज़रूरी नहीं और अपनी गति रखना ठीक है।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' },
      { title: 'आराम के लिए गर्माहट', points: ['पेट के निचले हिस्से पर आरामदायक गर्म पैड ऐंठन में सुकून दे सकता है।', 'गर्म चीज़ और त्वचा के बीच कपड़ा रखें और बीच-बीच में विराम लें।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' }
    ],
    comfort: [
      { title: 'मासिक धर्म उत्पाद और स्वच्छता', points: ['ऐसे उत्पाद चुनें जो आरामदायक हों और आपके लिए उपलब्ध हों।', 'पैड या टैम्पॉन हर 4–8 घंटे में, या ज़रूरत पड़ने पर पहले बदलें; उत्पाद के निर्देश मानें।', 'उत्पाद बदलने से पहले और बाद में हाथ धोएं। पुनः उपयोग वाले उत्पाद निर्देशानुसार साफ़ करें और पूरी तरह सुखाएं।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' },
      { title: 'ऐंठन और मनोदशा', points: ['गर्माहट, हल्की गतिविधि, आराम या कोई शांत करने वाली गतिविधि कुछ लोगों को सहायक लग सकती है।', 'समय के साथ मनोदशा और ऊर्जा में बदलाव पर ध्यान देने से अपने अनुभव समझाना आसान हो सकता है।', 'भावनाओं को संभालना कठिन लगे तो किसी भरोसेमंद व्यक्ति या स्वास्थ्य पेशेवर से बात करें।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' }
    ],
    seek: [
      { title: 'कब मदद लें', points: ['कई घंटों तक हर घंटे एक पैड पूरी तरह भीगना।', 'बेहोश होना या बेहोशी का डर लगना।', 'तेज़ दर्द या आपके लिए बहुत लंबे समय तक रक्तस्राव।', 'यदि आप असुरक्षित महसूस करें या खुद को नुकसान पहुंचाने का डर हो, तो तुरंत पास के व्यक्ति या आपातकालीन सेवा से मदद लें।'], disclaimer: 'सामान्य जानकारी। डॉक्टर या आहार विशेषज्ञ इसे आपके अनुसार बता सकते हैं।' }
    ]
  },
  mr: {
    eating: [
      { title: 'लोहयुक्त आहाराच्या कल्पना', intro: 'मदत करू शकणारे काही पदार्थ:', points: ['डाळ, राजमा, हरभरा, नाचणी, बाजरी आणि ज्वारी.', 'पालक व मेथीसारख्या पालेभाज्या, तीळ, मर्यादित गूळ आणि खजूर.', 'तुम्ही खात असल्यास अंडी, मासे किंवा मांस.', 'शोषणास मदत होण्यासाठी यांसोबत लिंबू, आवळा, पेरू किंवा संत्री यांसारखे व्हिटॅमिन C असलेले पदार्थ घ्या.'], question: 'मी खात असलेले पदार्थ माझ्या लोहाच्या गरजांना मदत करू शकतात का?', disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' },
      { title: 'लक्षात ठेवण्यासारख्या गोष्टी', points: ['जेवतानाच चहा किंवा कॉफी घेतल्याने लोहाचे शोषण कमी होऊ शकते; त्यात एक-दोन तासांचे अंतर ठेवून पाहू शकता.', 'खूप खारट किंवा अतिप्रक्रिया केलेले पदार्थ काहींमध्ये पोट फुगणे वाढवू शकतात.', 'मद्यपानाचा झोपेवर आणि मनःस्थितीवर परिणाम होऊ शकतो.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' },
      { title: 'नियमित पोषण', points: ['पाणी पिणे, नियमित जेवण, प्रथिने आणि तंतुमय पदार्थ रोजच्या आरोग्यास मदत करू शकतात.', 'ऊर्जा कमी असलेल्या दिवशी दही आणि फळ, साधे डाळ-भात, अंडी किंवा भाजलेला हरभरा असे सोपे पर्याय निवडू शकता, ते तुम्हाला मानवत असल्यास.', 'आरामासाठी काहींना कोमट पेय, हलके जेवण किंवा आले अथवा जिऱ्याचे पाणी आवडते, ते तुम्हाला मानवत असल्यास.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' }
    ],
    rest: [
      { title: 'सौम्य दिनक्रम', points: ['झोपण्यापूर्वी शांत होण्याची आणि उठण्याची नियमित वेळ आरामासाठी मदत करू शकते.', 'योग्य वाटल्यास हलके चालणे किंवा आरामदायी स्ट्रेचिंग हा पर्याय असू शकतो.', 'शरीराला विश्रांती हवी असल्यास विश्रांती घ्या; हालचाल आवश्यक नाही आणि स्वतःच्या गतीने जाणे ठीक आहे.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' },
      { title: 'आरामासाठी उब', points: ['पोटाच्या खालच्या भागावर आरामदायी गरम पॅड ठेवल्याने कळांमध्ये बरे वाटू शकते.', 'गरम वस्तू आणि त्वचा यांच्यामध्ये कापड ठेवा आणि मध्ये विश्रांती घ्या.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' }
    ],
    comfort: [
      { title: 'पाळीची उत्पादने आणि स्वच्छता', points: ['तुम्हाला आरामदायी वाटतील आणि उपलब्ध असतील अशी पाळीची उत्पादने निवडा.', 'पॅड किंवा टॅम्पॉन दर 4–8 तासांनी, किंवा गरज असल्यास लवकर बदला; उत्पादनाच्या सूचना पाळा.', 'उत्पादन बदलण्यापूर्वी आणि नंतर हात धुवा. पुन्हा वापरता येणारी उत्पादने सूचनेनुसार स्वच्छ करून पूर्ण वाळवा.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' },
      { title: 'कळा आणि मनःस्थिती', points: ['उब, हलकी हालचाल, विश्रांती किंवा शांत करणारी कृती काहींना आधार देऊ शकते.', 'वेळेनुसार मनःस्थिती आणि ऊर्जेतील बदल लक्षात ठेवल्यास तुमचा अनुभव सांगणे सोपे जाऊ शकते.', 'भावना सांभाळणे कठीण वाटल्यास विश्वासू व्यक्तीशी किंवा आरोग्य व्यावसायिकाशी बोला.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' }
    ],
    seek: [
      { title: 'कधी मदत घ्यावी', points: ['काही तास दर तासाला एक पॅड पूर्ण भिजणे.', 'बेशुद्ध पडणे किंवा पडण्याची भीती वाटणे.', 'तीव्र वेदना किंवा तुमच्यासाठी खूप दीर्घकाळ रक्तस्राव.', 'असुरक्षित वाटत असल्यास किंवा स्वतःला इजा होण्याची शक्यता वाटल्यास, जवळच्या व्यक्तीकडून किंवा आपत्कालीन सेवेकडून त्वरित मदत घ्या.'], disclaimer: 'सामान्य माहिती. डॉक्टर किंवा आहारतज्ज्ञ तुमच्यासाठी योग्य मार्गदर्शन करू शकतात.' }
    ]
  }
};
