import { default as React, Component } from 'react';
import { default as ReactDOM } from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import R from 'ramda';
import pad0 from './lib/pad.js';
import fill0 from './lib/fill.js';

import rawData from "../assets/daily-vice.json";

// { "date": "2016-02-18",
//     "url": "/video/we-meet-hannibal-buress-on-todays-daily-vice-021",
//     "image": "https://vice-images.vice.com/images/articles/crops/2016/02/18/we-meet-hannibal-buress-on-todays-daily-vice-021-1455808584-crop_mobile_400.jpg",
//     "runtime": "06:58",
//     "title": "We Talk Stand-Up with Hannibal Buress on Today's 'Daily VICE'",
//     "dek": "We grabbed lunch with the comedian and had a chat about his new special, <i>Comedy Camisado</i>. " }

export default class Root extends Component {

  monthArray(mmt) {
    const days = Array.from({length: mmt.daysInMonth()}).fill(1).map((v, i) => {
      return i + 1;
    });

    var firstDayOfMonth = mmt.startOf('month').day();
    var lastDayOfMonth = mmt.endOf('month').day();

    return _.chunk(fill0(6 - lastDayOfMonth, pad0(firstDayOfMonth, days)), 7);
  }

  dailyVices(data) {
    const date = new Date(data.date);
    data.mmt = moment(date);
    return data;
  }


  render() {
    const month = this.monthArray(moment(new Date())),
          dailyVices = rawData.map(dailyVice);
    console.log(dailyVices);
    console.log(month);
    return (
      <div className="month">
        <h3>Feburary</h3>

      </div>
    );
  }
}





