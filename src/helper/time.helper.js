export const currentYear = new Date().getFullYear();
export const currentMonth = new Date().getMonth();

export const fromNowYear = Array.from({ length: currentYear + 1- 2020 }, (_, i) => 2020 + i);
