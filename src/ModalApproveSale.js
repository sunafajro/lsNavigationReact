import React from 'react';
import PropTypes from 'prop-types';

class ModalApproveSale extends React.Component {
  state = {
    fetchError: false,
    fetchErrorText: ''
  }

  setViewed = (id) => {
    const body = JSON.stringify({ id });

    fetch('/salestud/approve', 
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
      if (!response.ok) {
        throw Error(response.statusText);
        return response;
      } else {
        return response.json();
      }
    })
    .then(json => {
      if (json.result) {
	    this.setState({
	      fetchError: false,
	      fetchErrorText: ''
	    });
	    this.props.hide('.sale-modal');
	    this.props.update('sale');
	    this.props.info('counters');
      } else {
        throw Error('Произошла ошибка');
      }
    })
    .catch(err => {
      /* если ошибка, выставляем флаг и сохраняем текст ошибки */
      this.setState({
        fetchError: true,
        fetchErrorText: err
      });
    });
  }

  render () {
    return (
        <div className="modal fade sale-modal" id="sale-modal" tabIndex="-1" role="dialog" aria-labelledby="sale-modal-label">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="sale-modal-label">Подтвердить скидку.</h4>
                </div>
                <div className="modal-body">
                    <p><strong>От кого:</strong> <span className="text-success">{ this.props.data.user }</span></p>
                    <p>Прошу подтвердить скидку { this.props.data.saleName }
                    для клиента <a href={ '/studname/view?id=' + this.props.data.clientId }>{ this.props.data.clientName }</a>.</p>
                    {
                      this.state.fetchError ? 
                        <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
                        : ''
                    }
               </div>
               <div className="modal-footer">
                    <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.sid) }>Подтверждаю!</button>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

/* проверяем props */
ModalApproveSale.propTypes = {
  data: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
}

export default ModalApproveSale;
