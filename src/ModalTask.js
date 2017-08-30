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

class ModalTask extends React.Component {
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

  setViewed = (id) => {
    const body = JSON.stringify({ id });

    fetch('/ticket/accept', 
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
        this.props.hide('openTask')
        this.props.update('task');
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
      <Modal isOpen={ this.props.open } onRequestHide={ () => this.props.hide('openTask') }>
        <ModalHeader>
          <ModalClose onClick={ () => this.props.hide('openTask') }/>
          <ModalTitle>{ this.props.data.title }</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p><strong>От кого:</strong> <span className="text-success">{ this.props.data.creator }</span></p>
          <p><strong>Кому:</strong> <span className="text-primary">{ this.props.data.executor }</span></p>
          <p><strong>Текст:</strong>{ this.props.data.text }</p>
          <p><strong>Состояние:</strong> <span className={ this.props.data.color }>{ this.props.data.status }</span></p>
          {
            this.state.fetchError ? 
              <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
              : ''
          }
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.tid) }>Я внимательно прочитал!</button>
        </ModalFooter>
      </Modal>
    );
  }
}

/* проверяем props */
ModalTask.propTypes = {
  data: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default ModalTask;