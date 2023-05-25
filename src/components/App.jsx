import { useState, useEffect, useCallback } from "react";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';



function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);
  const [stateInfoPopup, setStateInfoPopup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCardsInfo()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((error) => console.log(`Ошибка ${error}`));
    }
  }, [loggedIn]);

   
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    // setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen); //аналог выше
  }
  
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }
  
  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.toggleLike(card._id, isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    }).catch((error) => console.log(`Ошибка ${error}`));
  }

  function handleCardDelete(card) {
    api.delCard(card._id)
    .then(()=>{
      setCards(cards.filter((c)=> c._id !== card._id));
    }).catch((error) => console.log(`Ошибка ${error}`));
  }

  const handleUpdateUser = (data) => {
    api.setUserEdit(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      }).catch((error) => console.log(`Ошибка ${error}`));
  }

  const handleUpdateAvatar = (data) => {
    api.setAvatarEdit(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      }).catch((error) => console.log(`Ошибка ${error}`));
  }

  const handleAddPlaceSubmit = (data) => {
    api
      .createNewCards(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }).catch((error) => console.log(`Ошибка ${error}`));
  }
  
  const handleTokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token).then((res) => {
        if (res) {
          setLoggedIn(true);
          setUserData(res.data.email);
          navigate("/", { replace: true });
        }
      }).catch((error) => console.log(`Ошибка ${error}`));
    }    
  })

  useEffect(() => {
    handleTokenCheck();
  }, [handleTokenCheck])

  const onLogin = (email, password) => {
    auth.authorize(email, password).then((data) => {
      if (data.token) {
        handleTokenCheck();
        setLoggedIn(true);
        navigate('/', { replace: true });
      }
    }).catch((error) => console.log(`Ошибка ${error}`));
  }

  const onSignOut = () => {
    localStorage.removeItem('token');
    setUserData('');
    setLoggedIn(false);
    navigate('/signin', { replace: true });
    console.log("ghbdtn");
  }

  const onRegister = (email, password) => {
    auth.register(email, password).then(() => {
      navigate('/signin', { replace: true });
      setStateInfoPopup(true);
    })
    .catch((error) => {console.log(`Ошибка ${error}`);
    setStateInfoPopup(false);
    })
    .finally(() => {
      setInfoPopupOpen(true);
    })
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>

        <Header email={userData} onSignOut={onSignOut} />

        <Routes>
          <Route path="signup" element={<Register onRegister={onRegister} />} />
          <Route path="/signin" element={<Login onLogin={onLogin} />} />
          <Route path='/' element={<ProtectedRouteElement
            element={Main}
            loggedIn={loggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />} />
        </Routes>

        <Footer />        

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        
        <PopupWithForm
          title="Вы уверены?"
          name="popup-delete-cards"
          onClose={closeAllPopups}
          textButton="Да"
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        {/* <InfoTooltip isOpen={isInfoPopupOpen} onClose={closeAllPopups} state={stateInfoPopup} /> */}

      </CurrentUserContext.Provider>
    </>
  );
}

export default App;