// 喜帖內容集中在此，修改文字不需要動到版面程式碼。

export const couple = {
  groom: { en: 'HARRY', zh: '何庭宇' },
  bride: { en: 'WINDY', zh: '李筱筠' },
};

export const date = {
  display: '2026.11.07',
  weekdayEn: 'SATURDAY',
  weekdayZh: '星期六',
};

export const venue = {
  nameZh: '桃園大溪威斯汀酒店',
  nameEn: 'THE WESTIN TAOYUAN DAXI RESORT',
  hall: '豪華宴會廳',
  church: '永恆教堂',
  address: '桃園市大溪區永福里日新路 166 號',
};

export const mapsQuery = `${venue.nameZh} ${venue.address}`;
export const mapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;

export const calendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent('HARRY & WINDY 婚禮')}` +
  '&dates=20261107T023000Z/20261107T070000Z' +
  `&location=${encodeURIComponent(`${venue.nameZh} ${venue.address}`)}` +
  `&details=${encodeURIComponent(
    '10:30 證婚入席｜11:00 證婚儀式（永恆教堂）\n11:40 午宴迎賓｜12:30 午宴開席（豪華宴會廳）\n' +
      'Dress Code：米白・奶茶・咖啡・鵝黃・粉紅\n提早到場有 Candy Bar 與小活動！'
  )}`;

// note：提醒賓客提早到場的小字
export const timeline = [
  {
    time: '10:30',
    zh: '證婚入席',
    en: 'CEREMONY SEATING',
    place: '永恆教堂',
    note: '歡迎提早到場！Candy Bar 與小活動已準備好等您',
  },
  { time: '11:00', zh: '證婚儀式', en: 'CEREMONY', place: '永恆教堂' },
  {
    time: '11:40',
    zh: '午宴迎賓',
    en: 'RECEPTION',
    place: '豪華宴會廳',
    note: '迎賓時段有 Candy Bar 與互動活動，早點來一起同樂',
  },
  { time: '12:30', zh: '午宴開席', en: 'BANQUET', place: '豪華宴會廳' },
];

// Dress Code 色票（取自實體喜帖五朵小花）
export const dressCode = {
  intro: '誠摯邀請您以溫柔的大地暖色系出席，讓這天的每一張合照，都成為最和諧的色調。',
  colors: [
    { zh: '米白', en: 'IVORY', hex: '#EAE1CC', tip: '洋裝、襯衫、針織衫都很適合；請避免全身純白，留給新娘一點小特權。' },
    { zh: '奶茶', en: 'MILK TEA', hex: '#C6B7A3', tip: '奶茶色西裝外套、針織衫或長裙，溫柔又好搭。' },
    { zh: '咖啡', en: 'MOCHA', hex: '#9A795C', tip: '咖啡色西裝、領帶、皮鞋或包包，沉穩有質感。' },
    { zh: '鵝黃', en: 'BUTTER', hex: '#EAD98B', tip: '鵝黃洋裝、襯衫，或用絲巾、領帶點綴，明亮又溫暖。' },
    { zh: '粉紅', en: 'BLUSH', hex: '#E6C3C2', tip: '淡粉色洋裝、襯衫或口袋巾，為合照增添浪漫。' },
  ],
  note: '不需要全身同色，一件單品或配件呼應主題色就很棒！',
  activity: {
    title: 'DRESS CODE 小彩蛋',
    lines: ['穿上主題色出席，記得到拍貼機前留下合照', '截圖上方色卡，挑選當天穿搭時更方便'],
  },
};

// 車程為一般路況估計，假日車多請預留時間
export const traffic = [
  {
    key: 'car',
    titleEn: 'BY CAR',
    titleZh: '自行開車',
    lines: [
      '國道 3 號下「大溪交流道」後，車程約 10–15 分鐘即可抵達。',
      '導航請設定「桃園大溪威斯汀酒店」。假日交流道周邊車多，建議提早出發。',
    ],
  },
  {
    key: 'parking',
    titleEn: 'PARKING',
    titleZh: '停車資訊',
    lines: ['飯店停車場免費停放，賓客可直接駛入停車。', '無須索取或折抵停車券。'],
  },
  {
    key: 'shuttle',
    titleEn: 'SHUTTLE & TRANSIT',
    titleZh: '接駁建議',
    lines: [
      '高鐵桃園站：搭乘計程車約 35–40 分鐘。',
      '台鐵桃園站：搭乘計程車約 30–35 分鐘。',
      '建議親友共乘，或提早叫車出發。',
    ],
  },
];

// 婚紗照：放到 public/photos/，依序命名 01.jpg、02.jpg …（最多 20 張，直式橫式皆可）
// 沒有的檔名會自動略過，不需要修改這裡
const MAX_PHOTOS = 20;
export const photos = Array.from({ length: MAX_PHOTOS }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { src: `photos/${n}.jpg`, thumb: `photos/thumbs/${n}.jpg`, alt: `Harry & Windy 婚紗照 ${i + 1}` };
});
