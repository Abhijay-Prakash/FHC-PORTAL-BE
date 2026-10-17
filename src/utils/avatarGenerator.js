// Self-contained SVG portraits keep generated profile images reliable without
// depending on a third-party avatar service staying online.
const portraits = {
  male: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8f0f7"/><stop offset="1" stop-color="#c9d9e8"/></linearGradient><linearGradient id="coat" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#344b63"/><stop offset="1" stop-color="#1e3045"/></linearGradient></defs>
    <circle cx="128" cy="128" r="128" fill="url(#bg)"/><path d="M38 256c5-48 33-76 72-87h36c39 11 67 39 72 87" fill="url(#coat)"/><path d="m96 168 32 34 32-34-9-15h-46z" fill="#f3f5f7"/><path d="m116 197 12 13 12-13-6-8h-12z" fill="#bf8c61"/><path d="M91 87c0-31 15-51 37-51 29 0 42 21 42 53v22H91z" fill="#34271f"/><ellipse cx="128" cy="109" rx="43" ry="51" fill="#c99068"/><path d="M85 101c1-42 16-62 43-62 26 0 42 18 44 50-12-5-19-16-22-28-14 16-39 24-65 23z" fill="#34271f"/><path d="M105 110h10m26 0h10" stroke="#47372f" stroke-width="4" stroke-linecap="round"/><path d="M118 139q10 8 20 0" fill="none" stroke="#81543f" stroke-width="3" stroke-linecap="round"/><path d="M116 125q12 7 24 0" fill="none" stroke="#a76e50" stroke-width="2"/><path d="M105 105q6-4 12 0m22 0q6-4 12 0" fill="none" stroke="#49372d" stroke-width="3" stroke-linecap="round"/><path d="m93 181 35 31-25 28-27-42zm70 0-35 31 25 28 27-42z" fill="#f5f7f9"/><path d="M128 211v45" stroke="#91a6b8" stroke-width="3"/><circle cx="128" cy="228" r="3" fill="#dce4eb"/><circle cx="128" cy="244" r="3" fill="#dce4eb"/>
  </svg>`,
  female: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f3edf2"/><stop offset="1" stop-color="#ded0df"/></linearGradient><linearGradient id="coat" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#46536a"/><stop offset="1" stop-color="#29354b"/></linearGradient></defs>
    <circle cx="128" cy="128" r="128" fill="url(#bg)"/><path d="M38 256c5-48 33-76 72-87h36c39 11 67 39 72 87" fill="url(#coat)"/><path d="m96 168 32 34 32-34-9-15h-46z" fill="#f7f4f5"/><path d="m116 197 12 13 12-13-6-8h-12z" fill="#c99068"/><path d="M78 117c-8-52 4-83 34-91 41-12 72 18 68 76l-9 45-16-11-5-60c-21 15-46 19-70 15l-2 43-12 9z" fill="#352a33"/><ellipse cx="128" cy="109" rx="41" ry="50" fill="#d39a76"/><path d="M88 101c7-38 28-57 57-49 17 5 28 19 31 43-20-3-36-13-44-27-12 18-26 28-44 33z" fill="#352a33"/><path d="M105 110h10m26 0h10" stroke="#4b3941" stroke-width="4" stroke-linecap="round"/><path d="M118 139q10 8 20 0" fill="none" stroke="#905b52" stroke-width="3" stroke-linecap="round"/><path d="M116 125q12 7 24 0" fill="none" stroke="#b47860" stroke-width="2"/><path d="M105 105q6-4 12 0m22 0q6-4 12 0" fill="none" stroke="#514047" stroke-width="3" stroke-linecap="round"/><path d="m93 181 35 31-25 28-27-42zm70 0-35 31 25 28 27-42z" fill="#f7f4f5"/><path d="M128 211v45" stroke="#a99baa" stroke-width="3"/><circle cx="128" cy="228" r="3" fill="#ece5ed"/><circle cx="128" cy="244" r="3" fill="#ece5ed"/>
  </svg>`,
};

export const normalizeGender = (gender) => String(gender || '').trim().toLowerCase();

export const generateAvatar = (_name, gender) => {
  const portrait = normalizeGender(gender) === 'male' ? portraits.male : portraits.female;
  return `data:image/svg+xml;base64,${Buffer.from(portrait).toString('base64')}`;
};
