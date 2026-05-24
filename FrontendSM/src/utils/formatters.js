// ===== Formatter Utilities =====

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToWords(num) {
    if (num === 0) return 'Zero Only';
    if (!num || isNaN(num)) return '';
    num = Math.floor(Number(num));
    if (num < 0) return 'Minus ' + numberToWords(-num);

    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let words = '';
    if (crore) words += numberToWords(crore).replace(/ Only$/, '') + ' Crore ';
    if (lakh) words += numberToWords(lakh).replace(/ Only$/, '') + ' Lakh ';
    if (thousand) words += numberToWords(thousand).replace(/ Only$/, '') + ' Thousand ';
    if (hundred) words += ones[hundred] + ' Hundred ';
    if (remainder) {
        if (words) words += 'and ';
        if (remainder < 20) {
            words += ones[remainder];
        } else {
            words += tens[Math.floor(remainder / 10)];
            if (remainder % 10) words += ' ' + ones[remainder % 10];
        }
    }
    return (words.trim() + ' Only').replace(/\s+/g, ' ');
}

const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh',
    'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth',
    'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth',
    'Twentieth', 'Twenty First', 'Twenty Second', 'Twenty Third', 'Twenty Fourth',
    'Twenty Fifth', 'Twenty Sixth', 'Twenty Seventh', 'Twenty Eighth',
    'Twenty Ninth', 'Thirtieth', 'Thirty First'];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export function dateToWords(dateStr) {
    if (!dateStr) return '____________';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '____________';
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    // Convert year to words
    const century = Math.floor(year / 100);
    const rem = year % 100;
    let yearWords = '';
    if (century === 20) yearWords = 'Two Thousand';
    else if (century === 19) yearWords = 'Nineteen Hundred';
    else yearWords = numberToWords(century).replace(/ Only$/, '') + ' Hundred';

    if (rem > 0) {
        if (century === 20 && rem < 20) {
            yearWords += ' and ' + ones[rem];
        } else if (century === 20) {
            yearWords += ' and ' + tens[Math.floor(rem / 10)];
            if (rem % 10) yearWords += ' ' + ones[rem % 10];
        } else {
            if (rem < 20) yearWords += ' ' + ones[rem];
            else {
                yearWords += ' ' + tens[Math.floor(rem / 10)];
                if (rem % 10) yearWords += ' ' + ones[rem % 10];
            }
        }
    }

    return `${ordinals[day] || day} ${month} ${yearWords.trim()}`;
}

const romanToWordMap = {
    'Nursery': 'Nursery',
    'LKG': 'LKG',
    'UKG': 'UKG',
    'I': 'First',
    'II': 'Second',
    'III': 'Third',
    'IV': 'Fourth',
    'V': 'Fifth',
    'VI': 'Sixth',
    'VII': 'Seventh',
    'VIII': 'Eighth',
    'IX': 'Ninth',
    'X': 'Tenth',
    'XI': 'Eleventh',
    'XII': 'Twelfth'
};

export function classToWords(cls) {
    if (!cls) return '';
    return romanToWordMap[cls] || cls;
}
