let msg = "hello";

let person = {
  name: "Ayoub",
  school: 1337,
};

console.log(person);

let arr = ["red", "balck", "blue"];

console.log(arr);
console.log(arr[1]);

function hello(msg1, msg2) {
  return msg1 + " " + msg2;
}

let str = hello("sbah", "lkhir");

console.log(str);

console.log(hello("bonjour"));
var s = 'this is a quote "the answer is 42" ';
console.log(s);

s = 'this is a quote "the answer is 42" ';
console.log(s);

arr = ["red", "blue", 122, 3.14, true, [1, 2, 3]];
console.log(arr);

arr = ["black", "beard"];
console.log(arr);

arr.push("red", "blue");
console.log(arr);
removed = arr.pop();
console.log("poped = " + removed);
console.log(arr);

var student = {
  name: "Ayoub",
  age: 21,
  birthdate: "01/01/1999",
  school: "1337",
  projects: [
    "shell",
    "c",
    "c++",
    "network",
    "algorithm",
    "javascript",
    "react",
  ],
  grades: {
    shell: 100,
    c: 100,
    cpp: 100,
    network: 100,
  },
  favoriteQuote: "work hard play hard",
  isMarried: false,
};

student["grades"]["shell"] = 125;
student["new_propriety"] = "2024";
console.log(student);

function getCapitales(country) {
  let capitales = {
    france: "paris",
    maroc: "rabat",
    algerie: "alger",
    tunisie: "tunis",
    espagne: "madrid",
    portugal: "lisbonne",
    italie: "rome",
    angleterre: "londre",
    belgique: "bruxelle",
    allemagne: "berlin",
  };
  return capitales[country];
}

console.log(
  (() => {
    var cap = getCapitales("maroco");
    return cap === undefined ? "capital not found" : cap;
  })()
);

function sumArray(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      sum += arr[i][j];
    }
  }
  return sum;
}
var sum = sumArray([[1, 2], 3, 4, [5, 6, 7], 8]);
console.log("sum = " + sum);


function nestedTernary(num) {
	return num > 0
	  ? "positive"
	  : num === 0
	  ? "zero"
	  : typeof num === "number"
	  ? "number"
	  : "negative";
  }

console.log("0 is " + nestedTernary(0));
console.log("1 is " + nestedTernary(1));
console.log("-1 is " + nestedTernary(-1));
console.log("a is " + nestedTernary("a"));


var date = function (date) {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

console.log(date(new Date()));

var _date = (date) => date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

console.log(_date(new Date()));