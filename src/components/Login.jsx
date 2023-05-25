import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Login = (props) => {
  const [values, setValues] = useState({});

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onLogin(values.email, values.password);
  }

  useEffect(() => {
    setValues({ email: '', password: '' });
  }, []);

  return (
      <div className="auth">
        <h2 className="auth__title">Вход</h2>
        <form className="auth__form" name="auth" onSubmit={handleSubmit}>
          <input className="auth__input" name="email" value={values.email || ''} onChange={handleChange} id="email" type="email" placeholder="Email" required />
          <span className="auth__error email-input-error" type="text"></span>
          <input className="auth__input" name="password" value={values.password || ''} onChange={handleChange} id="password" type="password" placeholder="Пароль" required />
          <span className="auth__error password-input-error" type="text"></span>
          <div className="auth__button-container">
            <button className="auth__button" type="submit">Войти</button>
            <p className="auth__text">Еще не зарегистрированы?&nbsp;<Link to='/signup' className="auth__text-link">Регистрация</Link></p>
          </div>
        </form>
      </div>
  )
}

export default Login;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import * as auth from "../utils/auth";

// const Login = ({ onLogin }) => {
//   const [formValue, setFormValue] = useState({ email: '', password: '' });
  
//   const navigate = useNavigate();

//   const handleChange = (evt) => {
//     const { name, value } = evt.target;
//     setFormValue({ ...formValue, [name]: value });
//   }

//   const handleSubmit = (evt) => {
//     evt.preventDefault();
//     if (!formValue.email || !formValue.password) {
//       return;
//     }
//     auth.authorize(formValue.email, formValue.password)
//       .then((data) => {
//         console.log(data)
//         if (data) {
//           setFormValue({ email: '', password: '' });
//           onLogin();
//           navigate('/', { replace: true });
//         }
//       }).catch((error) => console.log(`Ошибка ${error}`));
//   }

//   return (
//       <div className="auth">
//         <h2 className="auth__title">Вход</h2>
//         <form className="auth__form" name="auth" onSubmit={handleSubmit}>
//           <input className="auth__input" name="email" value={formValue.email || ''} onChange={handleChange} id="email" type="email" placeholder="Email" required />
//           <span className="auth__error email-input-error" type="text"></span>
//           <input className="auth__input" name="password" value={formValue.password || ''} onChange={handleChange} id="password" type="password" placeholder="Пароль" required />
//           <span className="auth__error password-input-error" type="text"></span>
//           <div className="auth__button-container">
//             <button className="auth__button" type="submit">Войти</button>
//             <p className="auth__text">Еще не зарегистрированы?&nbsp;<Link to='/signup' className="auth__text-link">Регистрация</Link></p>
//           </div>
//         </form>
//       </div>
//   )
// }

// export default Login;