import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class ModalApproveSale extends React.Component {
  state = {
    fetchError: false,
    fetchErrorText: ''
  }

  clearErrors = () => {
    this.setState({
      fetchError: false,
      fetchErrorText: ''
    });
  }

  setViewed = (id, status) => {
    const body = JSON.stringify({ 
      id,
      status 
    });

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
  	    this.props.hide('openSale')
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
      setTimeout(() => this.clearErrors(), 3000);
    });
  }

  render () {
    return (
      <Modal isOpen={ this.props.open } onRequestHide={ () => this.props.hide('openSale') }>
        <ModalHeader>
          <ModalClose onClick={ () => this.props.hide('openSale') }/>
          <ModalTitle>{ this.props.data.title }</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p><strong>От кого:</strong> <span className="text-success">{ this.props.data.user }</span></p>
          <p>Прошу подтвердить скидку { this.props.data.saleName }
          для клиента <a href={ '/studname/view?id=' + this.props.data.clientId }>{ this.props.data.clientName }</a>.</p>
          {
            this.state.fetchError ? 
              <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
              : ''
          }
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.sid, 'refuse') }>Отказать</button>
          <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.sid, 'accept') }>Подтвердить</button>
        </ModalFooter>
      </Modal>
    );
  }
}

/* проверяем props */
ModalApproveSale.propTypes = {
  data: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default ModalApproveSale;
