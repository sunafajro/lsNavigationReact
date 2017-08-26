import React from 'react';
import NavBar from './NavBar';
import ModalMessage from './ModalMessage';
import ModalTask from './ModalTask';

class Navigation extends React.Component {
  /* описываем первоначальное состояние */
  state = {
    fetchInProgress: false,
    navElements: [],
    message: {},
    task: {},
    fetchError: false,
    fetchErrorText: ''
  }

  componentDidMount () {
    this.getInfo();
  }

  /* производит выход пользователя из системы */
  systemLogout = () => {
    window.location.replace('/site/logout');
  }

  /* 
   * открывает модальное окно.
   * сначала выводит сообщения, 
   * потом задачи.
   */
  modalShow = () => {
    if (!$.isEmptyObject(this.state.message)) {
      $('.message-modal').modal('show');
    } else {
      if (!$.isEmptyObject(this.state.task)) {
        $('.task-modal').modal('show');
      }
    }          
  }

  /* закрывает модальное окно */
  modalHide = (type) => {
    $(type).modal('hide');
  }

  getInfo = () => {
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
          /* проверяем наличие данных в ответе и помещаем в state */
          navElements: json.navElements ? json.navElements : [],
          message: json.message ? json.message : {},
          task: json.task ? json.task : {},
          /* отключаем состояние загрузки */
          fetchInProgress: false,
          /* на всякий случай сбрасываем ошибки */
          fetchError: false,
          fetchErrorText: '',
        });
        /* открываем модальное окно сообщения или задачи с секундной задержкой */
        setTimeout(this.modalShow(), 1000);
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
            <div>
              <NavBar navElements={ this.state.navElements } logout={ this.systemLogout } />
              <ModalMessage data={ this.state.message } hide={ this.modalHide } info={ this.getInfo } />
              <ModalTask data={ this.state.task } hide={ this.modalHide } info={ this.getInfo } />
            </div>
        }
      </div>
    );
  }
}

export default Navigation;
