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
import { getCsrfToken } from './Utils.js';

class ModalMessage extends React.Component {
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
    getCsrfToken()
      .then(csrf => {
        csrf.id = id;
        const body = JSON.stringify(csrf);
        fetch('/message/response',
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
            } else {
              return response.json();
            }
          })
          .then(result => {
            this.props.hide('openMessage')
            this.props.update('message');
            this.props.info('counters');
          })
          .catch(err => {
            /* если ошибка, выставляем флаг и сохраняем текст ошибки */
            this.setState({
              fetchError: true,
              fetchErrorText: err
            });
            setTimeout(() => this.clearErrors(), 3000);
          });
      })
      .catch(error => {
        /* если ошибка, выставляем флаг и сохраняем текст ошибки */
        this.setState({
          fetchError: true,
          fetchErrorText: err
        });
        setTimeout(() => this.clearErrors(), 3000);
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.open} onRequestHide={() => this.props.hide('openMessage')}>
        <ModalHeader>
          <ModalClose onClick={() => this.props.hide('openMessage')} />
          <ModalTitle>{this.props.data.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p><strong>От кого:</strong> <span className="text-primary">{this.props.data.sender}</span></p>
          <p><strong>Текст:</strong></p> <div dangerouslySetInnerHTML={{ __html: this.props.data.body }}></div>
          {
            this.props.data.image ?
              <p><strong>Файл:</strong><br />
                <img src={this.props.data.image} alt="image" width="200px" />
              </p> : ''
          }
          {
            this.state.fetchError ?
              <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
              : ''
          }
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => this.setViewed(this.props.data.rid)}>Я внимательно прочитал!</button>
        </ModalFooter>
      </Modal>
    );
  }
}

/* проверяем props */
ModalMessage.propTypes = {
  data: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default ModalMessage;