import React from 'react';
import PropTypes from 'prop-types';

class ModalTask extends React.Component {
  state = {
    fetchError: false,
    fetchErrorText: ''
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
        this.setState({
          fetchError: false,
          fetchErrorText: ''
        });
        this.props.hide('.task-modal');
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
    });
  }

  render () {
    return (
        <div className="modal fade task-modal" id="task-modal" tabIndex="-1" role="dialog" aria-labelledby="task-modal-label">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="task-modal-label">{ this.props.data.title }</h4>
                </div>
                <div className="modal-body">
                    <p><strong>От кого:</strong> <span className="text-success">{ this.props.data.creator }</span></p>
                    <p><strong>Кому:</strong> <span className="text-primary">{ this.props.data.executor }</span></p>
                    <p><strong>Текст:</strong>{ this.props.data.text }</p>
                    <p><strong>Состояние:</strong> <span className={ this.props.data.color }>{ this.props.data.status }</span></p>
                    {
                      this.state.fetchError ? 
                        <div className="alert alert-danger"><strong>Ошибка!</strong> Не удалось подтвердить прочтение.</div>
                        : ''
                    }
               </div>
               <div className="modal-footer">
                    <button className="btn btn-primary" onClick={ () => this.setViewed(this.props.data.tid) }>Я внимательно прочитал!</button>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

/* проверяем props */
ModalTask.propTypes = {
  data: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
}

export default ModalTask;