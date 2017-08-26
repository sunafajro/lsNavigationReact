import React from 'react';
import NavBar from './NavBar';

class Navigation extends React.Component {
  /* описываем первоначальное состояние */
  state = {
    fetchInProgress: false,
    navElements: [],
    fetchError: false,
    fetchErrorText: ''
  }

  componentDidMount () {
    this.setState({ fetchInProgress: true });
    /* запрашиваем список элементов навигации */
    fetch('/site/nav', 
    {
      method: 'POST',
      accept: 'application/json',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      /* проверяем на наличии 200 кода в ответе */
      if (!response.ok) {
        throw Error(response.statusText);
        return response;
      } else {
        return response.json();
      }
    })
    .then(json => {
        this.setState({
          /* проверяем наличие navElements в ответе и помещаем в state */
          navElements: json.navElements ? json.navElements : [],
          /* отключаем состояние загрузки */
          fetchInProgress: false,
          /* на всякий случай сбрасываем ошибки */
          fetchError: false,
          fetchErrorText: '',
        });
    })
    .catch(err => {
      /* если ошибка, выставляем флаг и сохраняем текст ошибки */
      this.setState({
        fetchError: true,
        fetchErrorText: err,
        fetchInProgress: false
      });
    });
  }

  systemLogout = () => {
    window.location.replace('/site/logout');
  }

  render () {
    return (
      <div className="navigation-block">
        {
          this.state.fetchInProgress ?
            <div className="alert alert-warning navigation-loading-alert"><b>Подождите.</b> Загружаем элементы панели...</div>
          :
          this.state.fetchError ?
            <div className="alert alert-danger navigation-loading-alert"><b>Ошибка.</b> Не удалось загрузить элементы панели...</div>
            :
            <NavBar navElements={ this.state.navElements } logout={ this.systemLogout } />
        }
      </div>
    );
  }
}

export default Navigation;
