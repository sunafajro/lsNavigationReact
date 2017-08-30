import React from 'react';
import Panel from './Panel';
import ModalMessage from './ModalMessage';
import ModalTask from './ModalTask';
import ModalApproveSale from './ModalApproveSale'; 

class Navigation extends React.Component {
  /* описываем первоначальное состояние */
  state = {
    fetchInProgress: false,
    navElements: [],
    openMessage: false,
    message: {},
    openTask: false,
    task: {},
    openSale: false,
    sale: {},
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
    if (this.state.openMesage !== true || this.state.openTask !== true || this.state.openSale !== true) {
      /* проверяем и последовательно открываем окна */
      if (!$.isEmptyObject(this.state.message)) {
        this.setState({ openMessage: true });
      } else {
        if (!$.isEmptyObject(this.state.task)) {
          this.setState({ openTask: true });  
        } else {
          if (!$.isEmptyObject(this.state.sale)) {
            this.setState({ openSale: true });
          }
        }
      }
    }          
  }

  /* закрывает модальное окно */
  modalHide = (type) => {
    this.setState({ [type]: false });
  }

  /* сбрасывает сообщение, задачу или скидку */
  updateModalData = (type) => {
    this.setState({[type]: {}});
  }

  /* запрашивает данные для панели навигации */
  getInfo = (type = 'all') => {
    /* если нужны только счетчики */
    if (type !== 'counters') {
      this.setState({ fetchInProgress: true });
    }
    const body = JSON.stringify(type);
    /* запрашиваем список элементов навигации */
    fetch('/site/nav', 
    {
      method: 'POST',
      accept: 'application/json',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body
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
        /* если нужны только счетчики */
        if (type === 'counters' && json.cnts) {
          let elements = { ...this.state.navElements };
          elements.messages.cnt = json.cnts.messages;
          elements.tasks.cnt = json.cnts.tasks;
          elements.sales.cnt = json.cnts.sales;
          json.navElements = { ...elements };
        }
        this.setState({
          /* проверяем наличие данных в ответе и помещаем в state */
          navElements: json.navElements ? json.navElements : this.state.navElements,
          message: json.message ? json.message : this.state.message,
          task: json.task ? json.task : this.state.task,
          sale: json.sale ? json.sale : this.state.sale,
          /* отключаем состояние загрузки */
          fetchInProgress: false,
          /* на всякий случай сбрасываем ошибки */
          fetchError: false,
          fetchErrorText: ''
        });
        /* открываем модальное окно сообщения или задачи с секундной задержкой */
        setTimeout(() => this.modalShow(), 1000);
        setTimeout(() => this.getInfo('counters'), 30000);
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
          this.state.fetchError ?
            <div className="alert alert-danger navigation-loading-alert"><b>Ошибка.</b> Не удалось загрузить элементы панели.</div>
            :
            <div>
              <Panel
                navElements={ this.state.navElements }
                logout={ this.systemLogout }
                isFetching={ this.state.fetchInProgress } />
              <ModalMessage
                data={ this.state.message }
                hide={ this.modalHide }
                info={ this.getInfo }
                update={ this.updateModalData }
                open={ this.state.openMessage }
              />
              <ModalTask
                data={ this.state.task }
                hide={ this.modalHide }
                info={ this.getInfo }
                update={ this.updateModalData }
                open={ this.state.openTask }
              />
              <ModalApproveSale
                data={ this.state.sale }
                hide={ this.modalHide }
                info={ this.getInfo }
                update={ this.updateModalData }
                open={ this.state.openSale }
              />
            </div>
        }
      </div>
    );
  }
}

export default Navigation;
