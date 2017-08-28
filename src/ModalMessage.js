import React from 'react';
import PropTypes from 'prop-types';

class ModalMessage extends React.Component {
  state = {
    fetchError: false,
    fetchErrorText: ''
  }

  setViewed = (id) => {
    const body = JSON.stringify({ id });

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
        this.props.hide('.message-modal');
        this.props.update('message');
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
      <div className="modal fade message-modal" id="message-modal" tabIndex="-1" role="dialog" aria-labelledby="message-modal-label">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
              <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="message-modal-label">{ this.props.data.title }</h4>
              </div>
              <div className="modal-body">
                <p><strong>От кого:</strong> <span className="text-primary">{ this.props.data.sender }</span></p>
                <p><strong>Текст:</strong></p> <div dangerouslySetInnerHTML={{ __html: this.props.data.body }}></div>
                {
                  this.props.data.image ?
                  <p><strong>Файл:</strong><br />
                    <img src={ this.props.data.image } alt="image" width="200px" />
                  </p> : ''
                }
                {
                  this.state.fetchError ? 
                    <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
                    : ''
                }
              </div>
            <div className='modal-footer'>
              <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.rid) }>Я внимательно прочитал!</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* проверяем props */
ModalMessage.propTypes = {
    data: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

export default ModalMessage;