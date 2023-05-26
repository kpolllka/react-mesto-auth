import isOkRegister from '../images/isOkRegister.svg';
import isNotOkRegister from '../images/isNotOkRegister.svg';

function InfoToolTip({ isOpen, onClose, status }) {
    
  return (
    <div className={`popup popup__infotooltip ${isOpen ? `popup_opened` : ''}`}>
      <div className='popup__container popup__container-infotooltip'>
        <button className='popup__close-icon' onClick={onClose} type='button'/>
        <img src={status ? isOkRegister : isNotOkRegister} className='popup__image' alt={status ? 'Вы успешно зарегистрировались.' : 'Что-то пошло не так! Попробуйте еще раз.'}/>
      </div>
    </div>
  );
}

export default InfoToolTip;