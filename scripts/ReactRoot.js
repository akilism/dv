import { default as React, Component } from 'react';
import { default as ReactDOM } from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import R from 'ramda';
import { pad, pad0 } from './lib/pad.js';
import { fill, fill0 } from './lib/fill.js';

import rawData from "../assets/daily-vice.json";
import foundation from "../assets/beyonce-halftime.mp4";

// { "date": "2016-02-18",
//     "url": "/video/we-meet-hannibal-buress-on-todays-daily-vice-021",
//     "image": "https://vice-images.vice.com/images/articles/crops/2016/02/18/we-meet-hannibal-buress-on-todays-daily-vice-021-1455808584-crop_mobile_400.jpg",
//     "runtime": "06:58",
//     "title": "We Talk Stand-Up with Hannibal Buress on Today's 'Daily VICE'",
//     "dek": "We grabbed lunch with the comedian and had a chat about his new special, <i>Comedy Camisado</i>. " }

const weeks = R.splitEvery(7);

const distinctMonths = R.compose(R.pluck('mmt'), R.uniqBy((daily) => {
  return moment(daily.mmt).startOf('month').format("YYYY-MM-DD");
}));

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMonth: 0
    };

    this.moveTimeout = 1000;
    this.autoplayTimeout = 1500;
    this.wm = _.throttle(this.windowMove.bind(this), 500, {leading: false, trailing: true});
  }


  monthArray(mmt) {
    const firstDayOfMonth = moment(mmt).startOf('month').day(),
          lastDayOfMonth = moment(mmt).endOf('month').day(),
          days = Array.from({length: mmt.daysInMonth()}).fill(1).map((v, i) => {
            return moment(mmt).startOf('month').add(i, 'days');
          });

    return weeks(fill0(6 - lastDayOfMonth, pad0(firstDayOfMonth, days)));
  }

  dailyVice(data) {
    data.mmt = moment(data.date);
    return data;
  }

  startHideTimer() {
    const timerId = setTimeout(() => {
      window.removeEventListener("mousemove", this.wm);
    }, this.moveTimeout);
  }

  windowMove() {
    console.log("WINDOW MOVE");
    this.setState({activeDaily: null, hovered: null, timerId: null});
  }

  startTimer(daily) {
    const timerId = setTimeout(() => {
      console.log("setTimeout!!", daily);
      this.startHideTimer();
      window.addEventListener("mousemove", this.wm);
      this.setState({ activeDaily: daily, hovered: null, timerId: null });
    }, this.autoplayTimeout);
    this.setState({ hovered: daily, timerId });
  }

  dailyHover(daily, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const { hovered, timerId } = this.state;

    if(!hovered || hovered.date !== daily.date) {
      this.startTimer(daily);
    }
  }

  dailyOut(daily, evt) {
    evt.stopPropagation();
    const { hovered, timerId } = this.state;

    if(hovered && hovered.date !== daily.date && timerId) {
      console.log("clearTimeout!!", timerId);
      clearTimeout(timerId);
      this.setState({hovered: null, timerId: null});
    }
  }

  dailyClick(daily) {
    this.setState({ activeDaily: daily });
  }

  getDom(month, prevMonth, nextMonth, dailyVices) {
    const monthDom = month.map((week) => {
      const days = week.map((day) => {
        const daily = (day === 0) ? false : R.find((dailyVice) => {
          return day.isSame(dailyVice.mmt);
        }, dailyVices);

        return (day === 0 || !daily) ? (<td className="empty-daily"> </td>) : (
          <td className="daily"
              onMouseOut={ this.dailyOut.bind(this, daily) }
              onMouseMove={ this.dailyHover.bind(this, daily) }
              onClick={ this.dailyClick.bind(this, daily) }>
            <img className="daily-image" src={ daily.image } />
            <div className="daily-copy">
              <span className="daily-date">{ daily.date }</span>
              <h2 className="daily-title">{ daily.title }</h2>
            </div>
          </td>
        );
      });
      return (<tr>{days}</tr>);
    }),
    prevLink = (prevMonth !== false) ? (<span className="month-link" onClick={ () => { this.setState({ activeMonth: prevMonth }); } }>prev</span>) : "",
    nextLink = (nextMonth !== false) ? (<span className="month-link" onClick={ () => { this.setState({ activeMonth: nextMonth }); } }>next</span>) : "";

    return (
      <table className="month">
        <thead>
          <tr>
            <th colSpan="7">{ prevLink }<h3>{ month[1][0].format('MMMM YYYY') }</h3>{ nextLink }</th>
          </tr>
        </thead>
        <tbody>
          { monthDom }
        </tbody>
      </table>
    );
  }

  getOverlay(daily) {
    return (
      <div className="overlay" onClick={ () => { console.log(daily); this.setState({ activeDaily: false }); } }>
        <div className="daily-player">
          <video src={ foundation } controls></video>
          <div className="daily-copy">
              <span className="daily-date">{ daily.date }</span>
              <h2 className="daily-title">{ daily.title }</h2>
              <div className="daily-dek">{ daily.dek }</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { activeDaily, activeMonth } = this.state,
          dailyVices = rawData["daily-vices"].map(this.dailyVice).reverse(),
          months = distinctMonths(dailyVices),
          month = this.monthArray(moment(months[activeMonth])),
          nextMonth = (months.length > activeMonth + 1) ? activeMonth + 1 : false,
          prevMonth = (activeMonth - 1 >= 0) ? activeMonth - 1 : false,
          dom = this.getDom(month, prevMonth, nextMonth, dailyVices),
          overlay = (activeDaily) ? this.getOverlay(activeDaily) : "";

    return (
      <div className="react-root">
        <div className="month">
          { dom }
        </div>
        { overlay }
      </div>
    );
  }
}





