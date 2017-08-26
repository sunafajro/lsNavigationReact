import React from 'react';
import PropTypes from 'prop-types';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <li>
        <a
          href={ this.props.data.url }
          data-method={ this.props.data.post ? 'post' : '' }
        >
          <span aria-hidden="true" className={ this.props.data.classes } title={ this.props.data.title }></span>
          { 
            this.props.data.hasBadge ? 
              <span className="badge" style={{ marginLeft: '2px' }}>{ this.props.data.cnt }</span>
            : ''
          }
        </a>
      </li>
    );
  }
}

/* проверяем props */
ListItem.propTypes = {
  data: PropTypes.object.isRequired
}

export default ListItem;
