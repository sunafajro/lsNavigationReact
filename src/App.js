import React from 'react';

class Navigation extends React.Component {
  /* описываем первоначальное состояние */
  state = {
    elements: [],
    cnt: {
      messages: 0,
      tasks: 0,
      expenses: 0,
      sales: 0
    }
  }

  componentDidMount () {
      
  }

  render () {
      return (
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
                      this.state.elements ?
                      this.state.elements.map(item => {
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
      );
  }
}

export default Navigation;
