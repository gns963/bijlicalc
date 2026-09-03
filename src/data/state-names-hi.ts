/**
 * Standard Hindi names for Indian states/UTs — objective transliterations,
 * not subjective translation, so usable directly without a native-speaker
 * review pass (unlike computed/billing sentences elsewhere on /hi).
 */
export const STATE_NAME_HI: Record<string, string> = {
  'Andhra Pradesh': 'आंध्र प्रदेश',
  'Arunachal Pradesh': 'अरुणाचल प्रदेश',
  Assam: 'असम',
  Bihar: 'बिहार',
  Chhattisgarh: 'छत्तीसगढ़',
  Goa: 'गोवा',
  Gujarat: 'गुजरात',
  Haryana: 'हरियाणा',
  'Himachal Pradesh': 'हिमाचल प्रदेश',
  Jharkhand: 'झारखंड',
  Karnataka: 'कर्नाटक',
  Kerala: 'केरल',
  'Madhya Pradesh': 'मध्य प्रदेश',
  Maharashtra: 'महाराष्ट्र',
  Manipur: 'मणिपुर',
  Meghalaya: 'मेघालय',
  Mizoram: 'मिज़ोरम',
  Nagaland: 'नागालैंड',
  Odisha: 'ओडिशा',
  Punjab: 'पंजाब',
  Rajasthan: 'राजस्थान',
  Sikkim: 'सिक्किम',
  'Tamil Nadu': 'तमिलनाडु',
  Telangana: 'तेलंगाना',
  Tripura: 'त्रिपुरा',
  'Uttar Pradesh': 'उत्तर प्रदेश',
  Uttarakhand: 'उत्तराखंड',
  'West Bengal': 'पश्चिम बंगाल',
  'Andaman & Nicobar Islands': 'अंडमान और निकोबार द्वीप समूह',
  Chandigarh: 'चंडीगढ़',
  'Dadra & Nagar Haveli and Daman & Diu': 'दादरा और नगर हवेली और दमन और दीव',
  Delhi: 'दिल्ली',
  'Jammu & Kashmir': 'जम्मू और कश्मीर',
  Ladakh: 'लद्दाख',
  Lakshadweep: 'लक्षद्वीप',
  Puducherry: 'पुडुचेरी',
}

/** Falls back to the English name if a state isn't in the map yet. */
export function stateNameHi(englishName: string): string {
  return STATE_NAME_HI[englishName] ?? englishName
}
