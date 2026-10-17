import type { HymnCatalogEntry } from '../types'
import { acppbAbuCatalog17to66 } from './acppbAbuCatalog17to66'
import { acppbAbuCatalog67to128 } from './acppbAbuCatalog67to128'
import { acppbAbuCatalog129to175 } from './acppbAbuCatalog129to175'
import { acppbAbuCatalog176to224 } from './acppbAbuCatalog176to224'
import { acppbAbuCatalog225to300 } from './acppbAbuCatalog225to300'
import { acppbAbuCatalog301to400 } from './acppbAbuCatalog301to400'
import { enrichAbuCatalog } from './enrichAbuThemes'

/** ACPPB Igbo Abu 1–16 — transcribed from fellowship hymnbook snaps (2025–26). */
const acppbAbuCatalog1to16: HymnCatalogEntry[] = [
  {
    id: 'abu-1',
    number: 1,
    title: 'Nsọ, Nsọ, Nsọ! Chuku-Okike',
    titleEnglish: 'Holy, Holy, Holy, Lord God Almighty.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['holiness', 'Trinity', 'praise', 'worship', 'majesty'],
    scriptureRefs: ['Revelation 4:8'],
    occasion: ['opening', 'praise'],
    firstLine: 'Nsọ, Nsọ, Nsọ! Chuku-Okike',
    englishHymnalRefs: 'Ancient & Modern 160 (A. I); SS&S 122 (U. 122)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 1,
    hymnBookRefs: '(A. I), (U. 122), P.M.',
    scriptureQuoteIgbo: '"Ha adigh-ezu ike ehihie na abali, nasi, Nsọ, Nsọ, Nsọ!" Nkpughe 4. 8.',
    matchProfile:
      'Holy, Holy, Holy, Lord God Almighty — adoration of the triune God, holiness, eternal praise with angels, morning worship.',
    verified: true,
    lyricsIgbo: `Verse 1
Nsọ, Nsọ, Nsọ! Chuku-Okike,
N'isi ututu ayi gabu abu nye Gi;
Nsọ, Nsọ, Nsọ! Onye-ebere,
Atọ nim'Otu, Chuku di ngọzi.

Verse 2
Nsọ, Nsọ, Nsọ! Ndi nsọ neto Gi,
Natuda okpu-ha n'iru oche-eze-Gi;
Cherubim na Serafim nada n'iru Gi,
Onye nọri, nanọ, ganọgide.

Verse 3
Nsọ, Nsọ, Nsọ! Gi di ebube,
Anya ndi-nmehie apugh ihu otuto-Gi;
Ọ bu nani I di nsọ: ọ digh ony'ọzọ
Zur'okè n'ike, na ihu-n'anya.

Verse 4
Nsọ, Nsọ, Nsọ! Chuku-Okike,
Ọlu-Gi dum n'igwé n'uwa geto aha-Gi.
Nsọ, Nsọ, Nsọ! Onye-ebere,
Atọ nim'Otu, Chuku di ngọzi. Amen.`,
  },
  {
    id: 'abu-2',
    number: 2,
    title: 'Nsọ, Nsọ, Nsọ Chuku',
    titleEnglish: 'Holy, Holy, Holy, Lord God of hosts.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['holiness', 'Trinity', 'creation', 'praise', 'worship'],
    scriptureRefs: ['Isaiah 6:3'],
    occasion: ['opening', 'praise'],
    firstLine: 'Nsọ, Nsọ, Nsọ Chuku',
    englishHymnalRefs: 'Ancient & Modern 160 (variant)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 1,
    meter: '7.7.7.7.7.7.',
    scriptureQuoteIgbo: '"Nsọ, nsọ, nsọ, ka Jehova . . . di." Aisaia 6. 3.',
    matchProfile:
      'Holy, Holy, Holy, Lord God of hosts — creation worship, cherubim and seraphim, blessed Trinity, all creation praising God.',
    verified: true,
    lyricsIgbo: `Verse 1
Nsọ, Nsọ, Nsọ Chuku
Eze di mgb'ebigh-ebi,
Ony'igwé n'uwa neto;
Ndi-m'ozi nabu abu,
Neto mgbe ebigh-ebi
Triniti nke di ngọzi.

Verse 2
Gi kere ihe nile,
Na Gi ka ha nadi ndu,
Gi nwe nsọpuru nile:
Ihe nile neto Gi.
Neto mgb'ebigh-ebi
Triniti nke di ngọzi.

Verse 3
Cherubim na Serafim
Ji nku-ha kpuch'iru-ha;
Otụ nazu ibe-ya
Si, Nsọ, Nsọ, Nsọ;
Neto mgb'ebigh-ebi
Triniti nke di ngọzi.

Verse 4
Aleluya! ayi neto
Nna, n'Ọkpara na Mọ Nsọ,
Atọ nim'Otu di nsọ;
Ayi soro usu nd'igwe
Neto mgbe ebigh-ebi
Triniti nke di ngọzi. Amen.`,
  },
  {
    id: 'abu-3',
    number: 3,
    title: "Nna nk'igwe, Nke hur'ayi n'anya",
    titleEnglish: 'Father of heaven, whose love profound',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['Trinity', 'forgiveness', 'salvation', 'grace', 'confession'],
    scriptureRefs: ['1 John 5:7-8'],
    occasion: ['opening', 'confession', 'response'],
    firstLine: "Nna nk'igwe, Nke hur'ayi n'anya",
    englishHymnalRefs: 'Ancient & Modern 135 (A. 135); SS&S 123 (U. 123)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 2,
    hymnBookRefs: '(A. 135), (U. 123), L.M.',
    meter: 'L.M.',
    scriptureQuoteIgbo: "N'ihi na ndi ahu ndi nagba ama di Atọ. 1 Jon 5. 8.",
    matchProfile:
      'Father of heaven, whose love profound — Trinity hymn of redemption: Father’s love, Son the Word and Saviour, Spirit giving life; sinners kneeling for pardon and grace.',
    verified: true,
    lyricsIgbo: `Verse 1
Nna nk'igwe, Nke hur'ayi n'anya,
We cheputar'ayi ngbaputa,
Ayi nd'ọjọ gburu I ikpere;
Biko, gbaghar'ayi njọ nile.

Verse 2
Ọkpara, Okwu Chineke,
Onye-ngbaputa, n'Eze-ayi,
Ayi nd'ọjọ gburu I ikpere;
Wer'amara-Gi zọput'ayi.

Verse 3
Mọ Nsọ nke neme nkpur'obi
K'ọ puta na njọ na ọnwu,
Ayi nd'ọjọ gburu I ikpere;
Nye ayi ike nke ndụ ọhu.

Verse 4
Jehova . . . Nna, Ọkpara, Mọ . . . .
Chineke, Atọ, nim'Otu,
Ayi nd'ọjọ gburu I ikpere;
Gbaghara nmehie, nye ayi ndu. Amen.`,
  },
  {
    id: 'abu-4',
    number: 4,
    title: "Chineke Nna, nk'igwé,",
    titleEnglish: 'Father of heaven above',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['Trinity', 'praise', 'worship', 'God the Father', 'God the Son', 'Holy Spirit'],
    scriptureRefs: ['Revelation 15:4'],
    occasion: ['opening', 'praise'],
    firstLine: "Chineke Nna, nk'igwé,",
    englishHymnalRefs: 'Ancient & Modern (confirm edition)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 3,
    meter: '6s. 4s.',
    scriptureQuoteIgbo: '"Onye nagagh-atu ogwu, Onye-nwe-ayi, to kwa aha-Gi?" Nkpughe 15. 4.',
    matchProfile:
      'Father of heaven above — doxology to Father, Son, and Holy Spirit; light, glory, intercession; all creation praising the triune God forever.',
    verified: true,
    lyricsIgbo: `Verse 1
Chineke Nna, nk'igwé,
Onye bi nim'ihé,
Ony'ebube.
Ihè nenwu nk'uku,
Ihu-n'anya d'ike,
Ony'anaugh-anya,
Ayi neto Gi.

Verse 2
Chineke Ọkpara,
Kraist Onye ghọr'aru,
Onye-nzọta.
Onye nọ n'aka nri
Nna nke di ebube,
Ọnu-nekwuru-ayi,
Ayi neto Gi.

Verse 3
Chineke, Mọ di nsọ,
Onye nenye ayi ndụ,
Onye-nkasi.
Mọ nke amam-ihe,
N'ihu-n'anya n'ike,
Onyinye nke igwé,
Ayi neto Gi.

Verse 4
Madu nile n'uwa
Soro usu nk'igwé
To aha-Ya.
Otuto diri Gi,
Atọ nime Otu,
Rue mgbe ebigh-ebi,
Chuku di nsọ. Amen.`,
  },
  {
    id: 'abu-5',
    number: 5,
    title: 'Chineke Nna zite ngọzi',
    titleEnglish: 'Command Thy blessing from above',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['blessing', 'Trinity', 'worship gathering', 'Word of God', 'Holy Spirit'],
    scriptureRefs: ['Psalm 133:3'],
    occasion: ['opening', 'service of worship'],
    firstLine: 'Chineke Nna zite ngọzi',
    englishHymnalRefs: 'Ancient & Modern 492 (typical)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 4,
    meter: 'L.M.',
    scriptureQuoteIgbo: "N'ebe ahu ka Jehova nyere ngọzi ahu iwu. Abu Ọma 133. 3.",
    matchProfile:
      'Command Thy blessing from above — invocation for worship: Father’s blessing on the congregation, Christ’s truth in hearts, Spirit’s power; united praise to the Trinity.',
    verified: true,
    lyricsIgbo: `Verse 1
Chineke Nna zite ngọzi
Nye ayi, ndi zukọrọ n'ebe a;
Le ayi anya n'ihu-n'anya,
Bụ umu nasọpuru Gi.

Verse 2
Kraist Ọkpara zite ngọzi,
Kwe k'ayi so uzọ-Gi n'ezie;
Me k'Okwu-Gi ba n'obi-ayi,
Nye ayi ike nke ndu ọhu.

Verse 3
Mọ nke di nsọ zite ngọzi,
Wer'ike-Gi mej'ulo nka;
Mukwasi ndi di um'ala,
Kpughere ha amara-Gi.

Verse 4
Chineke, Atọ nim'Otu,
Nna na Ọkpara na Mọ Nsọ,
Eb'ayi nariọ I n'otu obi,
K'ayi fegide Gi mgbe nile. Amen.`,
  },
  {
    id: 'abu-6',
    number: 6,
    title: "Nna di nsọ, nur'olum",
    titleEnglish: 'Holy Father, hear me',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['prayer', 'consecration', 'Holy Spirit', 'personal devotion', 'holiness'],
    scriptureRefs: ['Psalm 63:1'],
    occasion: ['response', 'closing', 'devotion'],
    firstLine: "Nna di nsọ, nur'olum",
    englishHymnalRefs: 'Ancient & Modern 160 (A. 160); SS&S 4 (U. 4)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 4,
    hymnBookRefs: '(A. 160), (U. 4)',
    meter: '6.6.6.6.',
    scriptureQuoteIgbo: 'Chinekem ka I bu, anamachọsi Gi ike. Abu Ọma 63. 1.',
    matchProfile:
      'Holy Father, hear me — personal prayer to Father, Son, and Spirit; desire for nearness, sanctification, and indwelling holiness.',
    verified: true,
    lyricsIgbo: `Verse 1
Nna di nsọ, nur'olum;
Gi bu Onye-nzọtam;
Nanọm nso mgbe nile,
Gi Onye-amara.

Verse 2
Jisus, Onye-nwe-ayi,
Eze ndu n'ebube,
Ka mgbe ahu bia ngwa,
Mgbe m'gada n'iru Gi.

Verse 3
Mọ Nsọ, Onye-nkasi,
Nke bi nime obim,
Mazuru nkpam nile,
Dọruem nso I, mem nke-Gi.

Verse 4
Nsọ, Nsọ, Nsọ,
Bia, arapukwalam;
N'obim nke di ala,
K'I gebi mgbe nile. Amen.`,
  },
  {
    id: 'abu-7',
    number: 7,
    title: "Le, k'obi'ahu gesi di'ocha",
    titleEnglish: 'Eternal Light! Eternal Light!',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['holiness', 'light', 'heaven', 'sin', 'grace', 'Holy Spirit'],
    scriptureRefs: ['1 Timothy 6:16'],
    occasion: ['opening', 'confession', 'meditation'],
    firstLine: "Le, k'obi'ahu gesi di'ocha",
    englishHymnalRefs: 'Ancient & Modern 380 (typical)',
    bookSection: "ATỌ NIM'OTU.",
    bookPage: 5,
    meter: '8.6.8.8.6.',
    scriptureQuoteIgbo: 'Onye . . . nebi nime ihe nke anapugh ibiaru nso. 1 Tim. 6. 16.',
    matchProfile:
      'Eternal Light — longing for purity before God’s presence; saints in glory; sinner approaching through Christ; way opened by the Spirit and the cross.',
    verified: true,
    lyricsIgbo: `Verse 1
Le k'obi'ahu gesi di'ọcha
Nke nabia n'iru Gi;
Nelekwasi ihe nsọ-Gi,
Nañuri ọnu n'obi'utọ
N'iru Gi, Chineke.

Verse 2
Mọ ndi nọ nsọ och'eze-Gi
Nenwe ọnu ahu;
Ọ bu nani ha mara ya,
Ebe ha namagh kwa nmehe,
Ha adagh kwa ada.

Verse 3
M'gesi aña, mu b'onye-njọ,
Ony'obi gbachiri,
Bia n'iru Ya, Nke di egwu,
Mọ nkem gesi aña hu Ya:
Ih'anekègh èkè!

Verse 4
Ụzọ di ayi gesi bilie
Ba nim'Ihè ahu:
Otu Àjà nke zur'ezu,
Ike Mọ Nsọ Ony'amara,
Ọnu-nekwuru-ayi.

Verse 5
Ọ bu ndia nakwadebe ayi
Iru ebe-nsọ-Gi,
Umu ọchichiri na njọ
Gebi n'ihè ebigh-ebi
Site n'ihu-n'anya-I. Amen.`,
  },
  {
    id: 'abu-8',
    number: 8,
    title: "Chuku ebigh-ebi, Ony'amam-ihe",
    titleEnglish: 'Immortal, invisible, God only wise.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['God’s nature', 'wisdom', 'majesty', 'praise', 'sovereignty'],
    scriptureRefs: ['1 Timothy 1:17', 'Romans 11:33'],
    occasion: ['opening', 'praise'],
    firstLine: "Chuku ebigh-ebi, Ony'amam-ihe",
    englishHymnalRefs: 'Ancient & Modern 377; SS&S 31 (typical)',
    bookSection: 'CHINEKE NNA.',
    bookPage: 6,
    meter: '11.11.11.11.',
    hymnBookRefs: '11.11.11.11. (II.II.II.II.)',
    scriptureQuoteIgbo:
      'Ma Eze nke mgbe nile, Nke anapugh imebi emebi . . . nsopuru na otuto diri Ya . . .',
    matchProfile:
      'Immortal, invisible, God only wise — praise of the unseen eternal God, light inaccessible, hidden in light; human life like grass before His unchanging glory.',
    verified: true,
    lyricsIgbo: `Verse 1
Chuku ebigh-ebi, Ony'amam-ihe,
Oke ihè-Gi kpudoro anya-ayi;
Gi nw'otuto n'ike, Nna di mgbe ochie;
Ayi neto aha-Gi, Onye nwe nmeri.

Verse 2
Gi ji ike n'uche, nachi ihe dum;
Ihè-Gi ji nwayọ nenwu n'el'uwa;
Ez'ikpe-Gi kasi ihe dum elu;
Gi bu Onye nwe ihu-n'anya uku.

Verse 3
Gi nenye ọra madu ume na ndu;
Ndu ahu nke I nyere bu ndu n'ezie;
Ma dika osisi k'ayi nami nkpuru,
Ayi nanwu nagafe—Ma I nọgide.

Verse 4
Chineke nk'otuto, Nna nke di ngọzi,
Ndi-m'ozi neto kwa Gi n'elu-igwe;
K'ayi nye Gi otuto, Nna nke bu Ihè,
Chuku ebigh-ebi, Ony'amam-ihe. Amen.`,
  },
  {
    id: 'abu-9',
    number: 9,
    title: "Chinekem, I d'itu-n'anya",
    titleEnglish: 'My God, how wonderful Thou art.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['wonder', 'God’s love', 'majesty', 'worship', 'adoration'],
    scriptureRefs: ['Psalm 139:14', 'Romans 11:33'],
    occasion: ['opening', 'praise', 'meditation'],
    firstLine: "Chinekem, I d'itu-n'anya",
    englishHymnalRefs: 'Ancient & Modern 169 (typical)',
    bookSection: 'CHINEKE NNA.',
    bookPage: 7,
    meter: 'C.M.',
    hymnBookRefs: 'C.M.',
    scriptureQuoteIgbo: "K'ewere kwa obi-gi nile . . . hu Jehova, bú Chineke-gi n'anya.",
    matchProfile:
      'My God, how wonderful Thou art — adoration of God’s beauty, mercy, wisdom, and holiness; angels worship; the soul returns love to the living God.',
    verified: true,
    lyricsIgbo: `Verse 1
Chinekem, I d'itu-n'anya,
Ebube-Gi nenwu;
Och'ebere-Gi di nọ nma
Nime oke ihè.

Verse 2
I di egwu, Chineke nkem,
Nna di ebigh-ebi;
Ndi-m'ozi nada n'ukwu-Gi,
Nefè Gi mgbe nile.

Verse 3
Iru-Gi mara nma n'ezie;
Amam-ihe nke-Gi,
Na idi-ocha n'ike-Gi
Di kwa ok'ebube.

Verse 4
Le, ka m'si atu egwu-Gi,
Chineke nke di ndu;
Nefe Gi n'ezi ncheghari
N'olil'anya nk'igwé.

Verse 5
Ka m'hu Gi n'anya, Chineke,
Gi, Onye di ike,
N'ihi na I nariọ n'akam
Ihu-n'anya nk'obim.

Verse 6
Nna nke Jisus, Nna nk'amara,
Ida n'ir'oche-Gi,
Na ilekwasi iru-Gi,
B'ọnụ ebigh-ebi. Amen.`,
  },
  {
    id: 'abu-10',
    number: 10,
    title: "Chineke di nma; n'el'igwé",
    titleEnglish: 'Yes, God is good; in earth and sky.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['goodness of God', 'creation', 'praise', 'thanksgiving', 'nature'],
    scriptureRefs: ['Psalm 33:5', 'Genesis 1'],
    occasion: ['opening', 'praise', 'thanksgiving'],
    firstLine: "Chineke di nma; n'el'igwé",
    englishHymnalRefs: 'Ancient & Modern 683 (typical)',
    bookSection: 'CHINEKE NNA.',
    bookPage: 7,
    meter: 'L.M.',
    scriptureQuoteIgbo: "Uwa juputara n'ebere Jehova.",
    matchProfile:
      'Yes, God is good; in earth and sky — creation declares God’s goodness: sun, stars, birds, rain, hills and sea; all creatures and people praise; goodness through Jesus Christ.',
    verified: true,
    lyricsIgbo: `Verse 1
Chineke di nma; n'el'igwé,
N'akuku nile nke uwa,
K'otutu olu naza, si,
Chuku, Onye ker'ayi, di nma.

Verse 2
Anyanwu nke nag'ije-ya,
Nasmus'ihe nile n'uwa,
Usu mbara nke el'igwé,
Ha dum nasi, Chuku di nma.

Verse 3
Umu-nnunu ndi ji onu
Nabu abu-ha kw'ubochi;
Miri-ozuzo n'ikuku
Nekwu nwayo: Chuku di nma.

Verse 4
Anurum ya nim'ok'ohia,
N'el'ugwu na osimiri;
Ha nile nesonye n'abu,
Nekwus'ike: Chuku di nma.

Verse 5
Ihe nile ekere'eke
Nekwu si, Chineke di nma;
Madu j'onu neto s'ike,
Naza n'abụ: Chuku di nma.

Verse 6
Ayi neso ihe dum nk'uwa
Neto Gi, Onye-amara;
Ma nke ka, n'ihi Jisus Kraist,
Ka ayi gasi, Chuku di nma! Amen.`,
  },
  {
    id: 'abu-11',
    number: 11,
    title: "Chuk'Ony'Okike",
    titleEnglish: 'God, who made the earth',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['creation', 'providence', 'Calvary', 'heaven', 'personal trust'],
    scriptureRefs: ['Genesis 1', 'John 3:16', '2 Kings 4:13'],
    occasion: ['opening', 'all-age', 'thanksgiving'],
    firstLine: "Chuk'Ony'Okike",
    englishHymnalRefs: 'Related to “All things bright and beautiful” / creation hymns (confirm)',
    bookSection: 'CHINEKE NNA.',
    bookPage: 8,
    meter: '5.6.6.4.',
    scriptureQuoteIgbo: 'Le, i werewo nchegbu a nile chegbu onwe-gi bayere ayi.',
    matchProfile:
      'God, who made the earth — Creator of heaven, sun, forest, day and night; gave His Son at Calvary; prayer for God’s care on earth and in heaven.',
    verified: true,
    lyricsIgbo: `Verse 1
Chuk' Ony' Okike
Nke uwa n' el' igwé,
Onye ker' anyanwu,
Nelekọtam.

Verse 2
Onye ker' ohia,
Osisi na nkpuru,
Ehihie n' abali,
Nelekọtam.

Verse 3
Onyr ker' anwu,
Onwa na kakpando,
Mgb' ahuhu biara, Ọ
Nelekọtam.

Verse 4
Ya ziri Nwa Ya
K' Ọ nwua na Kalvari;
Ma m' dabere Ya, Ọ
Gelekọtam.

Verse 5
Mgbe m' ruru n' igwe,
Ma hu ndi-eyi-Ya,
M' geso ndi nso bua: O
Lekotaram! Amen.`,
  },
  {
    id: 'abu-12',
    number: 12,
    title: "Abu nke ndi-m' ozi nada",
    titleEnglish: 'Angel voices, ever singing.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['worship', 'heaven', 'offering', 'Trinity', 'service'],
    scriptureRefs: ['Revelation 5:11-13', 'Romans 12:1'],
    occasion: ['opening', 'offertory', 'praise'],
    firstLine: "Abù nke ndi-m' ozi nad à",
    englishHymnalRefs: 'Ancient & Modern 550 (typical)',
    bookSection: 'CHINEKE NNA.',
    bookPage: 9,
    meter: '8.5.8.5.8.4.3.',
    scriptureQuoteIgbo:
      "Gi onwe-gi kère ihe nile, ọ bu kwa n'ihi ọchichọ-Gi ka ha diri, ka ekè-kwa-ra ha èkè.",
    matchProfile:
      'Angel voices, ever singing — heavenly worship unceasing; earth joins with heart, voice, and gifts; praise to Father, Son, and Holy Spirit.',
    verified: true,
    lyricsIgbo: `Verse 1
Abù nke ndi-m' ozi nad à
N' och' eze-I mgbe dum;
Ọkpukpọ-ubọ ndi-m' ozi
Enwegh iz' ike;
Ha di ndu nani igọzi I,
N' ikwuputa I
Nna nk' ike.

Verse 2
Gi Nke bi n' ebe di anya
Kari k' ayi gahu;
Ọ gabu na I nege nti
N' abu ndi-nmehie?
Ayi pur' ima n' I nọ nsọ ayi,
N' I gahu ayi?
É, n' ezie!

Verse 3
É, ayi mara n' I nañuri
N'olu-Gi nile;
I ker' aka, n' olu na nti,
Inye I otuto;
Olu ndi-nka, n' olu abu,
Jikọrọnu
Ito Gi.

Verse 4
Chuku, n' ulo-Gi k' ayi neche
Ihe-Gi n' iru I;
Ayi ji ekwesigh-ekwesi
Newetara Gi
Obi, n' uche, n' aka, n' olu,
N' abù-ayi n' ike
Kasi nma.

Verse 5
Nsopuru, otuto n' ike,
Gabu nke-I mgbe dum:
Nna, na Okpara, na Mọ Nsọ,
Atọ nim' Otù;
Ihe kasi nma nk' I nyere,
Uwa n' igwé
Nenye Gi. Amen.`,
  },
  {
    id: 'abu-13',
    number: 13,
    title: "Aha Jisus di ok' utọ",
    titleEnglish: 'How sweet the name of Jesus sounds',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['Jesus', 'comfort', 'salvation', 'praise', 'hope'],
    scriptureRefs: ['Philippians 2:9-11', 'Acts 4:12'],
    occasion: ['opening', 'response', 'meditation'],
    firstLine: "Aha Jisus di ok' utọ",
    englishHymnalRefs: 'Ancient & Modern 148; SS&S (typical)',
    bookSection: 'CHINEKE OKPARA.',
    bookPage: 10,
    matchProfile:
      'How sweet the name of Jesus sounds — the name that soothes grief, heals the broken heart, refuge and treasure; Jesus as Lord, life, and way; praise until death.',
    verified: true,
    lyricsIgbo: `Verse 1
Aha Jisus di ok' utọ
Na nti onye kwere;
Ọ nakasi ya n' ahuhu,
Nachupu egwu-ya

Verse 2
Ọ nagwo ọria nkpur' obi,
Najur' obi nsọgbu;
Ọ bu nri nke onye-agu,
Nenye izu-ike.

Verse 3
Nkume ebe m' wuru ulom,
Otam n' Ebe-ngbabam;
Ulo- àkùm di mgbe nile,
Juputa n' amara.

Verse 4
Jisus, Eyim, Onye nazum,
Ezem, Ony' ozizim,
Onye-nwem, na Ndum na Uzom,
Nar' otuto m' ji bia.

Verse 5
Obim jiker' ike adigh,
Echichem jur' oyi;
Ma mgbe m' gahu Gi k' I si di,
Aghaghm itozu Gi.

Verse 6
Ka m' kwusa ihu-n' anya-Gi,
Site n' ikem niile;
K' Aha-Gi nke tọkar' utọ
Nye obim ndu n'onwu. Amen.`,
  },
  {
    id: 'abu-14',
    number: 14,
    title: "N'Aha nke Kraist Jisus",
    titleEnglish: 'At the name of Jesus.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['Jesus', 'name of Christ', 'kingship', 'holiness', 'mission'],
    scriptureRefs: ['Philippians 2:9-11', 'Colossians 3:17'],
    occasion: ['opening', 'response', 'mission'],
    firstLine: "N'Aha nke Kraist Jisus",
    englishHymnalRefs: 'At the name of Jesus (A&M / SS&S)',
    bookSection: 'CHINEKE OKPARA.',
    bookPage: 11,
    hymnBookRefs: '(u. 61 (N.H.))',
    meter: '6.5.6.5.D.',
    scriptureQuoteIgbo: "N'Aha Jisus ka ikpere nile we gbue n'ala.",
    matchProfile:
      'At the name of Jesus — every knee and tongue confess Christ as Lord; honour the name; make Jesus King in the heart; crown Him Lord of all.',
    verified: true,
    lyricsIgbo: `Verse 1
N' Aha nke Kraist Jisu
K'ọra gb' ikpere,
Ire dum kwuputa
Eze nk' otuto;
Ọ nato Nna utọ
K' ayi kpo Y' Onye-nw' ayi,
Onye site na mbu
Bur' Okwu d' ike.

Verse 2
O si n' igwé we bia
K' Ọ we new Aha
N' onu ndi-njọ nile,
Ndi nke Ọ biara.
O bur' Aha ahu
Nke nenwegh ntupo,
Weta Ya na nmeri
N' ilugbu ọnwu.

Verse 3
Umu-nnem, tue Y' aha
Nim' ihu-n' anya,
Ma me ya n' it' egwù,
N' obi di' um' ala;
O b' Onye-nzoputa.
Jisus Onye-nw' ayi;
Ony' ora ganefè,
Nenye nsopuru.

Verse 4
Me Ya Eze n' obi;
Kwe ka O chupu
Ihe dum nadigh nso,
Na ihe b' ugha;
Me Ya Onye-isi
N' oge onwunwa;
K' uche-Ya duz' unu
N' ike na ihè.

Verse 5
Umu-nnem, Jisus a
Gabia kwa ozo,
N' otuto nke Nna-Ya,
N' usu ndi-m' ozi;
Okpu-eze nile
Ha gabu nke-Ya;
Obi-ayi gakpo Ya
Eze nk' otuto. Amen`,
  },
  {
    id: 'abu-15',
    number: 15,
    title: 'Gi bu Uzo',
    titleEnglish: 'Thou art the way, to Thee alone.',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['Jesus', 'Way Truth Life', 'salvation', 'sanctification', 'discipleship'],
    scriptureRefs: ['John 14:6', 'John 1:1', 'John 11:25'],
    occasion: ['opening', 'response', 'teaching'],
    firstLine: 'Gi bu Uzo—Ọ bu na Gi',
    englishHymnalRefs: 'Ancient & Modern 185 (typical)',
    bookSection: 'CHINEKE OKPARA.',
    bookPage: 12,
    meter: 'C.M.',
    scriptureQuoteIgbo: 'Mu onwem bu uzọ, na ezi-okwu, na ndu.',
    matchProfile:
      'Thou art the Way, to Thee alone — Christ as Way, Truth, and Life; access to the Father only through Him; Word purifies; resurrection power over death.',
    verified: true,
    lyricsIgbo: `Verse 1
Gi bu Uzo—Ọ bu na Gi
K' ayi nagbanari njọ;
Onye o bula gacho Nna,
Gacho Ya nime Gi.

Verse 2
Gi b' Ezi—okwu—okwu—Gi
Nenye amam—ihe;
Gi nwer' ike inye uche,
Me k' obi di ọcha.

Verse 3
Gi b' ezi Ndụ—nbilite—Gi
Nekwusa nmeri—Gi;
Ndi tukwasiri Gi obi
Gbanari onwu.

Verse 4
Gi b' Uzọ, Ez' okwu, na Ndụ;
K' ayi mar' Uzọ ahu,
Jid' Ez' okwu, new Ndụ ahu,
N' onụ ebigh-ebi. Amen.`,
  },
  {
    id: 'abu-16',
    number: 16,
    title: 'Jisus, uwem di ebube',
    titleEnglish: 'Jesus, Thy blood and righteousness',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['righteousness', 'atonement', 'assurance', 'heaven', 'grace'],
    scriptureRefs: ['Romans 3:22-26', '2 Corinthians 5:21', '1 John 1:7'],
    occasion: ['response', 'communion', 'assurance'],
    firstLine: 'Jisus, uwem di ebube',
    englishHymnalRefs: 'Ancient & Modern 85; SS&S (typical)',
    bookSection: 'CHINEKE OKPARA.',
    bookPage: 12,
    meter: 'L.M.',
    scriptureQuoteIgbo: 'Jehova bu ezi omume-ayi.',
    matchProfile:
      'Jesus, Thy blood and righteousness — clothed in Christ’s merit; confidence before God; victory over death; gospel proclaimed to the world.',
    verified: true,
    lyricsIgbo: `Verse 1
Jisus, uwem di ebube
B' ez' omume n' obara-Gi;
Mgbe uwa nile gagb' oku,
Agamanuri kwa onu.

Verse 2
Ndu na onwu enwegh ike
Imebi uw' ebube nkem;
Uwe oma Jisus nenye
Nadi ohu rue mgbe nile.

Verse 3
Mgbe m' si n'onwu, bilie ije
N' ulo omam di n' el' igwe;
Mgb' ahu, ngopum nile gabu:
Jisus di ndu, nwu kwa n' ihim.

Verse 4
N' uboch' ahu m' gagh-at' ujo,
Onye pur' ibom ebubo?
Obara Jisus newepu
Nkocha, n' ihere nke nmehiem.

Verse 5
Ka ndi nwur' anwu nur' olu-I;
Jisus, gwa ndi nke-Gi nuria;
Obara-I n' ezi-omume-I
Bu uwe ebube nke ha.

Verse 6
Chuku nk' ihu-n' anya n' ike,
Kwe k' uwa mara ebere-I;
Ka okwu nke-Gi gbasa kwa,
Meri onwu na oku-mo. Amen.`,
  },
]

/** Full Abu catalogue (1–400). */
export const acppbAbuCatalog: HymnCatalogEntry[] = enrichAbuCatalog([
  ...acppbAbuCatalog1to16,
  ...acppbAbuCatalog17to66,
  ...acppbAbuCatalog67to128,
  ...acppbAbuCatalog129to175,
  ...acppbAbuCatalog176to224,
  ...acppbAbuCatalog225to300,
  ...acppbAbuCatalog301to400,
])
