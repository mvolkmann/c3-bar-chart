/* global c3: false */

const HEIGHT = 300;
const WIDTH = 400;

// Random data will be selected from this array.
const allData = [
  {name: 'apple', colorIndex: 1},
  {name: 'banana', colorIndex: 2},
  {name: 'cherry', colorIndex: 3},
  {name: 'date', colorIndex: 4},
  {name: 'grape', colorIndex: 5},
  {name: 'mango', colorIndex: 6},
  {name: 'peach', colorIndex: 7},
  {name: 'raspberry', colorIndex: 8},
  {name: 'strawberry', colorIndex: 9},
  {name: 'tangerine', colorIndex: 10},
  {name: 'watermelon', colorIndex: 11}
];

const allColors = d3.schemePaired;
let colors = [];
let names = [];
let oldData = [];

// This returns a random integer from 1 to max inclusive.
const random = max => Math.floor(Math.random() * max + 1);

// This returns an array of objects taken from allData.
// A "score" property with a random value from 1 to 10
// is added to each object.
function getRandomData() {
  const count = random(allData.length);
  const shuffled = allData.sort(() => 0.5 - Math.random());
  const data = shuffled.slice(0, count);
  data.sort((f1, f2) => f1.name.localeCompare(f2.name));
  for (const item of data) {
    item.score = random(10);
  }
  return data;
}

const chart = c3.generate({
  axis: {
    x: {
      tick: {
        multiline: false, // prevents word wrapping
        rotate: -45
      },
      type: 'category'
    }
  },
  bar: {
    space: 0.2,
    width: {
      ratio: 1 // 100% of length between ticks
    }
  },
  bindto: '#chart',
  data: {
    colors: {scores: d => colors[d.index]},
    columns: [],
    labels: true, // displays values above bars using same color as bar
    type: 'bar',
    x: 'names'
  },
  legend: {
    show: false
  },
  size: {
    height: HEIGHT,
    width: WIDTH
  }
});

function updateData() {
  const newData = getRandomData();

  names = newData.map(d => d.name);
  colors = newData.map(d => allColors[d.colorIndex]);
  const newValues = newData.map(d => d.score);

  const oldKeys = oldData.map(d => d.name);
  const unloadKeys = oldKeys.filter(oldKey => !newData[oldKey]);
  chart.load({
    columns: [
      ['names', ...names],
      ['scores', ...newValues]
    ],
    unload: unloadKeys
  });

  // This line causes problems with the y axis.
  // Not sure why - 1 is needed here.
  //chart.axis.max({y: d3.max(newValues) - 1});

  // This line causes problems with the y axis.
  // Not sure why C3 thinks the min y value
  // is less than zero when there is only one bar.
  // Not sure why this needs to be set to one instead of zero.
  //chart.axis.min({y: 0});

  oldData = newData;
}

// Render the first version of the chart.
updateData();
