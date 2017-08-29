import React from 'react';
import PropTypes from 'prop-types';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session_time: this.createTimer(),
      formatted_time: '15:00'
    }
  }
  /* метод задает начальный 15 минутный интервал */
  createTimer = () => {
    let d = new Date();

    d.setMinutes(15);
    d.setSeconds(0);
    
    return new Date(d);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick = () => {
    let d = this.state.session_time;
    if (d.getMinutes() > 0 || d.getSeconds() > 0) {
      d = d.setSeconds(d.getSeconds() - 1);
      let time = new Date(d);

      this.setState({
        session_time: time,
        formatted_time: this.computedTime(time)
      });
    } else {
      this.props.logout();
    }
  }
  
  computedTime = (time) => {
    return this.addZero(time.getMinutes()) + ':' + this.addZero(time.getSeconds());
  }

  addZero = (num) => {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }

  render () {
    return (
      <li
        style={{ padding: '13px 10px' }}
      >
        <span
          className="label label-default"
          title="Время до автоматического выхода из системы"
        >
          { this.state.formatted_time }
        </span>
      </li>
    );
  }
}

/* проверяем props */
Timer.propTypes = {
    logout: PropTypes.func.isRequired
  }

export default Timer;
