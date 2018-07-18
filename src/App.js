import { getChartData } from './api';
import './App.css';import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
// import { escapeHTML } from '../util';
// import ToolTip from '../ToolTip';
import { LineChart } from 'react-easy-chart';
import moment from 'moment';
import { timeParse as parse } from 'd3-time-format';
import Scrollspy from 'react-scrollspy';

class App extends PureComponent {
  constructor(props) {
    super(props);
      // Generate multiple lines of data

    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.turnOnRandomData = this.turnOnRandomData.bind(this);
    this.turnOffRandomData = this.turnOffRandomData.bind(this);

    this.updateData = this.updateData.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.toggleState = this.toggleState.bind(this);

    this.data = [
      this.generateData(),
      this.generateData(),
    ];

    const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
    this.state = {
      showToolTip: false,
      windowWidth: initialWidth - 100,
      componentWidth: 300
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  handleResize() {
    this.setState({
      windowWidth: window.innerWidth - 100,
      componentWidth: 600
    });
  }

  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: `${e.screenY - 10}px`,
      left: `${e.screenX + 10}px`,
      y: d.y,
      x: d.x });
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({ top: `${e.y - 10}px`, left: `${e.x + 10}px` });
    }
  }

  mouseOutHandler() {
    this.setState({ showToolTip: false });
  }

  clickHandler(d) {
    this.setState({ dataDisplay: `The amount selected is ${d.y}` });
  }

  generateData() {
    const data = [];
    const xs = [];

    let date = moment('2013-02-08 09:30:26', 'YYYY-MM-DD HH:mm:ss');
    for (let i = 1; i <= 12; i++) {
      xs.push(date.format('D-MMM-YY HH:mm:ss'));
      date = date.add(5, 'second');
    }
    xs.forEach((x) => {
      data.push({ x, y: this.getRandomArbitrary(0, 100) });
    });
    return data;
  }

  turnOnRandomData() {
    this.setState({ randomDataIntervalId: setInterval(this.updateData, 5000) });
  }

  turnOffRandomData() {
    clearInterval(this.state.randomDataIntervalId);
    this.setState({ randomDataIntervalId: null });
  }

  updateData() {
    const parseDate = parse('%d-%b-%y %H:%M:%S');
    this.data.forEach((data) => {
      data.shift();
      let y = this.getRandomArbitrary(17, 68);
      if (y < 0 || y > 100) y = data[data.length - 1].y;
      const date = moment(parseDate(data[data.length - 1].x));
      date.add(5, 'second');
      data.push({ x: date.format('D-MMM-YY HH:mm:ss'), y });
    });

    this.forceUpdate();
  }

  toggleState() {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
        <section id="updateData">
            <h2>Updating the data</h2>
            {(this.state.randomDataIntervalId)
              ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData} />
              : <input type="button" value="Start random data" onClick={this.turnOnRandomData} />}

            <LineChart
              data={this.data}
              datePattern={'%d-%b-%y %H:%M:%S'}
              xType={'time'}
              xTicks={10}
              width={this.state.componentWidth}
              height={this.state.componentWidth / 2}
              interpolate={'cardinal'}
              yDomainRange={[0, 100]}
              axisLabels={{x: 'Total Revenue', y: 'January'}}
              axes
              grid
              style={{
                '.line0': {
                  stroke: 'green'
                }
              }}
            />

          </section>
        </p>
      </div>
    );
  }
}

export default App;
