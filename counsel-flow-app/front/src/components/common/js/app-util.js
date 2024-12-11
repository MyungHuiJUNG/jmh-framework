// import $ from 'jquery'
export default function AppUtil() {
}

AppUtil.charsetByteLength = 2;

AppUtil.getCharsetByte = function() {
    return AppUtil.charsetByteLength;
};

AppUtil.setCharsetByte = function(charsetByteLength) {
    AppUtil.charsetByteLength = charsetByteLength;
};

AppUtil.isOnlyNumber = function(string) {
    if (AppUtil.isEmpty(string))
        return false;

    const regExp = /[^\d]/i;
    return !(regExp.test(string));
};

AppUtil.getOnlyNumber = function (str) {
    if (AppUtil.isEmpty(str))
        return "";

    str = str + "";
    str = str.replace(/-/g, "");
    str = str.replace(/ /g, "");
    str = str.replace(/:/g, "");

    return str;
};

//현재 일자를 반환한다. 2016-09-15
AppUtil.getCurrentDate = function() {
    let newDate = new Date();
    let year = newDate.getFullYear().toString();
    let mm = (newDate.getMonth() + 1).toString();
    let dd = (newDate.getDate()).toString();
    return year + "-" + (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

//현재 일시를 반환한다. 2018-09-15 12:12:14
AppUtil.getCurrentDateTime = function() {
    return AppUtil.getCurrentDate() + " " + AppUtil.getCurrentTimeSeconds();
};

//인자의 (+,- Day)를 계산하여 일자를 반환한다.
AppUtil.getDateByCalculateDay = function(calculateDay) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + calculateDay);
    const yyyy = newDate.getFullYear().toString();
    const mm = (newDate.getMonth() + 1).toString();
    const dd = (newDate.getDate()).toString();
    return yyyy + "-" + (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

AppUtil.getCurrentYear = function() {
    let newDate = new Date();
    return newDate.getFullYear().toString();
};

AppUtil.getCurrentTime = function() {
    let newDate = new Date();
    return AppUtil.leftPad(newDate.getHours()+"", "0", 2) + ":" + AppUtil.leftPad(newDate.getMinutes()+"", "0", 2);
};

AppUtil.getCurrentTimeSeconds = function() {
    let newDate = new Date();
    return AppUtil.leftPad(newDate.getHours()+"", "0", 2) + ":" + AppUtil.leftPad(newDate.getMinutes()+"", "0", 2) + ":" + AppUtil.leftPad(newDate.getSeconds()+"", "0", 2)
};

//문자열을 치환한다.
AppUtil.replaceStr = function(str, delimeter1, delimeter2) {
    let s_Data = "";
    let s_Tmp = str;
    let i = s_Tmp.indexOf(delimeter1);
    while (i !== -1) {
        s_Data = s_Data + s_Tmp.substring(0,i) + delimeter2;
        s_Tmp = s_Tmp.substring(i+delimeter1.length);
        i = s_Tmp.indexOf(delimeter1);
    }
    return s_Data + s_Tmp;
};

// left trim
AppUtil.ltrim = function(text, trim) {
    if (trim === undefined)
        trim = '\\s';

    return text.replace(new RegExp("^[" + trim + "]*"), '');
};

// right trim
AppUtil.rtrim = function(text, trim) {
    if (trim === undefined)
        trim = '\\s';

    return text.replace(new RegExp("[" + trim + "]*$"), '');
};

AppUtil.rtrimDelimiter = function(str, separator) {
    let val = str;
    if (typeof(str) === "undefined" || str === "") return "";

    for (let i = str.length; i >= 0; i--) {
        if (str.charAt(i - 1) === separator) {
            val = str.substr(0, i-1);
        }
    }
    return val;
};

// trim
AppUtil.trim = function(text, trim) {
    return AppUtil.ltrim(AppUtil.rtrim(text, trim), trim);
};

// Byte return
AppUtil.getByte = function(str) {
    if(AppUtil.isEmpty(str)) {
        return 0;
    }
    let t;
    let argumentStringLength = 0;
    let l = str.length;
    for(let i = 0; i < l; i++ ) {
        t = str.charAt( i );
        if ( escape( t ).length > 4 ) {
            argumentStringLength += AppUtil.getCharsetByte();
        } else {
            argumentStringLength++;
        }
    }
    return argumentStringLength;
};

//왼쪽으로 지정한 개수만큰 지정한 문자열로 체운다.
AppUtil.leftPad = function(str, chr, cnt) {
    let temp = "";
    for (let i=0; i<(cnt-str.length); i++) {
        temp += chr;
    }
    return temp + str;
};

//오른쪽으로 지정한 개수만큰 지정한 문자열로 체운다.
AppUtil.rightPad = function(str, chr, cnt) {
    let temp = "";
    for (let i=0; i<(cnt-str.length); i++) {
        temp += chr;
    }

    return str+temp;
};

//초를 시간으로 리턴
AppUtil.secondToTime = function(sec) {
    let v_sec = parseFloat(sec);
    if(isNaN(v_sec)) return "";
    let v_temp		    = Math.round(v_sec);
    let v_hour_temp 	= Math.floor(v_temp / 3600);
    let v_minute_temp	= Math.floor(v_temp % 3600 / 60);
    let v_second_temp	= v_temp % 60;
    if(v_hour_temp < 10) v_hour_temp = '0'+v_hour_temp;
    if(v_minute_temp < 10) v_minute_temp = '0'+v_minute_temp;
    if(v_second_temp < 10) v_second_temp = '0'+v_second_temp;
    return v_hour_temp + ':' + v_minute_temp + ':' + v_second_temp;
};

AppUtil.removeNumberMask = function(str){
    let retVal = "";
    str = "" + str;
    if (str == null || str === "") return retVal;
    for (let i = 0; i < str.length; i++) {
        if (AppUtil.isOnlyNumber(str.charAt(i)) || (i === 0 && str.charAt(i) === "-") || str.charAt(i) === ".") {
            retVal += str.charAt(i);
        }
    }
    return retVal;
};

AppUtil.isEmpty = function(str) {
    return str === undefined || str === null || str === "null" ||  str === "undefined" || str === "" || str.length === 0;
};

// Deprecated
AppUtil.isExits = function(str) {
    return AppUtil.isEmpty(str) === false;
};

AppUtil.isExist = function(str) {
    return AppUtil.isEmpty(str) === false;
};

//숫자만 입력되었는지 체크한다.
AppUtil.isOnlyNumber = function(string) {
    if(AppUtil.isEmpty(string)) return false;
    let regExp 	= /[^\d]/i;
    return !(regExp.test(string));
};

AppUtil.convertTimeStampToDate = function(timeStamp) {
    const date = new Date();
    date.setTime(timeStamp);
    return date.getFullYear() + "-" + AppUtil.leftPad(1 + date.getMonth()+"", "0", 2) + "-" + AppUtil.leftPad(date.getDate()+"", "0", 2);
};

AppUtil.convertTimeStampToTime = function(timeStamp) {
    const date = new Date();
    date.setTime(timeStamp);
    return AppUtil.leftPad(date.getHours()+"", "0", 2) + ":" + AppUtil.leftPad(date.getMinutes()+"", "0", 2) + ":" + AppUtil.leftPad(date.getSeconds()+"", "0", 2);
};

AppUtil.convertTimeStampToFormat = function(timeStamp, format, dateConcatSymbol, timeConcatSymbol, dateToTimeConcatSymbol) {
    if(timeStamp == null) {
        return;
    }
    dateConcatSymbol = dateConcatSymbol != null ? dateConcatSymbol : "";
    timeConcatSymbol = timeConcatSymbol != null ? timeConcatSymbol : "";
    dateToTimeConcatSymbol = dateToTimeConcatSymbol != null ? dateToTimeConcatSymbol : "";

    const date = new Date(timeStamp);
    let year = format.indexOf("yyyy") !== -1 ? date.getFullYear() : "";
    let month = format.indexOf("MM") !== -1 ? AppUtil.leftPad(date.getMonth() + 1 + "", "0", 2) : "";
    let day = format.indexOf("dd") !== -1 ? AppUtil.leftPad(date.getDate() + "", "0", 2) : "";
    let hour = format.indexOf("HH") !== -1 ? AppUtil.leftPad(date.getHours() + "", "0", 2) : "";
    let minute = format.indexOf("mm") !== -1 ? AppUtil.leftPad(date.getMinutes() + "", "0", 2) : "";
    let seconds = format.indexOf("ss") !== -1 ? AppUtil.leftPad(date.getSeconds() + "", "0", 2) : "";

    year = year !== "" ? year + dateConcatSymbol : year;
    month = month !== "" ? month + dateConcatSymbol : month;
    hour = hour !== "" ? hour + timeConcatSymbol : hour;
    minute = minute !== "" ? minute + (seconds !== "" ? timeConcatSymbol : "") : minute;

    return year + month + day + dateToTimeConcatSymbol + hour + minute + seconds;
};

AppUtil.getDateListBetweenDates = function(endDate, startDate) {
    const listDate = [];
    const dateMove = new Date(startDate);

    let strDate = startDate;
    if(startDate === endDate) {
        strDate = dateMove.toISOString().slice(0,10);
        listDate.push(strDate);
    } else {
        while (strDate < endDate) {
            strDate = dateMove.toISOString().slice(0,10);
            listDate.push(strDate);
            dateMove.setDate(dateMove.getDate() + 1);
        }
    }

    return listDate;
};

// 앞에서부터 Byte로 자르기, 한글 3Byte도 인식
// AppUtil.cutByte = function(str, maxSize) {
//     for(let b = i = 0; c = str.charCodeAt(i);) {
//         b += c >> 11 ? 3 : c >> 7 ? 2 : 1;
//         if(b > maxSize)
//             break;
//
//         i++;
//     }
//
//     return str.substring(0, i);
// };

AppUtil.callPromiseFunctionsWithItems = function(items, promiseFunc) {
    return items.reduce(function(sequence, item) {
        return sequence.then(function() {
            return promiseFunc(item);
        });
    }, Promise.resolve());
};

// HTML 태그를 제거하고 Text를 반환한다.
AppUtil.removeHtmlTag = function(value) {
    const div = document.createElement("div");
    div.innerHTML = value;
    return div.textContent || div.innerText || "";
};

AppUtil.import = function(loadImport, func) {
    AppPopup.showBlock(null, "body", "", true);

    loadImport
        .then(function(result) {
            AppPopup.hideBlock(null, "body");
            func(AppUtil.clone(result.default));
        })
        .catch(function(error) {
            AppPopup.hideBlock(null, "body");
            console.error(error);
        });
};

// AppUtil.imports = function(loadImports, func) {
//     AppPopup.showBlock(null, "body", "", true);
//
//     Promise.all(loadImports)
//         .then(function(results) {
//             AppPopup.hideBlock(null, "body");
//
//             const passResults = [];
//             results.forEach(function(result) {
//                 passResults.push(AppUtil.clone(result.default));
//             });
//             func(passResults);
//         })
//         .catch(function(error) {
//             AppPopup.hideBlock(null, "body");
//             console.error(error);
//         });
// };

// AppUtil.clone = function(obj) {
//     return $.extend(true, {}, obj);
// };

AppUtil.convertObjectToEntityUrlParam = function (object) {
  let convertUrlParam = "";
  let count = 0;
  if (!AppUtil.isEmpty(object)) {
    for (const [key, value] of Object.entries(object)) {
      if (count > 0)
        convertUrlParam += "&"

      convertUrlParam += `entity.${key}=${value}`
      count++;
    }
  }

  return convertUrlParam;
}

AppUtil.isIEBrowser = function() {
    return !!document.documentMode;           // Internet Explorer 6-11
};

AppUtil.isEdgeBrowser = function() {
    return !AppUtil.isIEBrowser() && !!window.StyleMedia;    // Edge 20+
};

AppUtil.isSafari = function() {
    return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
};
