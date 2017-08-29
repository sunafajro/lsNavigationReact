import React from 'react';
import PropTypes from 'prop-types';
import ListItems from './ListItem';
import Timer from './Timer';

class NavBar extends React.Component {

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
            <Timer logout={ this.props.logout }/>
            {
              this.props.isFetching ?
                <li>
                  <span className="navbar-text">Загружаем панель навигации...</span>
                </li>
                :
                this.props.navElements.length ?
                  this.props.navElements.map(item => 
                    <ListItems key={ item.id } data={ item } />
                  ) : ''
            }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

/* проверяем props */
NavBar.propTypes = {
  navElements: PropTypes.array.isRequired,
  logout: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default NavBar;