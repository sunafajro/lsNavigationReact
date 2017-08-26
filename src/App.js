import React from 'react';

class Navigation extends React.Component {
  /* описываем первоначальное состояние */
  state = {
    fetchInProgress: false,
    navElements: [],
    cnt: {
      messages: 0,
      tasks: 0,
      expenses: 0,
      sales: 0
    },
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
            <nav id="top-nav" className="navbar navbar-default navbar-fixed-top">
              <div className="container-fluid">
                  <div className="navbar-header">
                      <button
                        type="button"
                        data-toggle="collapse"
                        data-target="#top-nav-collapse"
                        className="navbar-toggle">
                          <span className="sr-only">Toggle navigation</span> <span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span>
                    </button>
                  </div>
                  <div id="top-nav-collapse" className="collapse navbar-collapse">
                      <ul id="nav-links" className="navbar-nav nav">
                        { 
                          this.state.navElements ?
                          this.state.navElements.map(item => {
                            <li key={ item.id }>
                              <a href={ item.url }>
                                <span aria-hidden="true" className={ item.classes }></span>
                                { 
                                  item.hasBadge ? 
                                  <span className="badge">{ this.state.cnt[item.id] }</span>
                                  : ''
                                }
                              </a>
                            </li>
                          }) : ''
                        }
                      </ul>
                  </div>
              </div>
            </nav>
      }
      </div>
    );
  }
}

export default Navigation;
