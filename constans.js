export const API = 'https://api.996227.com/api'
export const options = {
  // body: JSON.stringify({ foo: "bar" }),

  headers: {
    'User-Agent': 'postmen-request',
    'content-type': 'application/json',
  },
}

export const METHOD = {
  GAP_LOSE: 'GAP_LOSE',
  GAP_WIN: 'GAP_WIN',
  TUY_CHINH: 'TUY_CHINH',
}

export const VAO_TIEN = {
  GAP_LOSE: 'GAP_LOSE',
  GAP_WIN: 'GAP_WIN',
  DANH_TAI: 'DANH_TAI',
  DANH_XIU: 'DANH_XIU',
  DANH_CHAN: 'DANH_CHAN',
  DANH_LE: 'DANH_LE',
}

export const MAPPING = {
  Tài: 'LON',
  Xỉu: 'NHO',
  Chẵn: 'CHAN',
  Lẻ: 'LE',
}

export const LIEN_KET_API = {
  162: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/mbmg',
  TKXSMT75: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnmtmg',
  164: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/mtmg',
  181: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnmbmg',
  176: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnst1p',
  178: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnst2p',
  177: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnst90g',
  173: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/vnst45g',
  182: 'https://www.vnlottery.net/api/front/open/lottery/history/list/5/miba45',
}
