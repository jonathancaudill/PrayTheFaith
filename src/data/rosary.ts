/** Mystery set id: joy, sorrow, glorious, luminous */
export type MysterySetId = 'joy' | 'sorrow' | 'glorious' | 'luminous';

export interface MysteryItem {
  id: string;
  number: number;
  name: string;
  meditation: string;
  reflection?: string;
}

export const MYSTERY_SETS: Record<MysterySetId, MysteryItem[]> = {
  joy: [
    { id: 'joy_1', number: 1, name: 'The Annunciation', meditation: 'Mary is visited by the Angel Gabriel.', reflection: 'Like the Blessed Mother, we respond with humility and gratefulness to God\'s call.' },
    { id: 'joy_2', number: 2, name: 'The Visitation', meditation: 'Mary visits her cousin Elizabeth.', reflection: 'We bear Christ to others in charity and service.' },
    { id: 'joy_3', number: 3, name: 'The Nativity', meditation: 'Jesus is born in Bethlehem.', reflection: 'We welcome the Lord into our hearts with simplicity.' },
    { id: 'joy_4', number: 4, name: 'The Presentation', meditation: 'Jesus is presented in the Temple.', reflection: 'We offer our lives to God with obedience.' },
    { id: 'joy_5', number: 5, name: 'The Finding in the Temple', meditation: 'The child Jesus is found in the Temple.', reflection: 'We seek the Lord in prayer and in the Church.' },
  ],
  sorrow: [
    { id: 'sorrow_1', number: 1, name: 'The Agony in the Garden', meditation: 'Jesus prays in Gethsemane.', reflection: 'We accept God\'s will in our trials.' },
    { id: 'sorrow_2', number: 2, name: 'The Scourging at the Pillar', meditation: 'Jesus is scourged.', reflection: 'We offer our penances for the conversion of sinners.' },
    { id: 'sorrow_3', number: 3, name: 'The Crowning with Thorns', meditation: 'Jesus is crowned with thorns.', reflection: 'We reject worldly honors and embrace humility.' },
    { id: 'sorrow_4', number: 4, name: 'The Carrying of the Cross', meditation: 'Jesus carries the Cross.', reflection: 'We carry our daily crosses with patience.' },
    { id: 'sorrow_5', number: 5, name: 'The Crucifixion', meditation: 'Jesus dies on the Cross.', reflection: 'We unite our sufferings to His for the salvation of souls.' },
  ],
  glorious: [
    { id: 'glorious_1', number: 1, name: 'The Resurrection', meditation: 'Jesus rises from the dead.', reflection: 'We live in the hope of eternal life.' },
    { id: 'glorious_2', number: 2, name: 'The Ascension', meditation: 'Jesus ascends into heaven.', reflection: 'We set our hearts on things above.' },
    { id: 'glorious_3', number: 3, name: 'The Descent of the Holy Spirit', meditation: 'The Holy Spirit descends upon the Apostles.', reflection: 'We open our hearts to the gifts of the Spirit.' },
    { id: 'glorious_4', number: 4, name: 'The Assumption', meditation: 'Mary is assumed into heaven.', reflection: 'We look to Mary as our model and advocate.' },
    { id: 'glorious_5', number: 5, name: 'The Coronation of Mary', meditation: 'Mary is crowned Queen of Heaven.', reflection: 'We honor the Blessed Mother and ask her prayers.' },
  ],
  luminous: [
    { id: 'luminous_1', number: 1, name: 'The Baptism of Jesus', meditation: 'Jesus is baptized in the Jordan.', reflection: 'We live our baptismal promises with fidelity.' },
    { id: 'luminous_2', number: 2, name: 'The Wedding at Cana', meditation: 'Jesus changes water into wine.', reflection: 'We bring our needs to Jesus through Mary.' },
    { id: 'luminous_3', number: 3, name: 'The Proclamation of the Kingdom', meditation: 'Jesus proclaims the Kingdom of God.', reflection: 'We repent and believe in the Gospel.' },
    { id: 'luminous_4', number: 4, name: 'The Transfiguration', meditation: 'Jesus is transfigured on the mountain.', reflection: 'We seek moments of prayer to behold His glory.' },
    { id: 'luminous_5', number: 5, name: 'The Institution of the Eucharist', meditation: 'Jesus institutes the Holy Eucharist.', reflection: 'We receive the Lord in the Eucharist with devotion.' },
  ],
};

/** Weekday to mystery set (Mon/Sat Joyful, Tue/Fri Sorrowful, Wed/Sun Glorious, Thu Luminous) */
export function getMysteriesForToday(): MysterySetId {
  const day = new Date().getDay(); // 0 Sun, 1 Mon, ...
  if (day === 0 || day === 3) return 'glorious'; // Sun, Wed
  if (day === 1 || day === 6) return 'joy';      // Mon, Sat
  if (day === 2 || day === 5) return 'sorrow';   // Tue, Fri
  return 'luminous'; // Thu
}

export interface PrayerStep {
  id: string;
  title: string;
  body: string;
}

export const SIGN_OF_THE_CROSS: PrayerStep = {
  id: 'sign',
  title: 'Sign of the Cross',
  body: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
};

export const APOSTLES_CREED: PrayerStep = {
  id: 'creed',
  title: 'Apostles\' Creed',
  body: 'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
};

export const OUR_FATHER: PrayerStep = {
  id: 'our_father',
  title: 'Our Father',
  body: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
};

export const HAIL_MARY: PrayerStep = {
  id: 'hail_mary',
  title: 'Hail Mary',
  body: 'Hail Mary, full of grace, the Lord is with thee!\nBlessed art thou among women, and blessed is the fruit of thy womb, Jesus!\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death.',
};

export const GLORY_BE: PrayerStep = {
  id: 'glory_be',
  title: 'Glory Be',
  body: 'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.',
};

export const FATIMA_PRAYER: PrayerStep = {
  id: 'fatima',
  title: 'Fatima Prayer',
  body: 'O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of thy mercy. Amen.',
};

export const HAIL_HOLY_QUEEN: PrayerStep = {
  id: 'hail_holy_queen',
  title: 'Hail Holy Queen',
  body: 'Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us. And after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God. That we may be made worthy of the promises of Christ. Amen.',
};

/** Build the full guided rosary sequence (intro + 5 decades + closing) */
export function buildRosarySteps(): PrayerStep[] {
  const steps: PrayerStep[] = [
    SIGN_OF_THE_CROSS,
    APOSTLES_CREED,
    OUR_FATHER,
    HAIL_MARY,
    HAIL_MARY,
    HAIL_MARY,
    GLORY_BE,
  ];
  for (let decade = 0; decade < 5; decade++) {
    steps.push(OUR_FATHER);
    for (let i = 0; i < 10; i++) steps.push(HAIL_MARY);
    steps.push(GLORY_BE);
  }
  steps.push(HAIL_HOLY_QUEEN);
  steps.push(SIGN_OF_THE_CROSS);
  return steps;
}
