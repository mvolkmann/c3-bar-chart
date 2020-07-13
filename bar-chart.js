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

const colors = d3.schemePaired;
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

// This returns a text color to use on a given background color.
function getTextColor(bgColor) {
  //console.log('bar-chart.js x: bgColor =', bgColor);
  // Convert the hex background color to its decimal components.
  const red = parseInt(bgColor.substring(1, 3), 16);
  const green = parseInt(bgColor.substring(3, 5), 16);
  const blue = parseInt(bgColor.substring(5, 7), 16);

  // Compute the "relative luminance".
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  //console.log('bar-chart.js getTextColor: luminance =', luminance);

  // Use dark text on light backgrounds and vice versa.
  //TODO: Why are colors backwards compared to D3 code?
  return luminance > 0.5 ? 'black' : 'white';
}

const chart = c3.generate({
  axis: {
    x: {
      tick: {
        multiline: false, // prevents wrapping
        rotate: -45
      },
      type: 'category'
    }
  },
  bar: {
    space: 0.2,
    width: {
      ratio: 1 // % of length between ticks
    }
  },
  bindto: '#chart',
  data: {
    colors: {
      scores: d => colors[d.index % colors.length]
    },
    columns: [],
    labels: true, // displays values above bars using same color as bar
    /*
    labels: {
      format: function (index, group) {
        if (group === 'scores') {
          console.log('bar-chart.js x: index =', index);
          const score = document.querySelector('.c3-bar-' + index).__data__
            .value;
          console.log('bar-chart.js x: score =', score);
        }
        return '?';
      }
    },
    */
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
  const newValues = newData.map(d => d.score);
  const oldKeys = oldData.map(d => d.name);
  const unloadKeys = oldKeys.filter(oldKey => !newData[oldKey]);
  chart.load({
    columns: [
      ['names', ...names],
      ['scores', ...newValues]
    ],
    unload: unloadKeys
    /*
    done: () => {
      console.log('bar-chart.js done: entered');
      setTimeout(() => {
        d3.selectAll('.c3-text').each(function (d, index) {
          const barColor = colors[index];
          console.log('bar-chart.js x: barColor =', barColor);
          const textColor = getTextColor(barColor);
          console.log('bar-chart.js x: textColor =', textColor);
          this.style.fill = textColor;
        });
      }, 500);
    }
    */
  });

  //TODO: This is not working!
  chart.axis.max({y: d3.max(newValues)});

  oldData = newData;

  /*
  setTimeout(() => {
    d3.selectAll('.c3-text').style('fill', 'red');
  }, 1000);
  */
}

// Render the first version of the chart.
updateData();
