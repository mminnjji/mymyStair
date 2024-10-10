import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './MainPage.css';
import defaultProfileImage from '../assets/images/signup-icon.png';
import chatbotImage from '../assets/images/chatbot1.png';
import message from '../assets/images/message.png';
import askicon from '../assets/images/askicon.png';
import exit from '../assets/images/x.png';
import book from '../assets/images/book.png';
import book2 from '../assets/images/book2.png'; // 활성화 상태일 때의 이미지
import edit from '../assets/images/edit.png';
import edit2 from '../assets/images/edit2.png'; // 활성화 상태일 때의 이미지
import logout from '../assets/images/log-out.png';
import logout2 from '../assets/images/log-out2.png';
import Chatbot from './chatbot';


function MainPage() {
  const [userName, setUserName] = useState(''); // 사용자의 이름을 저장할 상태 변수
  const [profileImagePath, setProfileImagePath] = useState(defaultProfileImage); // 프로필 이미지를 저장할 상태 변수
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]); // 빈 배열로 초기화
  const [isRectangleVisible, setIsRectangleVisible] = useState(false); 
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // 챗봇 팝업 상태
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const location = useLocation();
  const selectedCategory = location.state?.selectedCategory;

  const handleOpenChatbot = () => {
    // 입력된 text를 서버로 보내는 fetch 요청
    fetch('/api/write_process/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }),
    })
    .then(response => response.json())  // response를 JSON으로 파싱
    .then(data => {
      if (data.status === 200) {
        const bookId = data.bookId;  // bookId가 있는지 확인
        if (bookId) {
          // API 요청이 성공하면 팝업을 열고 데이터와 함께 전달
          setIsChatbotOpen(true);  // 챗봇 팝업 열기
          navigate(`/chatbot/${bookId}`);  // bookId가 있을 때 navigate
        } else {
          console.error('bookId is missing in the response:', data);
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  const handleOpenChatbot2 = () => {
    setIsChatbotOpen(true); // 챗봇 팝업 열기
  };
  const handleCloseChatbot = () => {
    setIsWarningVisible(true); // 경고 메시지 보이기
  };

  const handleConfirmClose = () => {
    setIsChatbotOpen(false); // 챗봇 팝업 닫기
    setIsWarningVisible(false); // 경고 메시지 숨기기
  };

  const handleCancelClose = () => {
    setIsWarningVisible(false); // 경고 메시지 숨기기
  };

  const handleInquiryClick = () => {
    setIsRectangleVisible(!isRectangleVisible);
  };
  
  const navigate = useNavigate();
  const handleMenuClick = () => {
    setIsSidebarVisible(true);
  };

  const handleExitClick = () => {
    setIsSidebarVisible(false);
  };

  const handleModifyClick = () => {
    navigate('/modifyinfo');
  };


  useEffect(() => {
    fetch('/api/get_user_info')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProfileImagePath(data.imagePath || defaultProfileImage); // 프로필 이미지 경로를 상태에 저장
        } else {
          console.error(data.message);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [navigate]);

  const handleProfileClick = () => {
    navigate('/my-autobiography');
  };

  const handleSubmit = () => {
    fetch('/api/write_process/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text, category : selectedCategory }),
    })
    .then(response => response.json())  // response를 JSON으로 파싱
    .then(data => {
      if (data.status === 200) {
        const bookId = data.bookId;  // 여기에 bookId가 있는지 확인
        if (bookId) {
          navigate(`/chatbot/${bookId}`);  // bookId가 있을 때만 navigate
        } else {
          console.error('bookId is missing in the response:', data);
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleCreateBook = () => {
    fetch('/api/write_process/book_reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text , category : selectedCategory}),  // 'text' 변수에 담긴 내용을 'content'로 전송
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);  // 서버 응답 확인
      if (data.status === 200) {
        const bookId = data.bookId;
        navigate(`/book-reading/${bookId}`, { state: { selectedCategory } });
      }
    })
    
    .catch(error => {
      console.error('Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    });
  };  

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        navigate('/');  // 로그아웃 성공 후 메인 페이지로 이동
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="main-page">
      <header className="main-header">
        <button className="menu-button" onClick={handleMenuClick}>☰</button>
        <button className="profile-button" onClick={handleProfileClick}>
          <img src={profileImagePath} alt="Profile" className="profile-image"
           />
        </button>
      </header>

      <aside className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <img src={profileImagePath} alt="Profile" className="profile-image2" />
        <div className="profile-name">{userName}</div>
        <nav className="sidebar-nav">
        <ul>
          <li>
            <img src={book} alt="Book" className="icon book-icon" onClick={handleProfileClick} />
          </li>
          <li>
            <img src={edit} alt="Edit" className="icon edit-icon" onClick={handleModifyClick}/>
          </li>
          <li>
            <img src={logout} alt="Logout" className="icon logout-icon" onClick={handleLogout}/>
          </li>
        </ul>
        </nav>
        <img src={exit} alt="Exit" className="exit" onClick={handleExitClick} />
      </aside>

      <div className="main-content">
        <div className="title-image-container">
        <img src={message} alt="message" className="message" />
          <h1 className="main-title">자서전에 들어갔으면 하는 내용을 적어주세요!</h1>
          <img src={chatbotImage} alt="Chatbot" className="main-image" />
        </div>
        <div className="text-container">
        <textarea
          className="main-textarea"
          placeholder="내 인생의 사건에 대해서 적어주세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        </div>
        <div className="button-container">
        <button className="question-button" onClick={handleSubmit}>입력내용으로 질문받기</button>
          <button className="create-book-button" onClick={handleCreateBook}>
            자서전 바로 만들기
          </button>
          <button className="button" onClick={() => navigate('/book-reading2')}>
            자서전 제작 페이지
          </button>
        </div>
      </div>
      <div className="fixed-inquiry-icon" onClick={handleInquiryClick}>
        <img src={askicon} alt="문의하기 아이콘" />
      </div>
      {isRectangleVisible && (
        <div className="vertical-rectangle">
          <ul>
            <li onClick={() => window.location.href = 'https://open.kakao.com/o/s9YXw5Sg'}>
              채팅 상담</li>
            <li onClick={() => navigate('/customerinquiry')}>1:1 문의</li>
          </ul>
        </div>
      )}
      {/* 챗봇 팝업 창을 조건부로 렌더링 */}
    {isChatbotOpen && (
        <div className="chatbot-popup">
          <Chatbot onClose={handleCloseChatbot} /> {/* onClose prop 전달 */}
        </div>
      )}
    {/* 경고 메시지 창 */}
    {isWarningVisible && (
        <div className="warning-popup">
          <p>창을 닫으면 대화 내용이 사라질 수 있습니다.<br/>그래도 닫겠습니까?</p>
          <div className="button-container">
            <button onClick={handleConfirmClose}>Yes</button>
            <button onClick={handleCancelClose}>No</button>
          </div>
        </div>
      )}
    
    </div>
    
  );
}

export default MainPage;